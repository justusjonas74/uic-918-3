import { dirname, join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import axios from 'axios';
import * as xml2js from 'xml2js';
const parser = new xml2js.Parser();
const { url, fileName } = JSON.parse(readFileSync('./cert_url.json', 'utf8'));
const basePath = dirname('./cert_url.json');
export const filePath = join(basePath, fileName);
export const updateLocalCerts = async () => {
  try {
    console.log(`Load public keys from ${url} ...`);
    const response = await axios.get(url);
    if (response && response.status == 200) {
      console.log(`Successfully loaded key file.`);
    }
    parser.parseString(response.data, function (err, result) {
      if (!err) {
        writeFileSync(filePath, JSON.stringify(result));
        console.log(`Loaded ${result.keys.key.length} public keys and saved under "${filePath}".`);
      } else {
        console.log(err);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
