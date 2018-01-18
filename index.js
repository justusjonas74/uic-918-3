const readBarcode = require('./lib/barcode-reader.js');
exports.readBarcodePNG =  (file_path, onFulfilled, onRejected) =>{
  readBarcode(file_path, onFulfilled, onRejected);
};



//Test
//const file_path = process.argv[2];

// exports.readBarcodePNG(file_path, (data) => {
//     const rawBarcode = utils.fixingZXing(data.raw);
//     const barcode = barcodeData.interpret(rawBarcode);
//     console.log(util.inspect(barcode, {showHidden: false, depth: null}));
//   }, (reason) =>{
//     console.log('ERROR: ' + reason);
//   }
// );
