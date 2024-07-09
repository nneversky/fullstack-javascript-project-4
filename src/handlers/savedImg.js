import fsp from "fs/promises";
import cheerio from "cheerio";
import fetch from "node-fetch";
import path from "path";

export default (pathOnFiles, filePath) => {
  return new Promise((resolve, reject) => {
    fsp
      .readFile(filePath, "utf-8")
      .then((resRead) => {
        const $ = cheerio.load(resRead);
        const items = $(
          '[content$=".png"], [content$=".jpg"], [href$=".png"], [href$=".jpg"], [src$=".png"], [src$=".jpg"]'
        );

        fsp
          .mkdir(pathOnFiles, { recursive: true })
          .then(() => {
            const promises = [];

            items.each((i, el) => {
              const src =
                $(el).attr("content") ||
                $(el).attr("href") ||
                $(el).attr("src");

              if (src) {
                const fileName = path.basename(new URL(src).pathname);
                const filePathToWrite = path.join(pathOnFiles, fileName);

                const fetchAndSave = fetch(src)
                  .then((res) => {
                    if (!res.ok) {
                      throw new Error(
                        `Failed to fetch ${src}: ${res.statusText}`
                      );
                    }
                    return res.arrayBuffer();
                  })
                  .then((arrayBuffer) => {
                    const buffer = Buffer.from(arrayBuffer);
                    return fsp.writeFile(filePathToWrite, buffer);
                  })
                  .then(() => {
                    console.log(`Success: ${src}`);
                    return fsp.readFile(filePath, "utf-8");
                  })
                  .then((resRead2) => {
                    const pathOnImgFile = `${pathOnFiles}\\${
                      src.split("/").reverse()[0]
                    }`;
                    const updateHtml = resRead2.replace(
                      new RegExp(src, "g"),
                      pathOnImgFile
                    );
                    return fsp.writeFile(filePath, updateHtml, "utf-8");
                  })
                  .catch((err) => {
                    console.error(
                      `Error fetching or saving ${src}: ${err.message}`
                    );
                    throw err;
                  });

                promises.push(fetchAndSave);
              } else {
                console.error("No valid src attribute found");
              }
            });

            return Promise.all(promises);
          })
          .then(() => {
            resolve();
          })
          .catch((err) => {
            console.error(`Directory creation error: ${err.message}`);
            reject(err);
          });
      })
      .catch((errRead) => {
        console.error(`Error reading file:: ${errRead.message}`);
        reject(errRead);
      });
  });
};
