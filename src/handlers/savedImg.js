import fsp from "fs/promises";
import cheerio from "cheerio";
import fetch from "node-fetch";
import path from "path";

export default (filePath) => {
  const pathDirFiles = filePath.replace(".html", "_files");

  fsp
    .readFile(filePath, "utf-8")
    .then((resRead) => {
      const $ = cheerio.load(resRead);
      const items = $(
        '[content$=".png"], [content$=".jpg"], [href$=".png"], [href$=".jpg"], [src$=".png"], [src$=".jpg"]'
      );

      fsp
        .mkdir(pathDirFiles, { recursive: true })
        .then(() => {
          items.each((i, el) => {
            const src =
              $(el).attr("content") || $(el).attr("href") || $(el).attr("src");

            if (src) {
              const fileName = path.basename(new URL(src).pathname);
              const filePathToWrite = path.join(pathDirFiles, fileName);

              fetch(src)
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
                  fsp
                    .readFile(filePath, "utf-8")
                    .then((resRead2) => {
                      const pathOnImgFile = `${pathDirFiles}\\${
                        src.split("/").reverse()[0]
                      }`;
                      const updateHtml = resRead2.replace(
                        new RegExp(src, "g"),
                        pathOnImgFile
                      );
                      fsp
                        .writeFile(filePath, updateHtml, "utf-8")
                        .then((resWrite) => {})
                        .catch((errWrite) => {
                          console.error("Error write file:", errWrite.message);
                        });
                    })
                    .catch((errRead2) => {
                      console.error("Error reading file:", errRead2.message);
                    });
                })
                .catch((err) => {
                  console.error(
                    `Error fetching or saving ${src}: ${err.message}`
                  );
                });
            } else {
              console.log("No valid src attribute found");
            }
          });
        })
        .catch((errDir) => {
          console.error(`Directory creation error: ${errDir.message}`);
        });
    })
    .catch((errRead) => {
      console.error("Error reading file:", errRead.message);
    });
};
