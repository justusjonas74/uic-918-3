const readBarcode = require('./lib/barcode-reader.js');
const utils = require('./lib/utils.js');

exports.readBarcode =  (file_path, onFulfilled, onRejected) =>{
  if (utils.fileExists(file_path)) {
    readBarcode(file_path, onFulfilled, onRejected);
  }
};
