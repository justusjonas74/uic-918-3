import  { writeFileSync, readFileSync} from 'fs'
import {dirname, join} from 'path'
import axios from 'axios';
import * as xml2js from 'xml2js'
const parser = new xml2js.Parser()

// eslint-disable-next-line @typescript-eslint/no-var-requires





const { url , fileName} = JSON.parse(readFileSync("./cert_url.json", "utf8"));
const basePath = dirname('./cert_url.json')
const filePath = join(basePath, fileName)

export const updateLocalCerts = () => {
   console.log(`Load public keys from ${url} ...`)
    axios.get(url)
      .then((response) => {
        parser.parseString(response.data, function (err, result) {
        /* istanbul ignore else */
          if (!err) {
            writeFileSync(filePath, JSON.stringify(result))
            console.log(`Loaded ${result.keys.key.length} public keys and saved under "${filePath}".`)
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

  updateLocalCerts()