#!/usr/bin/env node
import { Command } from 'commander';
import pageLoader from '../src/index.js';

const program = new Command();
program
  .version('0.0.1')
  .arguments('<url>')
  .description('Page loader utility')
  .option('-o, --output [dir]', 'output dir (default: "/home/user/current-dir")')

  .action((url) => {
    const options = program.opts();
    pageLoader(url, options)
      .then((filepath) => console.log(`Page was successfully downloaded into '${filepath}'\n`))
      .catch((err) => {
        console.log(err)
        process.exit(1)
      });
  });
program.parse(process.argv);
