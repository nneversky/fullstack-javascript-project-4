import axios from "axios";
import fsp from "fs/promises";
import path from "path";
import saverImg from "./handlers/savedImg.js";
import savedLinkScripts from "./handlers/savedLinkScripts.js";

const startHandler = (filePath, url) => {
  const pathOnFiles = filePath.replace(".html", "_files");
  saverImg(pathOnFiles, filePath)
    .then((resImg) => {
      savedLinkScripts(pathOnFiles, filePath, url)
        .then((resLinkScr) => {
          console.log(`Page was successfully downloaded into ${pathOnFiles}`);
        })
        .catch((errLincScr) => {
          console.error(`Error function errLincScr ${errLincScr}`);
        });
    })
    .catch((errImg) => {
      console.error(`Error function 'saverImg ${errImg}`);
    });
};

export default (url, filePath) => {
  axios
    .get(url)
    .then((response) => {
      fsp
        .access(filePath)
        .then((resAcc) => {
          fsp
            .writeFile(filePath, response.data)
            .then((resWrite) => {
              startHandler(filePath, url);
            })
            .catch((errWrite) => {
              console.log(`Page write error ${errWrite}`);
            });
        })
        .catch((errAcc) => {
          const dir = path.dirname(filePath);
          fsp
            .mkdir(dir, { recursive: true })
            .then((resDir) => {
              fsp
                .writeFile(filePath, response.data)
                .then((resWrite) => {
                  startHandler(filePath, url);
                })
                .catch((errWrite) => {
                  console.error(`Page write error ${errWrite}`);
                });
            })
            .catch((errDir) => {
              console.error(`Directory creation error ${errDir}`);
            });
        });
    })
    .catch((error) => {
      console.error(`Invalid URL ${error}`);
    });
};
