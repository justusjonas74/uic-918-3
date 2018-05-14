const certs = require('./get_certs')
const fs = require('fs')

var rs = require('jsrsasign');

function checkSignature(certPEM, signature, message) {
    // DSA signature validation
    var sig = new rs.KJUR.crypto.Signature({"alg": "SHA1withDSA"});
    sig.init(certPEM);
    sig.updateHex(message);
    return sig.verify(signature);
}

function getCertByHeader(header){
    const org_id = parseInt(header.rics.toString(), 10),
        key_id = parseInt(header.key_id.toString(), 10)
    return certs.getCertByID(org_id, key_id)
}

const verifyTicket = async function (ticket) {
   return getCertByHeader(ticket.header)
    .then(cert =>{
        const publicKey= rs.KEYUTIL.getKey("-----BEGIN CERTIFICATE-----\n" + cert.publicKey + "\n-----END CERTIFICATE-----\n");
        return checkSignature(publicKey, ticket.signature.toString('hex'), ticket.ticketDataRaw.toString('hex'))
    })
}

module.exports = {verifyTicket}

// // FOR TESTING
// const fileName = "../FLT_XK1OP745331_0.pdf-003.pbm.png"
// var barcode
// async function f(fileName) {
//  //let data = await readBarcode(fileName)
 
//  console.log()
//  const publicKey= rs.KEYUTIL.getKey("-----BEGIN CERTIFICATE-----\n" + cert.publicKey + "\n-----END CERTIFICATE-----\n");
//  const result = checkSignature(publicKey, data.signature.toString('hex'), data.ticketDataRaw.toString('hex'))
//  console.log(result)
//  //fs.writeFileSync("./data.sig", data.signature)
//  //console.log(data.ticketDataUncompressed.toString('hex') )
// }

// f(fileName)