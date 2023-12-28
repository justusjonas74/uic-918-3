const zlib = require('zlib')
// const bwip =require('bwip-js');

function pad (num, size) {
  let s = num + ''
  while (s.length < size) s = '0' + s
  return s
}

const dummyTicket = (idStr, version, bodyStr) => {
  const ticketHeader = Buffer.from('2355543031303038303030303036302c021402a7689c8181e5c32b839b21f603972512d26504021441b789b47ea70c02ae1b8106d3362ad1cd34de5b00000000', 'hex')
  const dataLengthStr = pad(bodyStr.length + 12, 4)
  const senslessContainer = Buffer.from(idStr + version + dataLengthStr + bodyStr)
  const compressedTicket = zlib.deflateSync(senslessContainer)
  const senslessContainerLength = Buffer.from(pad(compressedTicket.length, 4))
  const ticketArr = [ticketHeader, senslessContainerLength, compressedTicket]
  const totalLength = ticketArr.reduce((result, item) => result + item.length, 0)
  return Buffer.concat(ticketArr, totalLength)
}

// ACTUALLY UNUSED BUT MAYBE WILL BE USEFUL IN THE FUTURE
// const dummyBarcode = (ticket) => {
//     return new Promise((resolve, reject) => {
//         var test = {
//             text: ticket,
//             bcid: "azteccode"
//         };
//         bwip.toBuffer(test, function(err, png) {
//             if (err) {
//               reject(err);
//             }
//             else {
//             resolve(png);
//             }
//         });
//     });
// };

module.exports = { dummyTicket }
