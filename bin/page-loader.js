#!/usr/bin/env node
import { Command } from 'commander';
import axios from 'axios';
import pageLoader from '../src/index.js';

const program = new Command();

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

const checkUrlExists = async (url) => {
  try {
    await axios.get(url);
    return true;
  } catch (err) {
    return false;
  }
};

program
  .version('0.0.1')
  .arguments('<url>')
  .description('Page loader utility')
  .option('-o, --output [dir]', 'output dir (default: "/home/user/current-dir")')
  .action(async (url) => {
    const options = program.opts();

    if (!isValidUrl(url)) {
      console.error('Invalid URL. Please provide a valid URL.');
      process.exit(1);
    }

    const urlExists = await checkUrlExists(url);
    if (!urlExists) {
      console.error('URL does not exist or cannot be reached.');
      process.exit(1);
    }

    pageLoader(url, options)
      .then((filepath) => console.log(`Page was successfully downloaded into '${filepath}'\n`))
      .catch((err) => {
        console.error(err);
        process.exit(1);
      });
  });

program.parse(process.argv);
