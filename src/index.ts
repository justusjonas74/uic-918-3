import {ZXing} from './barcode-reader'
const interpretBarcode = require('./lib/barcode-data.js')
const fixingZXing = require('./lib/fixingZXing')
const { loadFileOrBuffer } = require('./lib/checkInput')
// const pdfReader = require('./lib/pdfReader')
// const {checkInput} = require('./lib/utils')

const verifySignature = require('./lib/check_signature').verifyTicket

// const checkInput = (input, stringCallback =null, bufferCallback = null , defaultCallback = null) => {
//   if (typeof input === 'string') {
//     return fileWillExists(input)
//   } else if (input instanceof Buffer) {
//     return Promise.resolve(input)
//   } else {
//     return Promise.reject(new Error(`Error: Input must be a Buffer (Image) or a String (path to image)`))
//   }
// }

const fixZXING = (res) => { return Promise.resolve(fixingZXing(res.raw)) }
const readZxing = (filePath) => ZXing(filePath)
const interpretBarcodeFn = (res) => { return Promise.resolve(interpretBarcode(res)) }

const checkSignature = async function (ticket, verifyTicket) {
  if (verifyTicket) {
    const isValid = await verifySignature(ticket)
    ticket.isSignatureValid = isValid
  }
  return ticket
}

const readBarcode = function (input, options = {}) {
  const defaults = {
    verifySignature: false
  }
  const opts = Object.assign({}, defaults, options)

  return new Promise((resolve, reject) => {
    // fileWillExists(filePath)
    loadFileOrBuffer(input)
      .then(readZxing)
      .then(fixZXING)
      .then(interpretBarcodeFn)
      .then(ticket => checkSignature(ticket, opts.verifySignature))
      .then((res) => resolve(res))
      .catch((err) => reject(err))
  })
}
// const readPDFBarcode = (input, options) => {
//   return new Promise((resolve, reject) => {
//     pdfReader(input)
//       .then(x => readBarcode(x, options))
//       .then((res) => resolve(res))
//       .catch((err) => reject(err))
//   })
// }
module.exports = { readBarcode, interpretBarcode }
