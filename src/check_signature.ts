import * as rs from 'jsrsasign';

import { Key, getCertByID } from './get_certs';
import { BarcodeHeader, ParsedUIC918Barcode } from './barcode-data';

function checkSignature(
  certPEM: rs.RSAKey | rs.KJUR.crypto.DSA | rs.KJUR.crypto.ECDSA,
  signature: string,
  message: string
): boolean {
  // DSA signature validation
  const sig = new rs.KJUR.crypto.Signature({ alg: 'SHA1withDSA' });
  sig.init(certPEM);
  sig.updateHex(message);
  return sig.verify(signature);
}

async function getCertByHeader(header: BarcodeHeader): Promise<Key | undefined> {
  try {
    const orgId = parseInt(header.rics.toString(), 10);
    const keyId = parseInt(header.key_id.toString(), 10);
    const cert = await getCertByID(orgId, keyId);
    return cert;
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

export enum TicketSignatureVerficationStatus {
  VALID = 'VALID',
  INVALID = 'INVALID',
  NOPUBLICKEY = 'Public Key not found'
}

export const verifyTicket = async function (ticket: ParsedUIC918Barcode): Promise<TicketSignatureVerficationStatus> {
  const cert = await getCertByHeader(ticket.header);
  if (!cert) {
    console.log("No certificate found. Signature couldn't been proofed.");
    return TicketSignatureVerficationStatus.NOPUBLICKEY;
  }

  const modifiedCert = '-----BEGIN CERTIFICATE-----\n' + cert.publicKey + '\n-----END CERTIFICATE-----\n';
  const publicKey = rs.KEYUTIL.getKey(modifiedCert);
  const isSignatureValid = checkSignature(
    publicKey,
    ticket.signature.toString('hex'),
    ticket.ticketDataRaw.toString('hex')
  );

  return isSignatureValid ? TicketSignatureVerficationStatus.VALID : TicketSignatureVerficationStatus.INVALID;
};
