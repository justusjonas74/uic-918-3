import  {readFile} from 'fs'
import {dirname, join} from 'path'

import {find} from 'lodash';


import {  fileName } from '../cert_url.json' 
const basePath = dirname(require.resolve('../cert_url.json'))
const filePath = join(basePath, fileName)

export interface UICKeys {
  keys: Keys;
}

export interface Keys {
  key: Key[];
}

export interface Key {
  issuerName:               string[];
  issuerCode:               string[];
  versionType:              string[];
  signatureAlgorithm:       string[];
  id:                       string[];
  publicKey:                string[];
  barcodeVersion:           string[];
  startDate:                Date[];
  endDate:                  Date[];
  barcodeXsd:               BarcodeXSD[];
  allowedProductOwnerCodes: Array<AllowedProductOwnerCodeClass | string>;
  keyForged:                string[];
  commentForEncryptionType: string[];
}

export interface AllowedProductOwnerCodeClass {
  productOwnerCode: string[];
  productOwnerName: string[];
}

export enum BarcodeXSD {
  Empty = "",
  String = "String",
}




const openLocalFiles = () : Promise<UICKeys>=> {
  return new Promise<UICKeys>(function (resolve, reject) {
    // const filePath = path.join(__dirname, '../', fileName)
    readFile(filePath, 'utf8', function (err, data) {
      /* istanbul ignore else */
      if (!err) {
        resolve(JSON.parse(data))
      } else {
        reject(err)
      }
    })
  })
}

const selectCert = (keys:UICKeys, orgId:number, keyId:number) :  Promise<Key>=> {
  return new Promise<Key>(function (resolve, reject) {
    const cert = find(keys.keys.key, { issuerCode: [orgId.toString()], id: [keyId.toString()] })
    if (cert) {
      resolve(cert)
    } else {
      reject(Error('Not Found!'))
    }
  })
}

export const getCertByID = (orgId:number, keyId:number) :  Promise<Key> => {
  return new Promise<Key>(function (resolve, reject) {
    openLocalFiles()
      .then(keys => selectCert(keys, orgId, keyId))
      .then(cert => resolve(cert))
      .catch(err => reject(err))
  })
}
