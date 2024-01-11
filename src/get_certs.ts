import  {readFile, writeFileSync} from 'fs'
import {dirname, join} from 'path'
import axios from 'axios';
import {find} from 'lodash';
import * as xml2js from 'xml2js'
const parser = new xml2js.Parser()

import {myConsoleLog} from './utils'
import { url, fileName } from '../cert_url.json'
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


export const updateLocalCerts = () => {
  myConsoleLog(`Load public keys from ${url} ...`)
  axios.get(url)
    .then((response) => {
      parser.parseString(response.data, function (err, result) {
      /* istanbul ignore else */
        if (!err) {
          writeFileSync(filePath, JSON.stringify(result))
          myConsoleLog(`Loaded ${result.keys.key.length} public keys and saved under "${filePath}".`)
        } else {
          console.log(err)
        }
      })
    })
    .catch(function (error) {
      if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
      } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
        console.log(error.request)
      } else {
      // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
      }
      console.log(error.config)
    })
}

const openLocalFiles = () => {
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

const selectCert = (keys:UICKeys, orgId:number, keyId:number) => {
  return new Promise(function (resolve, reject) {
    const cert = find(keys.keys.key, { issuerCode: [orgId.toString()], id: [keyId.toString()] })
    if (cert) {
      resolve(cert)
    } else {
      reject(Error('Not Found!'))
    }
  })
}

export const getCertByID = (orgId:number, keyId:number) => {
  return new Promise(function (resolve, reject) {
    openLocalFiles()
      .then(keys => selectCert(keys, orgId, keyId))
      .then(cert => resolve(cert))
      .catch(err => reject(err))
  })
}
