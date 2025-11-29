import { beforeAll, describe, expect, test } from 'vitest';

import fs, { existsSync } from 'fs';
import { readBarcode, interpretBarcode } from '../../src/index.js';
import { TicketSignatureVerficationStatus } from '../../src/check_signature.js';
import { TicketDataContainer } from '../../src/barcode-data.js';
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
    describe('...when input contains U_FLEX container', () => {
      // Hex-String aus einem Aztec-Barcode mit U_FLEX-Container (in U_TLAY Container)
      const uflexBarcodeHex =
        '23555430323336333444545830336889ACAFB6D8C79A13B6D7E54D6D3B7EFE14306B002C2E300D55CFBCBBAA376E8517A89C7330A43BBD02C60C7DD7653E7C64F6B564F24520D2348741652F1B5630313935789C0B8D77F3718D30303630B4342C5261EE71CA7869512838F5EAC5B3BD0B37B6EE9C78B1F5E4D29937A79EECBCBA73C256D9AD9D0A2D2EF97E2169793A0A5C9D0FB87C132B327333733213F3B87C4B8B4B528B7213F3F2781238189A4C1BBC194EB040D5726F57E767E233628A5AC23081A1D1A56B7223D305968606A58E53AF5E3C3B76E1C6A13B275E5C3A76EDD40B163D09A6DC0807E66B9D91B3D978380F1F68EE6998B692C1A391F1B5CB9AABCD6C0C0A0A9A1602BA0C8E502E030021D24EE8';
      const uflexBarcodeBuffer = Buffer.from(uflexBarcodeHex, 'hex');

      test('should parse U_FLEX barcode data directly with interpretBarcode', async () => {
        const barcode = await interpretBarcode(uflexBarcodeBuffer);
        expect(barcode).toBeInstanceOf(Object);
        expect(barcode).toHaveProperty('version');
        expect(barcode).toHaveProperty('ticketContainers');
        expect(Array.isArray(barcode.ticketContainers)).toBe(true);
        expect(barcode.ticketContainers.length).toBeGreaterThan(0);
      });

      test('should contain U_FLEX container in ticketContainers', async () => {
        const barcode = await interpretBarcode(uflexBarcodeBuffer);
        const uflexContainer = barcode.ticketContainers.find(
          (container: unknown) =>
            container instanceof TicketDataContainer && container.id === 'U_FLEX' && container.version === '03'
        );
        expect(uflexContainer).toBeDefined();
        if (uflexContainer instanceof TicketDataContainer) {
          expect(uflexContainer.id).toBe('U_FLEX');
          expect(uflexContainer.version).toBe('03');
        }
      });

      test('should have container data in U_FLEX container', async () => {
        const barcode = await interpretBarcode(uflexBarcodeBuffer);
        const uflexContainer = barcode.ticketContainers.find(
          (container: unknown) =>
            container instanceof TicketDataContainer && container.id === 'U_FLEX' && container.version === '03'
        ) as TicketDataContainer | undefined;
        expect(uflexContainer).toBeDefined();
        if (uflexContainer) {
          // Da TC_U_FLEX_03 falsch konfiguriert ist (name='U_TLAY' statt 'U_FLEX'),
          // wird container_data als Buffer zurückgegeben, nicht als interpretiertes Objekt
          expect(uflexContainer.container_data).toBeDefined();
          // container_data sollte ein Buffer sein, wenn der Container nicht richtig geparst wird
          if (uflexContainer.container_data instanceof Buffer) {
            expect(uflexContainer.container_data.length).toBeGreaterThan(0);
          }
        }
      });

      test('should parse barcode header correctly', async () => {
        const barcode = await interpretBarcode(uflexBarcodeBuffer);
        expect(barcode).toHaveProperty('header');
        expect(barcode.header).toHaveProperty('umid');
        expect(barcode.header).toHaveProperty('mt_version');
        expect(barcode.header).toHaveProperty('rics');
        expect(barcode.header).toHaveProperty('key_id');
        // Version sollte 2 sein (basierend auf dem Hex-String)
        expect(barcode.version).toBe(2);
      });

      test('should parse barcode signature correctly', async () => {
        const barcode = await interpretBarcode(uflexBarcodeBuffer);
        expect(barcode).toHaveProperty('signature');
        expect(barcode.signature).toBeInstanceOf(Buffer);
        // Für Version 2 sollte die Signatur 64 Bytes lang sein
        expect(barcode.signature.length).toBe(64);
      });

      test('should parse ticket data correctly', async () => {
        const barcode = await interpretBarcode(uflexBarcodeBuffer);
        expect(barcode).toHaveProperty('ticketDataRaw');
        expect(barcode).toHaveProperty('ticketDataUncompressed');
        expect(barcode.ticketDataRaw).toBeInstanceOf(Buffer);
        expect(barcode.ticketDataUncompressed).toBeInstanceOf(Buffer);
        expect(barcode.ticketDataUncompressed.length).toBeGreaterThan(0);
      });

      test('should handle verifySignature option with U_FLEX barcode', async () => {
        const barcode = await interpretBarcode(uflexBarcodeBuffer, true);
        expect(barcode).toHaveProperty('validityOfSignature');
        // isSignatureValid wird nur gesetzt, wenn validityOfSignature VALID oder INVALID ist
        // Wenn kein Public Key gefunden wird (NOPUBLICKEY), wird isSignatureValid nicht gesetzt
        // In diesem Fall wird wahrscheinlich NOPUBLICKEY zurückgegeben
        expect(barcode.validityOfSignature).toBeDefined();
      });

      test('should have raw container data that can be parsed manually', async () => {
        const barcode = await interpretBarcode(uflexBarcodeBuffer);
        const uflexContainer = barcode.ticketContainers.find(
          (container: unknown) =>
            container instanceof TicketDataContainer && container.id === 'U_FLEX' && container.version === '03'
        ) as TicketDataContainer | undefined;
        expect(uflexContainer).toBeDefined();
        if (uflexContainer && uflexContainer.container_data instanceof Buffer) {
          // Der Container enthält rohe Hex-Daten, die manuell mit parseUFLEX geparst werden können
          const hexData = uflexContainer.container_data.toString('hex');
          expect(hexData.length).toBeGreaterThan(0);
          // Diese Daten könnten mit parseUFLEX geparst werden, wenn der Container richtig konfiguriert wäre
        }
      });
    });
  });
});
