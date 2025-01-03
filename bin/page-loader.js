#!/usr/bin/env node
import { Command } from 'commander';
import pageLoader from '../src/index.js';

const program = new Command();

program
  .version('0.0.1')
  .arguments('<url>')
  .description('Page loader utility')
  .option('-o, --output [dir]', 'output dir (default: current working directory)', process.cwd())
  .action(async (url, options) => {
    try {
      const { output } = options;
      const result = await pageLoader(url, { outputDirName: output });
      console.log(`Page successfully downloaded to: ${result.fullOutputFilename}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

program.parse(process.argv);
