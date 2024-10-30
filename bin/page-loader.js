#!/usr/bin/env node
import { Command } from 'commander';
import pageLoader from '../src/index.js';
import { isUrlOnline } from 'is-url-online';

const program = new Command();

program
  .version('0.0.1')
  .arguments('<url>')
  .description('Page loader utility')
  .option('-o, --output [dir]', 'output dir (default: "/home/user/current-dir")')
  .action(async (url) => {
    const options = program.opts();

    isUrlOnline(url).then((online) => {
      if (online) {
        pageLoader(url, options)
          .then((filepath) => console.log(`Page was successfully downloaded, to directory - ${options.output || process.cwd()}`))
          .catch((err) => {
            console.error(err.message);
            process.exit(1);
          });
      } else {
        throw Error('Invalid URL');
      }
    });
  });

program.parse(process.argv);
