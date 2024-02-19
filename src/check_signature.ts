import * as rs from 'jsrsasign'

import { Key, getCertByID } from './get_certs'
import { BarcodeHeader, ParsedUIC918Barcode } from './barcode-data'

function checkSignature (certPEM: rs.RSAKey | rs.KJUR.crypto.DSA | rs.KJUR.crypto.ECDSA, signature:string, message:string) : boolean {
  // DSA signature validation
  const sig = new rs.KJUR.crypto.Signature({ alg: 'SHA1withDSA' })
  sig.init(certPEM)
  sig.updateHex(message)
  return sig.verify(signature)
}

function getCertByHeader (header: BarcodeHeader) : Promise<Key>{
  return new Promise<Key>(function (resolve, reject) {
    if (header) {
      const orgId = parseInt(header.rics.toString(), 10)
      const keyId = parseInt(header.key_id.toString(), 10)
      getCertByID(orgId, keyId)
        .then(cert => resolve(cert))
        .catch(err => reject(err))
    } else {
      resolve(null)
    }
  })
}

export const verifyTicket = function (ticket: ParsedUIC918Barcode) : Promise<boolean> {
  return new Promise<boolean | null>(function (resolve, reject) {
    if (ticket) {
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


