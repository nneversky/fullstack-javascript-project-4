import { fileURLToPath } from 'url';
import path from 'path';
import downloadPage from './utils.js';
import debug from 'debug';

const log = debug('page-loader');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (url, options) => {
  return new Promise((resolve, reject) => {
    try {
      const hrefURL = new URL(url);
      const nameHtmlFile = `${hrefURL.host.replaceAll('.', '-')}${hrefURL.pathname.replaceAll('/', '-')}.html`;
      const filePath = (options.output || path.join(__dirname, '..')) + '\\' + nameHtmlFile;
      log(`Create filepath: ${filePath}`);
      downloadPage(url, filePath);
      return resolve(filePath);
    } catch (err) {
      return reject(err);
    }
  });
};
