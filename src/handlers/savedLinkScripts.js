import fsp from "fs/promises";
import cheerio from "cheerio";
import fetch from "node-fetch";
import path from "path";
import debug from "debug";

const log = debug('page-loader')

export default (pathOnFiles, filePathHtml, url) => {
  return new Promise((resolve, reject) => {
    fsp
      .readFile(filePathHtml, "utf-8")
      .then((resRead) => {
        const $ = cheerio.load(resRead);
        const links = $("link, script");
        const urlDefHost = new URL(url).host;
        const arrLinks = [];

        links.each((i, link) => {
          const src = $(link).attr("href") || $(link).attr("src");
          if (src) {
            try {
              const urlLink = new URL(src, url);
              if (urlLink.host === urlDefHost) arrLinks.push(urlLink.href);
            } catch {
              const absoluteSrc = new URL(src, url).href;
              arrLinks.push(absoluteSrc);
            }
          }
        });

        return Promise.all(
          arrLinks.map((value) => {
            const fileName = path.basename(value);
            const tempPathOnFile = path.join(pathOnFiles, fileName);

            return fetch(value)
              .then((res) => {
                if (!res.ok) {
                  throw new Error(
                    `Failed to fetch ${value}: ${res.statusText}`
                  );
                }
                return res.arrayBuffer();
              })
              .then((arrayBuffer) => {
                const buffer = Buffer.from(arrayBuffer);
                return fsp.writeFile(tempPathOnFile, buffer);
              })
              .then(() => {
                console.log(`✅ ${value}`);
                return tempPathOnFile;
              })
              .catch((err) => {
                console.error(
                  `Error fetching or saving ${value}: ${err.message}`
                );
                throw err;
              });
          })
        ).then((savedPaths) => {
          let updatedHtml = resRead;
          savedPaths.forEach((tempPathOnFile, index) => {
            const originalUrl = arrLinks[index];
            updatedHtml = updatedHtml.replace(
              new RegExp(originalUrl, "g"),
              tempPathOnFile
            );
          });
          return fsp.writeFile(filePathHtml, updatedHtml, "utf-8");
        });
      })
      .then(() => {
        log(`All files from link and script tags are saved on path: ${pathOnFiles}`)
        resolve();
      })
      .catch((err) => {
        console.error(`Error: ${err.message}`);
        reject(err);
      });
  });
};
