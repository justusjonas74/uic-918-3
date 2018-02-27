const barcodeReader = require('./lib/barcode-reader.js')
const interpretBarcode = require('./lib/barcode-data.js')
const fixingZXing = require('./lib/fixingZXing')
const fileExists = require('./lib/fileExists')

// TODO: Move this to lib/fileExists.js
function fileWillExists (filePath) {
  return new Promise((resolve, reject) => {
    if (fileExists(filePath)) {
      resolve(filePath)
    } else {
      reject(new Error(`${filePath} not found.`))
    }
  })
}

const fixZXING = (res) => { return Promise.resolve(fixingZXing(res.raw)) }
const readZxing = (filePath) => barcodeReader.ZXing(filePath)
const interpretBarcodeFn = (res) => { return Promise.resolve(interpretBarcode(res)) }

let readBarcode = function (filePath) {
  return new Promise((resolve, reject) => {
    fileWillExists(filePath)
      .then(readZxing)
      .then(fixZXING)
      .then(interpretBarcodeFn)
      .then((res) => resolve(res))
      .catch((err) => reject(err))
  })
}

module.exports = { readBarcode }
