const barcode_reader = require('./lib/barcode-reader.js');
const utils = require('./lib/utils.js');
const barcodeData = require('./lib/barcode-data.js');

function fileWillExists(file_path){
  return new Promise ((resolve, reject) => {
    if (utils.fileExists(file_path)) {
      resolve(file_path);
    } else {
      reject(new Error(`${file_path} not found.`));
    }
  });
}


// let readBarcode = function (file_path){
//   return new Promise ((resolve, reject) => {
//       fileWillExists(file_path)
//         .then((file_path) => barcode_reader.ZXing(file_path))
//         .then((res) => utils.fixingZXing(res.raw))
//         .then((res) => barcodeData.interpret(res))
//         .then((res) => resolve(res))
//         .catch((err) => reject(err));
//   });
// };
const fixZXING = (res) => {return Promise.resolve(utils.fixingZXing(res.raw))};
const readZxing = (file_path) => barcode_reader.ZXing(file_path);
const interpretBarcode = (res) => Promise.resolve(barcodeData.interpret(res));

let readBarcode = function (file_path){
   return new Promise ((resolve, reject) => {
      fileWillExists(file_path)
        .then(readZxing)
        .then(fixZXING)
        .then(interpretBarcode)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
   });
};



module.exports = {readBarcode};