const fs = require('fs')
const path =require('path')
const request = require('request')
const _ = require('lodash')
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

const { url, file_name } = require('./cert_url.json')
const file_path = path.join(__dirname, file_name)
    

const updateLocalCerts = () => {
    console.log(`Load public keys from ${url} ...`)
    request.get(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            parser.parseString(body, function(err, result) {
                if (err) { console.log(err) }
                else {
                    fs.writeFileSync(file_name, JSON.stringify(result))
                    console.log(`Loaded ${result.keys.key.length} public keys and saved under \"${file_path}\".`)
                }
            });
        }
        else {
            console.log('Error: ' + error.message)
            console.log('Response: ' + response)
        }
    });
}

const openLocalFiles = (useRemote = true) => {
    return new Promise(function(resolve, reject) {
        fs.readFile(file_path, 'utf8', function(err, data) {
            if (err) {
                reject(err)
            }
            else {
                resolve(JSON.parse(data))
            }
        });
    })
}

const selectCert = (keys, org_id, key_id) => {
    return new Promise(function(resolve, reject) {
        const cert = _.find(keys.keys.key, {issuerCode: [org_id.toString()], id:[key_id.toString()]})
        if (cert) {
            resolve(cert)
        } else {
            reject( Error("Not Found!"))
        }
    })
}


const getCertByID = (org_id, key_id) => {
    openLocalFiles()
        .then(keys => selectCert(keys,org_id, key_id))
}

module.exports = {updateLocalCerts, openLocalFiles, selectCert}
