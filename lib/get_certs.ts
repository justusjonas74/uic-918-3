const fs = require('fs')
const path = require('path')
const request = require('request')
const _ = require('lodash')
var xml2js = require('xml2js')
var parser = new xml2js.Parser()

const myConsoleLog = require('./utils.js').myConsoleLog
const { url, fileName } = require('./cert_url.json')
const basePath = path.dirname(require.resolve('./cert_url.json'))
const filePath = path.join(basePath, fileName)

const updateLocalCerts = () => {
  myConsoleLog(`Load public keys from ${url} ...`)
  request.get(url, function (error, response, body) {
    /* istanbul ignore else */
    if (!error && response.statusCode === 200) {
      parser.parseString(body, function (err, result) {
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

const openLocalFiles = (useRemote = true) => {
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

const selectCert = (keys, orgId, keyId) => {
  return new Promise(function (resolve, reject) {
    const cert = _.find(keys.keys.key, {issuerCode: [orgId.toString()], id: [keyId.toString()]})
    if (cert) {
      resolve(cert)
    } else {
      reject(Error('Not Found!'))
    }
  })
}

const getCertByID = (orgId, keyId) => {
  return new Promise(function (resolve, reject) {
    openLocalFiles()
        .then(keys => selectCert(keys, orgId, keyId))
        .then(cert => resolve(cert))
        .catch(err => reject(err))
  })
}

module.exports = {updateLocalCerts, getCertByID}
