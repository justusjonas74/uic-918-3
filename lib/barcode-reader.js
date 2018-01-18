const fs = require('fs');
const ZebraCrossing = require('zebra-crossing');
//const util = require('util');
const barcodeData = require('./barcode-data.js');
const utils = require('./utils.js');

const options = { pureBarcode: true,
                  tryHarder: true};

module.exports = function readBarcode (file_path, onFulfilled, onRejected) {
  var onSucess = (data) =>{
    const rawBarcode = utils.fixingZXing(data.raw);
    const barcode = barcodeData.interpret(rawBarcode);
    onFulfilled(barcode);
  };
 ZebraCrossing.read(fs.readFileSync(file_path), options).then(onSucess, onRejected);
};
