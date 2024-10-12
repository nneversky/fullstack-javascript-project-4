import axios from 'axios';
import fsp from 'fs/promises';
import path from 'path';
import saveContent from '../src/saveContent.js';
import debug from 'debug';

const log = debug('page-loader');

export default (url, filePath) => {
  const pathOnFiles = filePath.replace('.html', '_files');

  return axios.get(url)
    .then((response) => {
      log('Received html file');

      return fsp.access(filePath)
        .catch(() => {
          const dir = path.dirname(filePath);
          return fsp.mkdir(dir, { recursive: true })
            .then(() => log(`Created directory: ${dir}`));
        })
        .then(() => fsp.writeFile(filePath, response.data))
        .then(() => saveContent(pathOnFiles, filePath, url));
    })
    .catch((error) => {
      log(`Error: ${error.message}`);
      console.error(`Error: ${error.message}`);
    });
};