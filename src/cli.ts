#!/usr/bin/env node

import { Command } from 'commander';
const program = new Command();

import chalk from 'chalk';
import interpretBarcode from './cli-logic.js';

// Get the version from package.json
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const data = JSON.parse(readFileSync(join(__dirname, './../package.json'), 'utf8'));
const { version } = data;

program
  .name('uic918')
  .version(version)
  .description('CLI Parser for UIC-918.3 barcodes');

// program
// .usage('[options] <file ...>')
// .option('-i, --image', 'if file is an image (png,jpeg,...)')
// .option('-s, --signature', 'verify the barcode signature')
// // .parse(process.argv);
// .argument('<string>');
program.command('image')
  .description('Parse an image file (png, jpeg, ...)')
  .argument('<pathToFile>', 'path of image file(s) to parse')
  .option('-s, --signature', 'verify the barcode signature')
  .action((pathToFile, options) => {
    drawIntro();
    const verifySignature = options.signature
    const opts = verifySignature ? { verifySignature: true } : {}
    interpretBarcode(pathToFile, opts);
  })
function drawIntro(): void {
  //  clear();

  const ascii_art = `
██╗   ██╗██╗ ██████╗     █████╗  ██╗ █████╗     ██████╗         ██╗███████╗
██║   ██║██║██╔════╝    ██╔══██╗███║██╔══██╗    ╚════██╗        ██║██╔════╝
██║   ██║██║██║         ╚██████║╚██║╚█████╔╝     █████╔╝        ██║███████╗
██║   ██║██║██║          ╚═══██║ ██║██╔══██╗     ╚═══██╗   ██   ██║╚════██║
╚██████╔╝██║╚██████╗     █████╔╝ ██║╚█████╔╝    ██████╔╝██╗╚█████╔╝███████║
 ╚═════╝ ╚═╝ ╚═════╝     ╚════╝  ╚═╝ ╚════╝     ╚═════╝ ╚═╝ ╚════╝ ╚══════╝
                                                                           `

  console.log(
    chalk.green(
      ascii_art
    ))
}

// function err(string: string): void {
//   console.error(chalk.red(`\n  ERROR: ${string}\n`));
// }
program.parse();
