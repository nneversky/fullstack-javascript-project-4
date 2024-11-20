import { fileURLToPath } from 'url';
import path from 'path';
import downloadPage from './utils.js';
import debug from 'debug';

const log = debug('page-loader');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getExtension = (fileName) => {
  path.extname(fileName);
};

export default (pageUrl, options) => {
  const url = new URL(pageUrl);
};
