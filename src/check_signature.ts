import rs from 'jsrsasign';

import { Key, getCertByID } from './get_certs.js';
import { BarcodeHeader, ParsedUIC918Barcode } from './barcode-data.js';

export function mapSignatureAlgorithm(alg: string): string {
  if (!alg) {
    return 'SHA1withDSA';
  }
  
  const normalized = alg.toLowerCase().replace(/\s+/g, '');
  
  if (normalized.includes('ecdsa')) {
    if (normalized.includes('sha256')) return 'SHA256withECDSA';
    if (normalized.includes('sha384')) return 'SHA384withECDSA';
    if (normalized.includes('sha512')) return 'SHA512withECDSA';
    if (normalized.includes('sha224')) return 'SHA224withECDSA';
    if (normalized.includes('sha1')) return 'SHA1withECDSA';
    return 'SHA256withECDSA';
  }
  
  if (normalized.includes('rsa')) {
    if (normalized.includes('sha256')) return 'SHA256withRSA';
    if (normalized.includes('sha384')) return 'SHA384withRSA';
    if (normalized.includes('sha512')) return 'SHA512withRSA';
    if (normalized.includes('sha224')) return 'SHA224withRSA';
    if (normalized.includes('sha1')) return 'SHA1withRSA';
    return 'SHA256withRSA';
  }

  if (normalized.includes('sha256')) {
    return 'SHA256withDSA';
  }
  if (normalized.includes('sha224')) {
    return 'SHA224withDSA';
  }
  if (normalized.includes('sha1') || normalized.includes('dsa')) {
    return 'SHA1withDSA';
  }
  
  return 'SHA1withDSA';
}

function checkSignature(
  certPEM: rs.RSAKey | rs.KJUR.crypto.DSA | rs.KJUR.crypto.ECDSA,
  signature: string,
  message: string,
  algorithm: string
): boolean {
  const sig = new rs.KJUR.crypto.Signature({ alg: algorithm });
  sig.init(certPEM);
  sig.updateHex(message);
  return sig.verify(signature);
}

async function getCertByHeader(header: BarcodeHeader): Promise<Key | undefined> {
  const orgId = parseInt(header.rics.toString(), 10);
  const keyId = String(Number(header.key_id.toString()));
  const cert = await getCertByID(orgId, keyId);
  return cert;
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
  
  const alg = (cert.signatureAlgorithm && cert.signatureAlgorithm.length > 0)
    ? mapSignatureAlgorithm(cert.signatureAlgorithm[0])
    : 'SHA1withDSA';

  const isSignatureValid = checkSignature(
    publicKey,
    ticket.signature.toString('hex'),
    ticket.ticketDataRaw.toString('hex'),
    alg
  );

  return isSignatureValid ? TicketSignatureVerficationStatus.VALID : TicketSignatureVerficationStatus.INVALID;
};
