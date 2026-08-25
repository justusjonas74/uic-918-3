#!/usr/bin/env node

import { Command } from 'commander';
const program = new Command();

import chalk from 'chalk';
import interpretBarcode from './cli-logic.js';
import { addCertificate, listCertificates, showCertificate } from './add_certificate.js';

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
  .option('-s, --verifySignature', 'verify the barcode signature')
  .action((pathToFile, options) => {
    drawIntro();
    const verifySignature = options.verifySignature
    const opts = verifySignature ? { verifySignature: true } : {}
    interpretBarcode(pathToFile, opts);
  });

const certCmd = program.command('certificate').description('Certificate management');
certCmd.command('add')
  .description('Add one or more certificates (PEM) to keys.json')
  .argument('<paths...>', 'path of certificate file(s) or directory to add')
  .action((paths) => {
    try {
      const addedCount = addCertificate(paths);
      if (addedCount > 0) {
        console.log(chalk.green(`Success: ${addedCount} certificate(s) added successfully.`));
      } else {
        console.log(chalk.yellow('No new certificates were added.'));
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'addedCount' in error) {
        const addedCount = (error as { addedCount: number }).addedCount;
        if (addedCount > 0) {
          console.log(chalk.green(`Success: ${addedCount} certificate(s) added successfully.`));
        }
      }
      const msg = error instanceof Error ? error.message : String(error);
      console.error(chalk.red(msg));
      process.exit(1);
    }
  });

certCmd.command('list')
  .description('List all certificates in keys.json')
  .action(() => {
    try {
      const keys = listCertificates();
      if (keys.length === 0) {
        console.log(chalk.yellow('No certificates found.'));
        return;
      }
      const headers = ['Selector', 'Issuer Name', 'RICS', 'Key ID', 'Expires', 'Custom'];
      const rows = keys.map((key) => {
        const rics = String(key.issuerCode?.[0] || '');
        const keyId = String(key.id?.[0] || '');
        const selector = `${rics}:${keyId}`;
        const name = String(key.issuerName?.[0] || '');
        const expires = String(key.endDate?.[0] || 'N/A');
        const isCustom = (key.isCustom?.[0] === true) ? 'Yes' : 'No';
        return [selector, name, rics, keyId, expires, isCustom];
      });
      printTable(headers, rows);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(chalk.red(`Error: ${msg}`));
      process.exit(1);
    }
  });

certCmd.command('show')
  .description('Show detailed information for a certificate')
  .argument('<selector>', 'Selector in format <issuerCode>:<keyId> (e.g. 1080:8)')
  .action((selector: string) => {
    try {
      const key = showCertificate(selector);
      console.log(chalk.bold(`Certificate Details for ${selector}:`));
      console.log(`----------------------------------------`);
      console.log(`Issuer Name:             ${key.issuerName?.[0] || 'N/A'}`);
      console.log(`Issuer Code (RICS):      ${key.issuerCode?.[0] || 'N/A'}`);
      console.log(`Key ID:                  ${key.id?.[0] || 'N/A'}`);
      console.log(`Signature Algorithm:     ${key.signatureAlgorithm?.[0] || 'N/A'}`);
      console.log(`Validity Start Date:     ${key.startDate?.[0] || 'N/A'}`);
      console.log(`Validity End Date (Exp): ${key.endDate?.[0] || 'N/A'}`);
      console.log(`Version Type:            ${key.versionType?.[0] || 'N/A'}`);
      console.log(`Barcode Version:         ${key.barcodeVersion?.[0] || 'N/A'}`);
      console.log(`Is Custom:               ${key.isCustom?.[0] === true ? 'Yes' : 'No'}`);
      
      const allowed = key.allowedProductOwnerCodes;
      if (allowed && Array.isArray(allowed) && allowed.length > 0) {
        console.log(`Allowed Product Owners:`);
        for (const owner of allowed) {
          if (owner && typeof owner === 'object') {
            const typedOwner = owner as { productOwnerCode?: string[]; productOwnerName?: string[] };
            const pCode = typedOwner.productOwnerCode?.[0] || '';
            const pName = typedOwner.productOwnerName?.[0] || '';
            console.log(`  - Code: ${pCode}, Name: ${pName}`);
          } else {
            console.log(`  - ${owner}`);
          }
        }
      }
      
      console.log(`----------------------------------------`);
      console.log(chalk.bold('Public Key (PEM):'));
      const pubKey = String(key.publicKey?.[0] || '');
      const formattedPem = `-----BEGIN CERTIFICATE-----\n` + 
        (pubKey.replace(/(.{64})/g, '$1\n').trim()) + 
        `\n-----END CERTIFICATE-----`;
      console.log(formattedPem);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(chalk.red(`Error: ${msg}`));
      process.exit(1);
    }
  });

function printTable(headers: string[], rows: string[][]): void {
  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => (r[i] ? r[i].toString().length : 0)))
  );

  const headerLine = headers.map((h, i) => h.padEnd(widths[i])).join(' | ');
  console.log(chalk.bold(headerLine));
  console.log(widths.map((w) => '-'.repeat(w)).join('-|-'));

  for (const row of rows) {
    const rowLine = row.map((val, i) => (val || '').padEnd(widths[i])).join(' | ');
    console.log(rowLine);
  }
}


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
