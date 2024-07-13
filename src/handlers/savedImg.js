import fsp from 'fs/promises';
import cheerio from 'cheerio';
import fetch from 'node-fetch';
import path from 'path';
import debug from 'debug';
import Listr from 'listr';

const log = debug('page-loader');

export default (pathOnFiles, filePath) => {
  return new Promise((resolve, reject) => {
    fsp
      .readFile(filePath, 'utf-8')
      .then((resRead) => {
        const $ = cheerio.load(resRead);
        const items = $('[content$=".png"], [content$=".jpg"], [href$=".png"], [href$=".jpg"], [src$=".png"], [src$=".jpg"]');

        fsp
          .mkdir(pathOnFiles, { recursive: true })
          .then(() => {
            log(`Creation directory: ${pathOnFiles}`);

            const tasks = items
              .map((i, el) => {
                const src = $(el).attr('content') || $(el).attr('href') || $(el).attr('src');

                if (src) {
                  const fileName = path.basename(new URL(src).pathname);
                  const filePathToWrite = path.join(pathOnFiles, fileName);

                  if (src.length > 90)
                    return {
                      title: src.length > 90 ? `${src.slice(0, 90)}[...].${src.split('.').reverse()[0]}` : src,
                      task: () =>
                        fetch(src)
                          .then((res) => {
                            if (!res.ok) {
                              throw new Error(`Failed to fetch ${src}: ${res.statusText}`);
                            }
                            return res.arrayBuffer();
                          })
                          .then((arrayBuffer) => {
                            const buffer = Buffer.from(arrayBuffer);
                            return fsp.writeFile(filePathToWrite, buffer);
                          })
                          .then(() => {
                            log(`${src}`);
                          })
                          .catch((err) => {
                            log(`Error fetching or saving ${src}: ${err.message}`);
                            throw err;
                          }),
                    };
                } else {
                  return {
                    title: `Skipping invalid src attribute`,
                    task: () => {
                      log(`No valid src attribute found`);
                    },
                  };
                }
              })
              .get();

            return new Listr(tasks, { concurrent: true }).run();
          })
          .then(() => {
            log(`All images saved on path: ${pathOnFiles}`);
            resolve();
          })
          .catch((err) => {
            log(`Error during tasks execution: ${err.message}`);
            reject(err);
          });
      })
      .catch((errRead) => {
        log(`Error reading file: ${errRead.message}`);
        reject(errRead);
      });
  });
};
