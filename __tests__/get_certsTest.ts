import { describe, test, expect, beforeAll } from '@jest/globals';
import { getCertByID } from '../src/get_certs';
import { existsSync } from 'fs';
import { filePath, updateLocalCerts } from '../src/postinstall/updateLocalCerts';

describe('get_certs.js', () => {
  beforeAll(async () => {
    if (!existsSync(filePath)) {
      await updateLocalCerts();
    }
  });
  describe('getCertByID', () => {
    test('should return a certificate if key is found', async () => {
      await expect(getCertByID(1080, 6)).resolves.toBeInstanceOf(Object);
      await expect(getCertByID(1080, 6)).resolves.toHaveProperty('issuerName');
      await expect(getCertByID(1080, 6)).resolves.toHaveProperty('issuerCode');
      await expect(getCertByID(1080, 6)).resolves.toHaveProperty('versionType');
      await expect(getCertByID(1080, 6)).resolves.toHaveProperty('signatureAlgorithm');
      await expect(getCertByID(1080, 6)).resolves.toHaveProperty('id');
      await expect(getCertByID(1080, 6)).resolves.toHaveProperty('publicKey');
    });
    test('should return undefined if key not found', async () => {
      await expect(getCertByID(1, 1)).resolves.toBeUndefined();
    });
    test('should return undefined if key file not found', async () => {
      await expect(getCertByID(1, 1, 'foot.txt')).resolves.toBeUndefined();
    });
  });
});
