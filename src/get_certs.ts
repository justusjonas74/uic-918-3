import { promises } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { fileName } from './certs_url.js';
const { readFile } = promises;

import pkg from 'lodash';
const { find } = pkg;


export interface UICKeys {
  keys: Keys;
}

export interface Keys {
  key: Key[];
}

export interface Key {
  issuerName: string[];
  issuerCode: string[];
  versionType: string[];
  signatureAlgorithm: string[];
  id: string[];
  publicKey: string[];
  barcodeVersion: string[];
  startDate: Date[];
  endDate: Date[];
  barcodeXsd: BarcodeXSD[];
  allowedProductOwnerCodes: Array<AllowedProductOwnerCodeClass | string>;
  keyForged: string[];
  commentForEncryptionType: string[];
}

export interface AllowedProductOwnerCodeClass {
  productOwnerCode: string[];
  productOwnerName: string[];
}

export enum BarcodeXSD {
  Empty = '',
  String = 'String'
}

const loadKeysFromKeyJSONFile = async (): Promise<UICKeys> => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const filePath = join(__dirname, '../', fileName);
  try {
    const file = await readFile(filePath, 'utf8');
    const uicKey = JSON.parse(file);
    return uicKey;
  } catch (error) {
    throw new Error(`Couldn't read file ${filePath}. ` + error);
  }
};

const selectCert = (keys: UICKeys, ricsCode: number, keyId: number): Key | undefined => {
  const searchPattern = {
    issuerCode: [ricsCode.toString()],
    id: [keyId.toString()]
  };
  const cert = find<Key>(keys.keys.key, searchPattern);
  if (!cert) {
    console.log(`Couldn't find a certificate for issuer ${ricsCode} and key number ${keyId}`);
  }
  return cert;
};

export const getCertByID = async (orgId: number, keyId: number): Promise<Key | undefined> => {
  try {
    const keys = await loadKeysFromKeyJSONFile();
    return selectCert(keys, orgId, keyId);
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
