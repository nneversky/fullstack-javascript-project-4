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
      throw Error('Invalid URL. Please provide a valid URL.')
    }

    const urlExists = await checkUrlExists(url);
    if (!urlExists) {
      throw Error('URL does not exist or cannot be reached.')
    }

    pageLoader(url, options)
      .then((filepath) => console.log(`Page was successfully downloaded into '${filepath}'\n`))
      .catch((err) => {
        throw Error(err);
      });
  });

program.parse(process.argv);
