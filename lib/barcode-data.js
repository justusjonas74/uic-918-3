const zlib = require('zlib');


const BLOCK_TYPES = require('./block-types.js'); //Array with objects
const utils = require('./utils.js');

exports.interpret = function (data) {
    var barcode = {};
    barcode.header = getHeader(data);
    barcode.signature = getSignature(data);
    barcode.ticketDataLength = getTicketDataLength(data);
    barcode.ticketDataRaw = getTicketDataRaw(data);
    barcode.ticketDataUncompressed = getTicketDataUncompressed(barcode.ticketDataRaw);
    barcode.ticketContainers = utils.parseContainers(barcode.ticketDataUncompressed, interpretTicketContainer);
    return barcode;
};



// Get raw data and uncompress the TicketData
function getHeader(data) {
  var header = {};
  header.umid = data.slice(0,3);
  header.mt_version = data.slice(3,5);
  header.rics = data.slice(5, 9);
  header.key_id = data.slice(9,14);
  return header;
}


function getSignature(data) {
  return data.slice(14, 64);
}

function getTicketDataLength(data) {
  return data.slice(64, 68);
}

function getTicketDataRaw(data)  {
  return data.slice(68, data.length);
}

function getTicketDataUncompressed(data) {
  return zlib.unzipSync(data);
}

// Interpreters for uncompressed Ticket Data








class TicketDataContainer {
  constructor(data) {
    this.id = data.slice(0,6).toString();
    this.version = data.slice(6,8).toString();
    this.length = parseInt(data.slice(8,12).toString());
    //this.container_data = data.slice(12, data.length)
    this.container_data = this.parseFields(this.id, this.version, data.slice(12, data.length));
  }

  parseFields(id, version, data ){
    const types = BLOCK_TYPES.filter(typ => (typ.name === id));
    if  (typeof types !== 'undefined' && types.length > 0) {
      const fields = types[0].versions[version];
      if (fields) {
        return utils.interpretField(data, fields);
      } else {
        console.log(`ALERT: Version ${version} isn't implemented for TicketContainer ${id}.`);
        return data;
      }
     } else {
       console.log(`ALERT:TicketContainer ${id} isn't supported yet.`);
       return data;
     }

  }
}

// function interpretField (data,fields) {
//   var remainder = data;
//   var res = {}
//   fields.forEach( f => {
//     var interpretFunction;
//     if (f[2]) {
//       interpretFunction = f[2];
//     } else {
//       interpretFunction = (x) => x;
//     }
//     if (f[1]) {
//       res[f[0]] = interpretFunction(remainder.slice(0,f[1]));
//       remainder = remainder.slice(f[1]);
//     } else {
//       res[f[0]] = interpretFunction(remainder);
//     }
//   })
//   return res;
// };

function interpretTicketContainer(data){
  const length = parseInt(data.slice(8,12).toString());
  const remainder = data.slice(length, data.length);
  const container = new TicketDataContainer(data.slice(0, length));
  return [container, remainder];
}

// function parseTicketContainers (data){
//   var remainder = data;
//   var containers = [];
//   while (remainder.length > 0) {
//     const result = interpretTicketContainer(remainder);
//     containers.push(result[0]);
//     remainder = result[1];
//   }
//   return containers
// }

// Interpretire ersten Container
// Iteriere über (Rest)-Daten
// | 1 | 6 | ID | Eindeutige Kennzeichnung des Datensatzes wie U_HEAD oder U_TLAY.
// | 2 | 2 | Version | Version der Datensatzstruktur
// | 3 | 4 | Length | Länge der enthaltenen Daten in Zeichen
// | 4 | variabel | Data | Daten das Datensatzes