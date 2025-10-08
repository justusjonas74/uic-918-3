import { join } from 'path';
import { writeFileSync } from 'fs';
import axios from 'axios';
import * as xml2js from 'xml2js';

const parser = new xml2js.Parser();

export const url = "https://railpublickey.uic.org/download.php"

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const filePath = join(__dirname, "../keys.json");

export const updateLocalCerts = async (customFilePath?: string): Promise<void> => {
  try {
    const updatedFilePath = customFilePath || filePath;
    console.log(`Load public keys from ${url} ...`);
    const response = await axios.get(url);
    if (response && response.status == 200) {
      console.log(`Successfully loaded key file.`);
    }
    parser.parseString(response.data, function (err, result) {
      if (!err) {
        writeFileSync(updatedFilePath, JSON.stringify(result));
        console.log(`Loaded ${result.keys.key.length} public keys and saved under "${filePath}".`);
      } else {
        console.log(err);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
