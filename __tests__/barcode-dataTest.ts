import { beforeAll, describe, expect, test } from '@jest/globals';

import { dummyTicket, dummyTicket2 } from './helper';

import interpretBarcode, { TicketDataContainer } from '../src/barcode-data';
import { TicketSignatureVerficationStatus } from '../src/check_signature';
import { existsSync } from 'fs';
import { filePath, updateLocalCerts } from '../src/updateLocalCerts';
beforeAll(async () => {
  if (!existsSync(filePath)) {
    await updateLocalCerts();
  }
});
describe('barcode-data', () => {
  describe('barcode-data.interpret', () => {
    test('should return an object for ticket version 1', () => {
      const ticket = dummyTicket('U_HEAD', '01', 'Hi!');
      expect(interpretBarcode(ticket)).resolves.toBeInstanceOf(Object);
    });
    test('should return an object for ticket version 2', () => {
      const ticket = dummyTicket('U_HEAD', '02', 'Hi!');
      expect(interpretBarcode(ticket)).resolves.toBeInstanceOf(Object);
    });
    test('should show the correct version for ticket version 1', () => {
      const ticket = dummyTicket('U_HEAD', '01', 'Hi!');
      expect(interpretBarcode(ticket)).resolves.toHaveProperty('version', 1);
    });
    test('should show the correct version for ticket version 2', () => {
      const ticket = dummyTicket2('U_HEAD', '01', 'Hi!');
      expect(interpretBarcode(ticket)).resolves.toHaveProperty('version', 2);
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
        const results: TicketDataContainer[] = parsedTicket.ticketContainers as TicketDataContainer[];
        expect(Object.keys(results)).not.toHaveLength(0);
      });
      test('should parse the unknown container id', async () => {
        const parsedTicket = await interpretBarcode(ticket);
        const results: TicketDataContainer[] = parsedTicket.ticketContainers as TicketDataContainer[];
        expect(results[0].id).toBe('MYID!!');
      });
      test('should not touch/parse the container data', async () => {
        const parsedTicket = await interpretBarcode(ticket);
        const results: TicketDataContainer[] = parsedTicket.ticketContainers as TicketDataContainer[];
        expect(results[0].container_data).toEqual(Buffer.from('Test'));
      });
    });
    describe('on unknown data fieds versions but known id', () => {
      const ticket = dummyTicket('U_HEAD', '03', 'Test');
      test('should ignore unkown versions of data fields', async () => {
        const parsedTicket = await interpretBarcode(ticket);
        const results: TicketDataContainer[] = parsedTicket.ticketContainers as TicketDataContainer[];
        expect(Object.keys(results)).not.toHaveLength(0);
      });
      test('should parse the unknown container id', async () => {
        const parsedTicket = await interpretBarcode(ticket);
        const results: TicketDataContainer[] = parsedTicket.ticketContainers as TicketDataContainer[];
        expect(results[0].id).toBe('U_HEAD');
      });
      test('should not touch/parse the container data', async () => {
        const parsedTicket = await interpretBarcode(ticket);
        const results: TicketDataContainer[] = parsedTicket.ticketContainers as TicketDataContainer[];
        expect(results[0].container_data).toEqual(Buffer.from('Test'));
      });
    });
    describe('verify Signature', () => {
      test('should recognize an invalid signature', async () => {
        const invalidTicket = Buffer.from(
          '2355543031313038303030303036302e0215008beb83c5db4992412387e99ed58fe2cc59aa8a8c021500f66f662724ca0b49a95d7f81810cbfa5696d06ed000030313730789c4d4ec10a824014fc95f70125f376db6cbd098a1db28434e8144b6c21a50777fdff56106d18dee1cd0c33cde398a719185052ee58710cc54ad13fa0a10438660eb62c276a1ef529bd87106bce2fd706218d09c133dd436906dff686cad1793b74a6efc1abbcafcddbbaba7d7eaca7ea3b3a884514ba1a6ceb9c1f5f96181bba15672aac339d1fccd8412e4e29451c4145d3320212602bf4fa90c9bc6a2e0d8c02596bfc005e033b47',
          'hex'
        );
        const barcode = await interpretBarcode(invalidTicket, true);
        expect(barcode).toHaveProperty('isSignatureValid', false);
        expect(barcode).toHaveProperty('validityOfSignature', TicketSignatureVerficationStatus.INVALID);
      });
    });
  });
});
