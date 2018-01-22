const readBarcode = require('./lib/barcode-reader.js');
exports.readBarcode =  (file_path, onFulfilled, onRejected) =>{
  readBarcode(file_path, onFulfilled, onRejected);
};
