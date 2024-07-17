import axios from 'axios';
import fsp from 'fs/promises';
import path from 'path';
import saveContent from '../src/saveContent.js';
import debug from 'debug';

const log = debug('page-loader');

export default (url, filePath) => {
  const pathOnFiles = filePath.replace('.html', '_files');

  axios
    .get(url)
    .then((response) => {
      log('Received html file');
      fsp
        .access(filePath)
        .then((resAcc) => {
          fsp
            .writeFile(filePath, response.data)
            .then((resWrite) => {
              saveContent(pathOnFiles, filePath, url);
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
              log(`Creation directory: ${dir}`);
              fsp
                .writeFile(filePath, response.data)
                .then((resWrite) => {
                  saveContent(pathOnFiles, filePath, url);
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
