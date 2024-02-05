const { readBarcodesFromImageFile } = require('zxing-wasm/reader')

const defaultOptions = {
  pureBarcode: true,
  tryHarder: true
}

function ZXing (data, options = defaultOptions) {
  return readBarcodesFromImageFile(new Blob([data]), options)
    .then(([barcodeResult]) => {
      return Buffer.from(barcodeResult.bytes)
    })
}

module.exports = { ZXing }
