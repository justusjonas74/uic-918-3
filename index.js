const readBarcode = require('./lib/barcode-reader.js');
const utils = require('./lib/utils.js');

exports.readBarcode =  (file_path) =>{
  return new Promise ((resolve, reject) => {
    if (utils.fileExists(file_path)) {
      return readBarcode(file_path).then((res) => utils.fixingZXing(res)).catch((err) => reject(err));
    } else {
      reject(new Error(`${file_path} not found.`));
    }
  });

};
