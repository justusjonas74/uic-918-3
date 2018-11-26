const extractAztec = require('ot-aztec-extract')
const {loadFileOrBuffer} = require('./checkInput')

module.exports = (input) => {  // => Promise.resolve(Image as Buffer)
  return loadFileOrBuffer(input).then(buffer => extractAztec(buffer))
}
