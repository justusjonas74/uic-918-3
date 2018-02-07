const fs = require('fs');
const ZebraCrossing = require('zebra-crossing');
const barcodeData = require('./barcode-data.js');
const utils = require('./utils.js');

const options = { pureBarcode: true,
                  tryHarder: true};

function readBarcode (file_path, onFulfilled, onRejected) {
  var onSucess = (data) =>{
    const rawBarcode = utils.fixingZXing(data.raw);
    const barcode = barcodeData.interpret(rawBarcode);
    onFulfilled(barcode);
  };
 ZebraCrossing.read(fs.readFileSync(file_path), options).then(onSucess).catch(onRejected);
}

function ZXing(data, options){
  return ZebraCrossing.read(data, options);
}

module.exports = {readBarcode, ZXing};
