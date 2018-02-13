const ZebraCrossing = require('zebra-crossing');

const default_options = { pureBarcode: true,
                  tryHarder: true};

function ZXing(data, options = default_options){
  return ZebraCrossing.read(data, options);
}

module.exports = {ZXing};
