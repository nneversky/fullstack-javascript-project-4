import { fileURLToPath } from 'url';
import path from 'path';
import { urlToFilename, urlToDirname } from './utils.js';
import debug from 'debug';

const log = debug('page-loader');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getExtension = (fileName) => {
  path.extname(fileName);
};

export default (pageUrl, options) => {
  const url = new URL(pageUrl);
  const slug = `${url.hostname}${url.pathname}`;
  const filename = urlToFilename(slug);
  const fullOutputDirname = path.resolve(process.cwd, options.outputDirName);
  const [name, ext] = filename.split('.');
  const extension = ext === 'html' ? '' : '.html';
  const fullOutputFilename = path.join(fullOutputDirname, filename, extension);
  const assetsDirname = urlToDirname(slug);
  const fullOutputAssetsDirname = path.join(fullOutputDirname, assetsDirname);
};
