import path from 'path';
import cheerio from 'cheerio';
import { urlToFilename, urlToDirname } from './utils.js';
import debug from 'debug';

const log = debug('page-loader');

const attributeMapping = {
  link: 'href',
  script: 'src',
  img: 'src',
};

const prepareAssets = (website, assetsDir, htmlData) => {
  const $ = cheerio.load(htmlData);
  const assets = [];

  Object.entries(attributeMapping).forEach(([tagName, attrName]) => {
    const elements = $(tagName).toArray();

    const elementsWithUrls = elements
      .map((element) => $(element))
      .filter(($element) => $element.attr(attrName))
      .map(($element) => {
        try {
          const url = new URL($element.attr(attrName), website);
          return { $element, url };
        } catch (e) {
          log(`Invalid URL: ${$element.attr(attrName)} - ${e.message}`);
          return null;
        }
      })
      .filter(Boolean)
      .filter(({ url }) => url.hostname === new URL(website).hostname);

    elementsWithUrls.forEach(({ $element, url }) => {
      const slug = urlToFilename(`${url.hostname}${url.pathname}`);
      const assetPath = path.join(assetsDir, slug);
      assets.push({ url: url.toString(), filename: slug });
      $element.attr(attrName, assetPath);
    });
  });

  return { updatedHtml: $.html(), assets };
};

export default (pageUrl, options = {}) => {
  const outputDirName = options.outputDirName || path.resolve(process.cwd(), 'output');
  const url = new URL(pageUrl);
  const slug = `${url.hostname}${url.pathname}`;
  const filename = urlToFilename(slug);

  const fullOutputDirname = path.resolve(outputDirName);
  const [name, ext] = filename.split('.');
  const extension = ext === 'html' ? '' : '.html';
  const fullOutputFilename = path.join(fullOutputDirname, `${name}${extension}`);

  const assetsDirname = urlToDirname(slug);
  const fullOutputAssetsDirname = path.join(fullOutputDirname, assetsDirname);

  log(`Preparing to save page to: ${fullOutputFilename}`);
  log(`Assets will be stored in: ${fullOutputAssetsDirname}`);

  return {
    fullOutputFilename,
    fullOutputAssetsDirname,
    prepareAssets: (htmlData) => prepareAssets(pageUrl, fullOutputAssetsDirname, htmlData),
  };
};
