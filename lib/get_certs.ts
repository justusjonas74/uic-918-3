import * as fs  from 'fs'
import * as path  from 'path'
import * as request  from 'request'
import * as _  from 'lodash'
import * as xml2js  from 'xml2js'
var parser = new xml2js.Parser()

const myConsoleLog = require('./utils.js').myConsoleLog
const { url, fileName } = require('../cert_url.json')
const basePath = path.dirname(require.resolve('../cert_url.json'))
const filePath = path.join(basePath, fileName)

const updateLocalCerts = () => {
  myConsoleLog(`Load public keys from ${url} ...`)
  request.get(url, function (error:any, response: request.Response, body:any) {
    /* istanbul ignore else */
    if (!error && response.statusCode === 200) {
      parser.parseString(body, function (err:any, result:any) {
        /* istanbul ignore else */
        if (!err) {
          fs.writeFileSync(filePath, JSON.stringify(result))
          myConsoleLog(`Loaded ${result.keys.key.length} public keys and saved under "${filePath}".`)
        } else {
          console.log(err)
        }
      })
    } else {
      console.log('Error: ' + error.message)
      console.log('Response: ' + response)
    }
  })
}

function openLocalFiles (useRemote : boolean = true): Promise<keysJSON> {
  return new Promise(function (resolve, reject) {
    // const filePath = path.join(__dirname, '../', fileName)
    fs.readFile(filePath, 'utf8', function (err, data) {
      /* istanbul ignore else */
      if (!err) {
        resolve(JSON.parse(data))
      } else {
        reject(err)
      }
    })
  })
}

interface keysJSON {
  keys: {
    key: {
      issuerCode: string,
      id: string
    }
  }
}

function selectCert (keys: keysJSON, orgId:number, keyId:number) : Promise<string>  {
  return new Promise(function (resolve, reject) {
    const searchTerm = function(o:any) { return o.issuerCode == orgId.toString() && o.id === keyId.toString()}
    const cert = _.find(keys.keys.key, searchTerm)
    if (cert) {
      resolve(cert)
    } else {
      reject(new Error('Not Found!'))
    }
  })
}

const getCertByID = (orgId:number, keyId:number) => {
  return new Promise(function (resolve, reject) {
    openLocalFiles()
        .then(keys => selectCert(keys, orgId, keyId))
        .then(cert => resolve(cert))
        .catch(err => reject(err))
  })
}

module.exports = {updateLocalCerts, getCertByID}
