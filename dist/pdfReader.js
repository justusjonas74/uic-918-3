"use strict";
const extractAztec = require('ot-aztec-extract');
const { loadFileOrBuffer } = require('./checkInput');
module.exports = (input) => {
    return loadFileOrBuffer(input).then(buffer => extractAztec(buffer));
};
