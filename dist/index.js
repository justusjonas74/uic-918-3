"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const barcodeReader = require('./barcode-reader.js');
const interpretBarcode = require('./barcode-data.js');
const fixingZXing = require('./fixingZXing');
const { loadFileOrBuffer } = require('./checkInput');
const pdfReader = require('./pdfReader');
// const {checkInput} = require('./utils')
const verifySignature = require('./check_signature').verifyTicket;
// const checkInput = (input, stringCallback =null, bufferCallback = null , defaultCallback = null) => {
//   if (typeof input === 'string') {
//     return fileWillExists(input)
//   } else if (input instanceof Buffer) {
//     return Promise.resolve(input)
//   } else {
//     return Promise.reject(new Error(`Error: Input must be a Buffer (Image) or a String (path to image)`))
//   }
// }
const fixZXING = (res) => { return Promise.resolve(fixingZXing(res.raw)); };
const readZxing = (filePath) => barcodeReader.ZXing(filePath);
const interpretBarcodeFn = (res) => { return Promise.resolve(interpretBarcode(res)); };
const checkSignature = function (ticket, verifyTicket) {
    return __awaiter(this, void 0, void 0, function* () {
        if (verifyTicket) {
            let isValid = yield verifySignature(ticket);
            ticket.isSignatureValid = isValid;
        }
        return ticket;
    });
};
const readBarcode = function (input, options = {}) {
    let defaults = {
        verifySignature: false
    };
    let opts = Object.assign({}, defaults, options);
    return new Promise((resolve, reject) => {
        // fileWillExists(filePath)
        loadFileOrBuffer(input)
            .then(readZxing)
            .then(fixZXING)
            .then(interpretBarcodeFn)
            .then(ticket => checkSignature(ticket, opts.verifySignature))
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    });
};
const readPDFBarcode = (input, options) => {
    return new Promise((resolve, reject) => {
        pdfReader(input)
            .then(x => readBarcode(x, options))
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    });
};
module.exports = { readBarcode, readPDFBarcode };
