import axios from 'axios';
import fsp from 'fs/promises';
import path from 'path';
import saveContent from '../src/saveContent.js';
import debug from 'debug';

const log = debug('page-loader');
const processName = (name, replacer = '-') =>
  name
    .match(/\w+/g)
    ?.filter((x) => x)
    .join(replacer);

export const urlToFilename = (link, defaultFormat = '.html') => {
  const { dir, name, ext } = path.parse(link);
  const slug = processName(path.join(dir, name));
  const format = ext || defaultFormat;
  return `${slug}${format}`;
};

export const urlToDirname = (link, postfix = '_files') => {
  const { dir, name, ext } = path.parse(link);
  const slug = processName(path.join(dir, name));
  return `${slug}${postfix}`;
};

export default (url, filePath) => {
  const pathOnFiles = filePath.replace('.html', '_files');

  return axios
    .get(url)
    .then((response) => {
      log('Received html file');

      return fsp
        .access(filePath)
        .catch(() => {
          const dir = path.dirname(filePath);
          return fsp.mkdir(dir, { recursive: true }).then(() => log(`Created directory: ${dir}`));
        })
        .then(() => fsp.writeFile(filePath, response.data))
        .then(() => {
          saveContent(pathOnFiles, filePath, url);
        });
    })
    .catch((error) => {
      log(`Error: ${error.message}`);
      console.error(`Error: ${error.message}`);
    });
};
