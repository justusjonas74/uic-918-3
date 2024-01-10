const ZebraCrossing = require('zebra-crossing')

const defaultOptions = {
  pureBarcode: true,
  tryHarder: true
}

function ZXing (data, options = defaultOptions) {
  return ZebraCrossing.read(data, options)
}

module.exports = { ZXing }
