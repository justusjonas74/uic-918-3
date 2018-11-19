const barcodeReader = require('./lib/barcode-reader.js')
const interpretBarcode = require('./lib/barcode-data.js')
const fixingZXing = require('./lib/fixingZXing')
const fileExists = require('./lib/fileExists')

const verifySignature = require('./lib/check_signature').verifyTicket

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

const checkInput = (input) => {
  if (typeof input === 'string') {
    return fileWillExists(input)
  } else if (input instanceof Buffer) {
    return Promise.resolve(input)
  } else {
    return Promise.reject(new Error(`Error: Input must be a Buffer (Image) or a String (path to image)`))
  }
}

const fixZXING = (res) => { return Promise.resolve(fixingZXing(res.raw)) }
const readZxing = (filePath) => barcodeReader.ZXing(filePath)
const interpretBarcodeFn = (res) => { return Promise.resolve(interpretBarcode(res)) }

const checkSignature = async function (ticket, verifyTicket) {
  if (verifyTicket) {
    let isValid = await verifySignature(ticket)
    ticket.isSignatureValid = isValid
  }
  return ticket
}

let readBarcode = function (input, options = {}) {
  let defaults = {
    verifySignature: false
  }
  let opts = Object.assign({}, defaults, options)

  return new Promise((resolve, reject) => {
    // fileWillExists(filePath)
    checkInput(input)
      .then(readZxing)
      .then(fixZXING)
      .then(interpretBarcodeFn)
      .then(ticket => checkSignature(ticket, opts.verifySignature))
      .then((res) => resolve(res))
      .catch((err) => reject(err))
  })
}

module.exports = { readBarcode }
