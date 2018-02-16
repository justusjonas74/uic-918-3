const barcodeReader = require('./lib/barcode-reader.js')
const utils = require('./lib/utils.js')
const barcodeData = require('./lib/barcode-data.js')

function fileWillExists (filePath) {
  return new Promise((resolve, reject) => {
    if (utils.fileExists(filePath)) {
      resolve(filePath)
    } else {
      reject(new Error(`${filePath} not found.`))
    }
  })
}

const fixZXING = (res) => { return Promise.resolve(utils.fixingZXing(res.raw)) }
const readZxing = (filePath) => barcodeReader.ZXing(filePath)
const interpretBarcode = (res) => { return Promise.resolve(barcodeData.interpret(res)) }

let readBarcode = function (filePath) {
  return new Promise((resolve, reject) => {
    fileWillExists(filePath)
      .then(readZxing)
      .then(fixZXING)
      .then(interpretBarcode)
      .then((res) => resolve(res))
      .catch((err) => reject(err))
  })
}

module.exports = { readBarcode }
