import { describe, beforeAll, test, expect } from 'vitest';
import { dummyTicket, dummyTicket2 } from './helper.js';

import interpretBarcode, * as barcodeData from '../../src/barcode-data.js'
import { TicketSignatureVerficationStatus } from '../../src/check_signature.js';
import { existsSync } from 'fs';
import { updateLocalCerts } from '../../src/postinstall/updateLocalCerts.js';

import { join } from 'path';

const filePath = join(__dirname, '../../keys.json');
beforeAll(async () => {
  // Check if file ./../../keys.json is available, if not, update the local certs.
  if (existsSync(filePath)) {
    console.log('Local certs already available.');
  } else {
    console.log('Local certs not available, updating now...');
    await updateLocalCerts(filePath);
  }
});
describe('barcode-data', () => {
  describe('barcode-data.interpret', () => {
    test('should return an object for ticket version 1', async () => {
      const ticket = dummyTicket('U_HEAD', '01', 'Hi!');
      await expect(interpretBarcode(ticket)).resolves.toBeInstanceOf(Object);
    });
    test('should return an object for ticket version 2', async () => {
      const ticket = dummyTicket('U_HEAD', '02', 'Hi!');
      await expect(interpretBarcode(ticket)).resolves.toBeInstanceOf(Object);
    });
    test('should show the correct version for ticket version 1', async () => {
      const ticket = dummyTicket('U_HEAD', '01', 'Hi!');
      await expect(interpretBarcode(ticket)).resolves.toHaveProperty('version', 1);
    });
    test('should show the correct version for ticket version 2', async () => {
      const ticket = dummyTicket2('U_HEAD', '01', 'Hi!');
      await expect(interpretBarcode(ticket)).resolves.toHaveProperty('version', 2);
    });
    test('should return an empty array if input param is an empty buffer.', async () => {
      const emptyTicket = Buffer.from(
        '2355543031333431353030303033302e0215008beb83c5db49924a1387e99ed58fe2cc59aa8a8c021500f66f662724ca0b49a95d7f81810cbfa5696d06ed0000',
        'hex'
      );
      const ticket = await interpretBarcode(emptyTicket);
      expect(Array.isArray(ticket.ticketContainers)).toBe(true);
      expect(ticket.ticketContainers).toHaveLength(0);
    });
    test('should throw an error if mt_version is not 1 or 2', async () => {
      const unsupportedTicket = Buffer.from(
        '2355543033333431353030303033302e0215008beb83c5db49924a1387e99ed58fe2cc59aa8a8c021500f66f662724ca0b49a95d7f81810cbfa5696d06ed0000',
        'hex'
      );
      try {
        await interpretBarcode(unsupportedTicket);
        // Fail test if above expression doesn't throw anything.
        expect(true).toBe(false);
      } catch (e) {
        const error: Error = e as Error;
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(
          'Barcode header contains a version of 3 (instead of 1 or 2), which is not supported by this library yet.'
        );
      }
    });

    describe('on unknown data fields', () => {
      const ticket = dummyTicket('MYID!!', '01', 'Test');
      test('should ignore unkown data fields', async () => {
        const parsedTicket = await interpretBarcode(ticket);
        const results: barcodeData.TicketDataContainer[] = parsedTicket.ticketContainers as barcodeData.TicketDataContainer[];
        expect(Object.keys(results)).not.toHaveLength(0);
      });
      test('should parse the unknown container id', async () => {
        const parsedTicket = await interpretBarcode(ticket);
        const results: barcodeData.TicketDataContainer[] = parsedTicket.ticketContainers as barcodeData.TicketDataContainer[];
        expect(results[0].id).toBe('MYID!!');
      });
      test('should not touch/parse the container data', async () => {
        const parsedTicket = await interpretBarcode(ticket);
        const results: barcodeData.TicketDataContainer[] = parsedTicket.ticketContainers as barcodeData.TicketDataContainer[];
        expect(results[0].container_data).toEqual(Buffer.from('Test'));
      });
    });
    describe('on unknown data fieds versions but known id', () => {
      const ticket = dummyTicket('U_HEAD', '03', 'Test');
      test('should ignore unkown versions of data fields', async () => {
        const parsedTicket = await interpretBarcode(ticket);
        const results: barcodeData.TicketDataContainer[] = parsedTicket.ticketContainers as barcodeData.TicketDataContainer[];
        expect(Object.keys(results)).not.toHaveLength(0);
      });
      test('should parse the unknown container id', async () => {
        const parsedTicket = await interpretBarcode(ticket);
        const results: barcodeData.TicketDataContainer[] = parsedTicket.ticketContainers as barcodeData.TicketDataContainer[];
        expect(results[0].id).toBe('U_HEAD');
      });
      test('should not touch/parse the container data', async () => {
        const parsedTicket = await interpretBarcode(ticket);
        const results: barcodeData.TicketDataContainer[] = parsedTicket.ticketContainers as barcodeData.TicketDataContainer[];
        expect(results[0].container_data).toEqual(Buffer.from('Test'));
      });
    });
    describe('verify Signature', () => {
      test('should recognize an valid signature', async () => {
        const validTicket = Buffer.from(
          '2355543031313038303030303037302C0214239CE59CD65ACA33FCC59C2141C51BA825EF1B400214352E9631C8405E2662207868C631959F45D21CDF0000000030343035789C0B8DF77075743130343030353634B030F0B508313130767564400246E60646460646A686068686062EAE2EAEA1F1213E8E91404DC6868641CE2146060686C6406C01A48C811C034BB7C48CA2ECC4A29254A0B146407596062051DFD2E292D4A2DCC43C030333B8A8B16F6205D05CB05EA02B8C2C5C524B4B8A93337212F35274433293B3534B14BCF2934AC02C0343A07120080440B7189A9A02293310C72020B5A8383F4F23354FD3C018C835343001293201B9DBC00C2C600A12006AD003EA37333047881858012933B043116A8C812216081163B01A33339888A19121483DD070A0638CCDDD0FEFC929C94C5728CBCF5500DBA007B2582129B318CC35067343E3DD7C5C2340CE33334E5AC2C87B48BAA52FD0424B499089CB9263D6A3C56E3C8F0E3A883237B0CD3AF44164D6AB672F4E3DB975E8CE9D130C0D4D6A0CFC0C2758FC16DC73E50ECD156E6F397678F1B43D36BB52D5CC190C33981C1C64F0851A93681BA3D91E06C6D72E6B6E4E4E4B79F8C099AFA167C55FAF052A0E0D5F1785651D6C6610101039F6804D97010007F695FA',
          'hex'
        );
        const barcode = await interpretBarcode(validTicket, true);
        expect(barcode).toHaveProperty('isSignatureValid', true);
        expect(barcode).toHaveProperty('validityOfSignature', TicketSignatureVerficationStatus.VALID);
      });
      test('should recognize an invalid signature', async () => {
        const invalidTicket = Buffer.from(
          '2355543031313038303030303037302C0214239CE59CD65ACA33FCC59C2141C51BA825EF1B400214452E9631C8405E2662207868C631959F45D21CDF0000000030343035789C0B8DF77075743130343030353634B030F0B508313130767564400246E60646460646A686068686062EAE2EAEA1F1213E8E91404DC6868641CE2146060686C6406C01A48C811C034BB7C48CA2ECC4A29254A0B146407596062051DFD2E292D4A2DCC43C030333B8A8B16F6205D05CB05EA02B8C2C5C524B4B8A93337212F35274433293B3534B14BCF2934AC02C0343A07120080440B7189A9A02293310C72020B5A8383F4F23354FD3C018C835343001293201B9DBC00C2C600A12006AD003EA37333047881858012933B043116A8C812216081163B01A33339888A19121483DD070A0638CCDDD0FEFC929C94C5728CBCF5500DBA007B2582129B318CC35067343E3DD7C5C2340CE33334E5AC2C87B48BAA52FD0424B499089CB9263D6A3C56E3C8F0E3A883237B0CD3AF44164D6AB672F4E3DB975E8CE9D130C0D4D6A0CFC0C2758FC16DC73E50ECD156E6F397678F1B43D36BB52D5CC190C33981C1C64F0851A93681BA3D91E06C6D72E6B6E4E4E4B79F8C099AFA167C55FAF052A0E0D5F1785651D6C6610101039F6804D97010007F695FA',
          'hex'
        );
        const barcode = await interpretBarcode(invalidTicket, true);
        expect(barcode).toHaveProperty('isSignatureValid', false);
        expect(barcode).toHaveProperty('validityOfSignature', TicketSignatureVerficationStatus.INVALID);
      });
    });
  });
});
