import {ZXing} from './barcode-reader'
import  interpretBarcode, { ParsedUIC918Barcode } from './barcode-data'
import { loadFileOrBuffer } from './checkInput'


import {verifyTicket as verifySignature} from './check_signature'

const readZxing = (filePath:string|Buffer) => ZXing(filePath)
const interpretBarcodeFn = (res:Buffer) => { return Promise.resolve(interpretBarcode(res)) }

const checkSignature = async function (ticket:ParsedUIC918Barcode, verifyTicket?:boolean) {
  if (verifyTicket) {
    const isValid = await verifySignature(ticket)
    ticket.isSignatureValid = isValid
  }
  return ticket
}

type ReadBarcodeOptions = {
  verifySignature? : boolean
}


export const readBarcode = function (input:string|Buffer, options? : ReadBarcodeOptions) {
  const defaults = {
    verifySignature: false
  }
  const opts: ReadBarcodeOptions = Object.assign({}, defaults, options)

  return new Promise<ParsedUIC918Barcode>((resolve, reject) => {
    // fileWillExists(filePath)
    loadFileOrBuffer(input)
      .then(readZxing)
      .then(interpretBarcodeFn)
      .then(ticket => checkSignature(ticket, opts.verifySignature))
      .then((res) => resolve(res))
      .catch((err) => reject(err))
  })
}

export {default as interpretBarcode} from "./barcode-data"

