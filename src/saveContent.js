import fsp from 'fs/promises';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import path from 'path';
import debug from 'debug';
import Listr from 'listr';

const log = debug('page-loader');

export default (pathOnFiles, filePathHtml, url) => {
  return fsp
    .readFile(filePathHtml, 'utf-8')
    .then((resRead) => {
      const $ = cheerio.load(resRead);

      const resources = [];
      const elements = $('img, link, script');

      elements.each((i, el) => {
        const src = $(el).attr('href') || $(el).attr('src') || $(el).attr('content');
        if (src) {
          try {
            const searchDomain = (host) => host.split('.').slice(-2).join('.');
            const resourceUrl = new URL(src, url);
            if (searchDomain(resourceUrl.host) === searchDomain(new URL(url).host)) resources.push({ el, url: resourceUrl.href });
          } catch (e) {
            log(`Error parsing URL ${src}: ${e.message}`);
          }
        }
      });

      return fsp.mkdir(pathOnFiles, { recursive: true }).then(() => {
        log(`Creation directory: ${pathOnFiles}`);

        const tasks = resources.map(({ el, url }) => {
          const fileName = path.basename(new URL(url).pathname);
          const filePathToWrite = path.join(pathOnFiles, fileName);

          return {
            title: url.length > 90 ? `${url.slice(0, 90)}...` : url,
            task: () =>
              fetch(url)
                .then((res) => {
                  if (!res.ok) {
                    throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
                  }
                  return res.arrayBuffer();
                })
                .then((arrayBuffer) => {
                  const buffer = Buffer.from(arrayBuffer);
                  return fsp.writeFile(filePathToWrite, buffer).then(() => {
                    const attrName = $(el).attr('href') ? 'href' : 'src';
                    $(el).attr(attrName, path.join(pathOnFiles, fileName));
                  });
                })
                .catch((err) => {
                  log(`Error: ${err}`);
                  console.log(`Error fetching or saving ${url}: ${err.message}`);
                  throw err;
                }),
          };
        });

        return new Listr(tasks, { concurrent: true, exitOnError: false }).run().then(() => {
          const updatedHtml = $.html();
          return fsp.writeFile(filePathHtml, updatedHtml, 'utf-8');
        });
      });
    })
    .then(() => {
      log(`All files are saved on path: ${pathOnFiles}`);
    })
    .catch((err) => {
      log(`Error: ${err.message}`);
    });
};
