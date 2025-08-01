import { PathLike, promises } from 'fs';
import { dirname, join } from 'path';

const { readFile } = promises;

import { find } from 'lodash';

import cert_url from '../cert_url.json';
const basePath = dirname(require.resolve('../cert_url.json'));
const filePath = join(basePath, cert_url.fileName);

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

const openLocalFiles = async (filePath: PathLike): Promise<UICKeys> => {
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

export const getCertByID = async (orgId: number, keyId: number, path: string = filePath): Promise<Key | undefined> => {
  try {
    const keys = await openLocalFiles(path);
    return selectCert(keys, orgId, keyId);
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
