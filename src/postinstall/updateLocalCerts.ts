/* eslint-disable @typescript-eslint/no-explicit-any */
import { join } from 'path';
import { writeFileSync, readFileSync, existsSync } from 'fs';
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

    let existingCustomKeys: any[] = [];
    try {
      if (existsSync(updatedFilePath)) {
        const fileContent = readFileSync(updatedFilePath, 'utf8');
        const existingJSON = JSON.parse(fileContent);
        if (existingJSON && existingJSON.keys && Array.isArray(existingJSON.keys.key)) {
          existingCustomKeys = existingJSON.keys.key.filter((key: any) => key.isCustom && key.isCustom[0] === true);
        }
      }
    } catch (e) {
      console.log(`Could not read existing keys for merging:`, e);
    }

    parser.parseString(response.data, function (err, result) {
      if (!err) {
        if (existingCustomKeys.length > 0 && result && result.keys && Array.isArray(result.keys.key)) {
          const downloadedPublicKeys = new Set(result.keys.key.map((key: any) => key.publicKey[0]));
          const uniqueCustomKeys = existingCustomKeys.filter((key: any) => !downloadedPublicKeys.has(key.publicKey[0]));
          result.keys.key = [...result.keys.key, ...uniqueCustomKeys];
        }
        writeFileSync(updatedFilePath, JSON.stringify(result));
        console.log(`Loaded ${result.keys.key.length} public keys and saved under "${updatedFilePath}".`);
      } else {
        console.log(err);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

