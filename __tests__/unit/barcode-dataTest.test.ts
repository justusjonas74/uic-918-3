import { describe, beforeAll, test, expect } from 'vitest';
import { dummyTicket, dummyTicket2 } from './helper.js';

import interpretBarcode, * as barcodeData from '../../src/barcode-data.js'
import { TicketSignatureVerficationStatus } from '../../src/check_signature.js';
import { existsSync } from 'fs';
import { updateLocalCerts } from '../../src/postinstall/updateLocalCerts.js';


beforeAll(async () => {
  // Check if file ./../../keys.json is available, if not, update the local certs.
  if (existsSync('./../../keys.json')) {
    console.log('Local certs already available.');
  } else {
    console.log('Local certs not available, updating now...');
    await updateLocalCerts();
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
        const invalidTicket = Buffer.from(
          '2355543031303038303030303037302C021453F88D44F400182B3B288506AB68F3172BEE0C5F02140C8809B38C72343A7EE293E5942EA39B74D38BA60000000030323330789C658F314FC3301085FB5322B19421D1DDD90E365B210E20280C1633F290960854450E61E8AFE75D452524B2F8D3F75E4E77AF6FF771D311133943E4C9A797C77457DBD59F8F1C939018BE42A58B5DD4E2CD131992E0C9305966CDCF6F30D60601AFB84DA4B3D9A5651A4A95A65CA6328C33B410BC008CC20610008E6BAA292151AB600192506407E3FB920F1FBBA57CADB797FDE7B27F6F90B4FA679CE7E190485867F7F529ACB8BD16AE1E6E632BD8053BA2BC1DCB310FDFB97ACE653F1E33BC0E103620AF8DDFE0E2DC4C7AA51E621BE6466F84917F060B427B069E0606FF03FED553CA',
          // '2355543031313038303030303036302e0215008beb83c5db4992412387e99ed58fe2cc59aa8a8c021500f66f662724ca0b49a95d7f81810cbfa5696d06ed000030313730789c4d4ec10a824014fc95f70125f376db6cbd098a1db28434e8144b6c21a50777fdff56106d18dee1cd0c33cde398a719185052ee58710cc54ad13fa0a10438660eb62c276a1ef529bd87106bce2fd706218d09c133dd436906dff686cad1793b74a6efc1abbcafcddbbaba7d7eaca7ea3b3a884514ba1a6ceb9c1f5f96181bba15672aac339d1fccd8412e4e29451c4145d3320212602bf4fa90c9bc6a2e0d8c02596bfc005e033b47',
          'hex'
        );
        const barcode = await interpretBarcode(invalidTicket, true);
        expect(barcode).toHaveProperty('isSignatureValid', true);
        expect(barcode).toHaveProperty('validityOfSignature', TicketSignatureVerficationStatus.VALID);
      });
      test('should recognize an invalid signature', async () => {
        const invalidTicket = Buffer.from(
          '2355543031303038303030303037302C021453F88D44F400182B3B288506AB68F3172CDE0C5F02140C8809B38C72343A7EE293E5942EA39B74D38BA60000000030323330789C658F314FC3301085FB5322B19421D1DDD90E365B210E20280C1633F290960854450E61E8AFE75D452524B2F8D3F75E4E77AF6FF771D311133943E4C9A797C77457DBD59F8F1C939018BE42A58B5DD4E2CD131992E0C9305966CDCF6F30D60601AFB84DA4B3D9A5651A4A95A65CA6328C33B410BC008CC20610008E6BAA292151AB600192506407E3FB920F1FBBA57CADB797FDE7B27F6F90B4FA679CE7E190485867F7F529ACB8BD16AE1E6E632BD8053BA2BC1DCB310FDFB97ACE653F1E33BC0E103620AF8DDFE0E2DC4C7AA51E621BE6466F84917F060B427B069E0606FF03FED553CA',
          'hex'
        );
        const barcode = await interpretBarcode(invalidTicket, true);
        expect(barcode).toHaveProperty('isSignatureValid', false);
        expect(barcode).toHaveProperty('validityOfSignature', TicketSignatureVerficationStatus.INVALID);
      });
    });
  });
});
