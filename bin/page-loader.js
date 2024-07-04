#!/usr/bin/env node
import { Command } from "commander";
import { pageLoader } from "../src/index.js";

const program = new Command();
program
    .version("0.0.1")
    .arguments("<url>")
    .description("Page loader utility")
    .option("-o, --output [dir]", "output dir (default: \"/home/user/current-dir\")")

    .action((url) => {    
        const options = program.opts();
        const loader = pageLoader(url, options)
      });
program.parse(process.argv);