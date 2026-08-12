import { beforeAll, describe, expect, test } from 'vitest';

import { TicketSignatureVerficationStatus, verifyTicket, mapSignatureAlgorithm, ensureDerSignature } from '../../src/check_signature.js';
import { ParsedUIC918Barcode, TicketDataContainer } from '../../src/barcode-data.js';
import { updateLocalCerts } from '../../src/postinstall/updateLocalCerts.js';
import { existsSync } from 'node:fs';
import { join } from 'path';

const filePath = join(__dirname, '../../keys.json');
beforeAll(async () => {
  if (!existsSync(filePath)) {
    await updateLocalCerts(filePath);
  }
});

describe('check_signature.js', () => {
  describe('verifyTicket()', () => {
    test('should return VALID if a valid signature is given', () => {
      const ticket: ParsedUIC918Barcode = {
        signature: Buffer.from(
          '302C0214239CE59CD65ACA33FCC59C2141C51BA825EF1B400214352E9631C8405E2662207868C631959F45D21CDF00000000',
          'hex'
        ),
        ticketDataRaw: Buffer.from(
          '789C0B8DF77075743130343030353634B030F0B508313130767564400246E60646460646A686068686062EAE2EAEA1F1213E8E91404DC6868641CE2146060686C6406C01A48C811C034BB7C48CA2ECC4A29254A0B146407596062051DFD2E292D4A2DCC43C030333B8A8B16F6205D05CB05EA02B8C2C5C524B4B8A93337212F35274433293B3534B14BCF2934AC02C0343A07120080440B7189A9A02293310C72020B5A8383F4F23354FD3C018C835343001293201B9DBC00C2C600A12006AD003EA37333047881858012933B043116A8C812216081163B01A33339888A19121483DD070A0638CCDDD0FEFC929C94C5728CBCF5500DBA007B2582129B318CC35067343E3DD7C5C2340CE33334E5AC2C87B48BAA52FD0424B499089CB9263D6A3C56E3C8F0E3A883237B0CD3AF44164D6AB672F4E3DB975E8CE9D130C0D4D6A0CFC0C2758FC16DC73E50ECD156E6F397678F1B43D36BB52D5CC190C33981C1C64F0851A93681BA3D91E06C6D72E6B6E4E4E4B79F8C099AFA167C55FAF052A0E0D5F1785651D6C6610101039F6804D97010007F695FA',
          'hex'
        ),
        header: {
          umid: Buffer.from('235554', 'hex'),
          mt_version: Buffer.from('3031', 'hex'),
          rics: Buffer.from('31303830', 'hex'),
          key_id: Buffer.from('3030303037', 'hex')
        },
        version: 1,
        ticketContainers: [],
        ticketDataLength: Buffer.from(''),
        ticketDataUncompressed: Buffer.from('')
      };
      return expect(verifyTicket(ticket)).resolves.toBe(TicketSignatureVerficationStatus.VALID);
    });
    test('should return INVALID if an invalid message is given', () => {
      const ticket = {
        signature: Buffer.from(
          '302c02146b646f806c2cbc1f16977166e626c3a251c30b5602144917f4e606dfa8150eb2fa4c174378972623e47400000000',
          'hex'
        ),
        ticketDataRaw: Buffer.from('f000', 'hex'),
        header: {
          umid: Buffer.from('235554', 'hex'),
          mt_version: Buffer.from('3031', 'hex'),
          rics: Buffer.from('31303830', 'hex'),
          key_id: Buffer.from('3030303037', 'hex')
        },
        version: 1,
        ticketContainers: [] as TicketDataContainer[],
        ticketDataLength: Buffer.from(''),
        ticketDataUncompressed: Buffer.from('')
      };
      return expect(verifyTicket(ticket)).resolves.toBe(TicketSignatureVerficationStatus.INVALID);
    });
    test("should return NOPUBLICKEY if a valid signature is given, but the public key isn't found", () => {
      const ticket: ParsedUIC918Barcode = {
        signature: Buffer.from(
          '302c02146b646f806c2cbc1f16977166e626c3a251c30b5602144917f4e606dfa8150eb2fa4c174378972623e47400000000',
          'hex'
        ),
        ticketDataRaw: Buffer.from(
          '789c6d90cd4ec24010c78b07f5e2c5534f86c48350539cd98f523c9014ba056285c40ae1661a056c2484b495a8275fc877f1017c1867900307770ffbdfdffee76367fcd037410808a025800f919a7ad3c095d6de124d04411ba5d2109ad0b0b1138304891a04a204147caabf532bbfa93ca5b5855e029c1b5ad172f6b6ce6759414010404142b20848b4486874c1858453700c0945422464a42a80789316c56c79d9cdca77421ee789f274f5327fcdcbda6d9aadeabb374115154e06c175b5371ede3bb58ee9387d73973851e8f44c3cbcea8e4cecc4a338767a833a05c86d438fcf79362fab715a94c43caece6d0a9f5f999eef2c097d9c7b44d9006cf09789882d517b84ba06c59c3467a320cda39b8c79267ed37aa2e1560e2ebe6a73bb3cfab6376dd7aab41b36cf9ce1f1cfe189bdf938fba4cbe23fc762e738cd7e01b9e06a43',
          'hex'
        ),
        header: {
          umid: Buffer.from('235554', 'hex'),
          mt_version: Buffer.from('3031', 'hex'),
          rics: Buffer.from('38383838', 'hex'), // Not existing RICS CODE
          key_id: Buffer.from('3838383838', 'hex')
        },
        version: 1,
        ticketContainers: [],
        ticketDataLength: Buffer.from(''),
        ticketDataUncompressed: Buffer.from('')
      };
      return expect(verifyTicket(ticket)).resolves.toBe(TicketSignatureVerficationStatus.NOPUBLICKEY);
    });
  });

  describe('mapSignatureAlgorithm()', () => {
    test('should map SHA256withDSA correctly', () => {
      expect(mapSignatureAlgorithm('SHA256withDSA')).toBe('SHA256withDSA');
      expect(mapSignatureAlgorithm('SHA256withDSA(2048,256)')).toBe('SHA256withDSA');
    });

    test('should map SHA1withDSA correctly', () => {
      expect(mapSignatureAlgorithm('SHA1withDSA')).toBe('SHA1withDSA');
      expect(mapSignatureAlgorithm('SHA1withDSA(1024,160)')).toBe('SHA1withDSA');
      expect(mapSignatureAlgorithm('SHA1-DSA (1024,160)')).toBe('SHA1withDSA');
      expect(mapSignatureAlgorithm('SHA1-DSA (1024)')).toBe('SHA1withDSA');
      expect(mapSignatureAlgorithm('DSA1024')).toBe('SHA1withDSA');
      expect(mapSignatureAlgorithm('DSA_SHA1 (1024)')).toBe('SHA1withDSA');
    });

    test('should map ECDSA correctly', () => {
      expect(mapSignatureAlgorithm('SHA256withECDSA')).toBe('SHA256withECDSA');
    });

    test('should map SHA224withDSA correctly', () => {
      expect(mapSignatureAlgorithm('SHA224withDSA')).toBe('SHA224withDSA');
      expect(mapSignatureAlgorithm('SHA224withDSA(2048,224)')).toBe('SHA224withDSA');
    });

    test('should fallback to SHA1withDSA on empty or unknown algs', () => {
      expect(mapSignatureAlgorithm('')).toBe('SHA1withDSA');
      expect(mapSignatureAlgorithm(undefined as unknown as string)).toBe('SHA1withDSA');
      expect(mapSignatureAlgorithm('UNKNOWN')).toBe('SHA1withDSA');
    });
  });

  describe('ensureDerSignature()', () => {
    test('should leave DER-encoded signatures unchanged', () => {
      const derSig = '302c02146b646f806c2cbc1f16977166e626c3a251c30b5602144917f4e606dfa8150eb2fa4c174378972623e474';
      expect(ensureDerSignature(derSig)).toBe(derSig);
    });

    test('should convert raw signatures to DER format', () => {
      // 64-byte raw signature (128 hex chars)
      const rawSig = '63f0c86ae346a253ea81ba8b5b7f138f8d951a8a679aa1d7919061779ff7a6ab005eb35d0444f1972f64763f07c659d0cce80ab36f2ac3493e990cb4dffa2671';
      const expectedDer = '3043022063f0c86ae346a253ea81ba8b5b7f138f8d951a8a679aa1d7919061779ff7a6ab021f5eb35d0444f1972f64763f07c659d0cce80ab36f2ac3493e990cb4dffa2671';
      expect(ensureDerSignature(rawSig)).toBe(expectedDer);
    });

    test('should handle integers with MSB >= 0x80 by prefixing 0x00', () => {
      // 64-byte raw signature where r starts with 0x85
      const rawSig = '85f0c86ae346a253ea81ba8b5b7f138f8d951a8a679aa1d7919061779ff7a6ab005eb35d0444f1972f64763f07c659d0cce80ab36f2ac3493e990cb4dffa2671';
      const resultHex = ensureDerSignature(rawSig);
      // Result should start with 30 (sequence) followed by length, and then r integer 02 21 (length 33) 00 85...
      expect(resultHex.substring(4, 10)).toBe('022100');
    });
  });
});
