import { dirname, join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import axios from 'axios';

import * as xml2js from 'xml2js';

export const parser = new xml2js.Parser();

const { url, fileName } = JSON.parse(readFileSync('./cert_url.json', 'utf8'));
const basePath = dirname('./cert_url.json');
export const filePath = join(basePath, fileName);

export const updateLocalCerts = async (): Promise<void> => {
  try {
    console.log(`Load public keys from ${url} ...`);
    const response = await axios.get(url);
    parser.parseString(response.data, function (err, result) {
      if (!err) {
        writeFileSync(filePath, JSON.stringify(result));
        console.log(
          `Loaded ${result.keys.key.length} public keys and saved under "${filePath}".`
        );
      } else {
        console.log(err);
      }
    });
  } catch (error) {
    if (!axios.isAxiosError(error)) {
      console.log(error);
      return;
    }

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);
  }
};
