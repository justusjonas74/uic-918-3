const zlib = require('zlib');
const bwip =require('bwip-js');
var iconv = require('iconv-lite');


function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}


const dummyTicket = (id_str,version, body_str) => {
    const ticket_header = Buffer.from('2355543031303038303030303036302c021402a7689c8181e5c32b839b21f603972512d26504021441b789b47ea70c02ae1b8106d3362ad1cd34de5b00000000','hex');
    const data_length_str = pad(body_str.length + 12, 4);
    const sensless_container = Buffer.from(id_str + version + data_length_str + body_str);
    const compressed_ticket = zlib.deflateSync(sensless_container);
    const sensless_container_length = Buffer.from(pad(compressed_ticket.length, 4));
    const ticket_arr =[ticket_header, sensless_container_length, compressed_ticket];
    const totalLength = ticket_arr.reduce((result, item) => result + item.length,0);
    return Buffer.concat(ticket_arr,totalLength);
};

const dummyBarcode = (ticket) => {
    return new Promise((resolve, reject) => {
        var test = {
            text: ticket,
            bcid: "azteccode"
        };
        bwip.toBuffer(test, function(err, png) {
            if (err) {
              reject(err);
            }
            else {
            resolve(png);
            }
        });
    });
}


const unfixingZXing = (buffer) => {
    iconv.skipDecodeWarning = true;
    const latin1str = iconv.decode(buffer.toString('latin1'), 'utf-8');
    return Buffer.from(latin1str);
};


module.exports = {dummyTicket, dummyBarcode, unfixingZXing};
