import { deflateSync } from 'zlib'

function pad(num: string | number, size: number): string {
  let s = num + ''
  while (s.length < size) s = '0' + s
  return s
}

export const dummyTicket = (idStr: string, version: string, bodyStr: string): Buffer => {
  const ticketHeader = Buffer.from('2355543031303038303030303036302c021402a7689c8181e5c32b839b21f603972512d26504021441b789b47ea70c02ae1b8106d3362ad1cd34de5b00000000', 'hex')
  const dataLengthStr = pad(bodyStr.length + 12, 4)
  const senslessContainer = Buffer.from(idStr + version + dataLengthStr + bodyStr)
  const compressedTicket = deflateSync(senslessContainer)
  const senslessContainerLength = Buffer.from(pad(compressedTicket.length, 4))
  const ticketArr = [ticketHeader, senslessContainerLength, compressedTicket]
  const totalLength = ticketArr.reduce((result, item) => result + item.length, 0)
  return Buffer.concat(ticketArr, totalLength)
}

export const dummyTicket2 = (idStr: string, version: string, bodyStr: string): Buffer => {
  const ticketHeader = Buffer.from('2355543032313038303030303032782e2fe184a1d85e89e9338b298ec61aeba248ce722056ca940a967c8a1d39126e2c628c4fcea91ba35216a0a350f894de5ebd7b8909920fde947feede0e20c430313939789c01bc0043ff555f464c455831333031383862b20086e10dc125ea2815110881051c844464d985668e23a00a80000e96c2e4e6e8cadc08aed2d8d9010444d7be0100221ce610ea559b64364c38a82361d1cb5e1e5d32a3d0979bd099c8426b0b7373432b4b6852932baba3634b733b2b715ab34b09d101e18981c181f1424221521291521292a17a3a920a11525a095282314952b20a49529952826278083001a4c38ae5bb303ace700380070014b00240400f537570657220537061727072656973c41e4a03', 'hex')
  const dataLengthStr = pad(bodyStr.length + 12, 4)
  const senslessContainer = Buffer.from(idStr + version + dataLengthStr + bodyStr)
  const compressedTicket = deflateSync(senslessContainer)
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
