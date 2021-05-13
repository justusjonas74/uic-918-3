const certs = require('./get_certs')
const rs = require('jsrsasign')

function checkSignature (certPEM, signature, message) {
    // DSA signature validation
  var sig = new rs.KJUR.crypto.Signature({'alg': 'SHA1withDSA'})
  sig.init(certPEM)
  sig.updateHex(message)
  return sig.verify(signature)
}

function getCertByHeader (header) {
  return new Promise(function (resolve, reject) {
    if (header) {
      const orgId = parseInt(header.rics.toString(), 10)
      const keyId = parseInt(header.key_id.toString(), 10)
      certs.getCertByID(orgId, keyId)
      .then(cert => resolve(cert))
      .catch(err => reject(err))
    } else {
      resolve(null)
    }
  })
}

const verifyTicket = function (ticket) {
  return new Promise(function (resolve, reject) {
    if (ticket) {
      console.log(ticket.header)
      getCertByHeader(ticket.header)
        .then(cert => {
          if (cert) {
            const publicKey = rs.KEYUTIL.getKey('-----BEGIN CERTIFICATE-----\n' + cert.publicKey + '\n-----END CERTIFICATE-----\n')
            resolve(checkSignature(publicKey, ticket.signature.toString('hex'), ticket.ticketDataRaw.toString('hex')))
          } else {
            resolve(null)
          }
        })
        .catch(err => reject(err))
    } else {
      resolve(null)
    }
  })
}

module.exports = {verifyTicket}
