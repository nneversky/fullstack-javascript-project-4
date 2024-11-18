import { fileURLToPath } from 'url';
import path from 'path';
import downloadPage from './utils.js';
import debug from 'debug';

const log = debug('page-loader');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const processName = (name, replacer = '-') => name.match(/\w+/g)?.filter((x) => x).join(replacer)

export const getExtension = (fileName) => {
  path.extname(fileName)
} 

export default (pageUrl, options) => {
  const url = new URL(pageUrl)
};

export const urlToFilename = (link, defaultFormat = '.html') => {
  const {dir, name, ext} = path.parse(link)
  const slug = processName(path.join(dir, name))
  const format = ext || defaultFormat
  return `${slug}${format}`
}

export const urlToDirname = (link, postfix = '_files') => {
  const {dir, name, ext} = path.parse(link)
  const slug = processName(path.join(dir, name))
  return `${slug}${postfix}`
}