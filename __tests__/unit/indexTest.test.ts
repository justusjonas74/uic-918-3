import { beforeAll, describe, expect, test } from 'vitest';

import fs, { existsSync } from 'fs';
import { readBarcode } from '../../src/index.js';
import { TicketSignatureVerficationStatus } from '../../src/check_signature.js';
import { updateLocalCerts } from '../../src/postinstall/updateLocalCerts.js';

import { join } from 'path';

const filePath = join(__dirname, '../../keys.json');
beforeAll(async () => {
  if (!existsSync(filePath)) {
    await updateLocalCerts(filePath);
  }
});
describe('index.js', () => {
  describe('index.readBarcode', () => {
    describe('...when inputis a local file', () => {
      const dummy = '__tests__/unit/images/barcode-dummy2.png';
      // const dummy3 = '__tests__/interfacemages/barcode-dummy3.png'
      const dummy4 = '__tests__/unit/images/DTicket_1080_007.PNG';

      const falseDummy = '__tests__/unit/images/barcode dummy.png';
      test('should return an object on sucess', () => {
        return expect(readBarcode(dummy)).toBeInstanceOf(Object);
      });
      test('should eventually be resolved', () => {
        return expect(readBarcode(dummy)).resolves.toBeTruthy();
      });
      test('should reject if file not found', () => {
        return expect(readBarcode(falseDummy)).rejects.toThrow();
      });
      test('should handle verifySignature option and resolve', async () => {
        return expect(readBarcode(dummy4, { verifySignature: true })).resolves.toHaveProperty('isSignatureValid');
      });
    });
    describe('...when input is an image buffer', () => {
      const dummyBuff = fs.readFileSync('__tests__/unit/images/barcode-dummy2.png');
      const dummy4Buff = fs.readFileSync('__tests__/unit/images/DTicket_1080_007.PNG');
      test('should return an object on sucess', async () => {
        const barcode = await readBarcode(dummyBuff);
        return expect(barcode).toBeInstanceOf(Object);
      });

      test('should handle verifySignature option and resolve on valid tickets', async () => {
        const barcode = await readBarcode(dummy4Buff, { verifySignature: true });
        expect(barcode).toHaveProperty('isSignatureValid', true);
        expect(barcode).toHaveProperty('validityOfSignature', TicketSignatureVerficationStatus.VALID);
      });
    });
  });
});
