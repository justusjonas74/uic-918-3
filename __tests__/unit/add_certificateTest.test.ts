import { existsSync, writeFileSync, readFileSync, unlinkSync, mkdirSync, rmdirSync } from 'fs';
import { join } from 'path';
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { addCertificate } from '../../src/add_certificate.js';
import { updateLocalCerts } from '../../src/postinstall/updateLocalCerts.js';

const tempKeysPath = join(__dirname, '../../tmp-keys-test.json');

interface TestKey {
  issuerCode: string[];
  id: string[];
  isCustom: boolean[];
  issuerName: string[];
}

describe('addCertificate', () => {
  beforeAll(() => {
    // Initialize a clean temp keys.json
    writeFileSync(tempKeysPath, JSON.stringify({ keys: { key: [] } }));
  });

  afterAll(() => {
    if (existsSync(tempKeysPath)) {
      unlinkSync(tempKeysPath);
    }
  });

  test('should create a new keys.json file if it does not exist', () => {
    const missingKeysPath = join(__dirname, '../../tmp-missing-keys.json');
    if (existsSync(missingKeysPath)) {
      unlinkSync(missingKeysPath);
    }
    try {
      const certPath = '/home/francis/uic-certs/008000201.pem';
      addCertificate(certPath, missingKeysPath);
      expect(existsSync(missingKeysPath)).toBe(true);
      const keysData = JSON.parse(readFileSync(missingKeysPath, 'utf8'));
      expect(keysData.keys.key.length).toBe(1);
      const key = keysData.keys.key[0] as TestKey;
      expect(key.issuerCode[0]).toBe('80');
    } finally {
      if (existsSync(missingKeysPath)) {
        unlinkSync(missingKeysPath);
      }
    }
  });

  test('should successfully add a certificate by file path', () => {
    const certPath = '/home/francis/uic-certs/008000201.pem';
    addCertificate(certPath, tempKeysPath);

    const keysData = JSON.parse(readFileSync(tempKeysPath, 'utf8'));
    expect(keysData.keys.key.length).toBe(1);

    const key = keysData.keys.key[0] as TestKey;
    expect(key.issuerCode[0]).toBe('80'); // trimmed leading zeros from 0080
    expect(key.id[0]).toBe('201'); // trimmed leading zeros from 00201
    expect(key.isCustom[0]).toBe(true);
    expect(key.issuerName[0]).toBe('DBVertriebGmBH'); // O from DN
  });

  test('should throw an error when adding a duplicate certificate', () => {
    const certPath = '/home/francis/uic-certs/008000201.pem';
    expect(() => addCertificate(certPath, tempKeysPath)).toThrow(/already exists/);
  });

  test('should successfully add multiple certificates by paths', () => {
    const certPaths = [
      '/home/francis/uic-certs/108000008.pem',
      '/home/francis/uic-certs/3076AM013.pem'
    ];
    addCertificate(certPaths, tempKeysPath);

    const keysData = JSON.parse(readFileSync(tempKeysPath, 'utf8'));
    // 1 (from first test) + 2 = 3
    expect(keysData.keys.key.length).toBe(3);

    // Verify 108000008 details
    const k1080 = (keysData.keys.key as TestKey[]).find((k) => k.issuerCode[0] === '1080');
    expect(k1080).toBeDefined();
    expect(k1080!.id[0]).toBe('8');

    // Verify 3076AM013 details
    const k3076 = (keysData.keys.key as TestKey[]).find((k) => k.issuerCode[0] === '3076');
    expect(k3076).toBeDefined();
    expect(k3076!.id[0]).toBe('AM013');
  });

  test('should successfully add certificates by PEM string and Buffer content', () => {
    // 3634DTV01 has RICS:3634 and KeyId:DTV01 embedded in DN
    const dtv01Content = readFileSync('/home/francis/uic-certs/3634DTV01.pem', 'utf8');
    const dtv01Buffer = readFileSync('/home/francis/uic-certs/3634DTV01.pem');

    // Add string content
    addCertificate(dtv01Content, tempKeysPath);

    const keysData = JSON.parse(readFileSync(tempKeysPath, 'utf8'));
    expect(keysData.keys.key.length).toBe(4);
    const k3634 = (keysData.keys.key as TestKey[]).find((k) => k.issuerCode[0] === '3634');
    expect(k3634).toBeDefined();
    expect(k3634!.id[0]).toBe('DTV01');

    // Try adding duplicate as Buffer -> should throw
    expect(() => addCertificate(dtv01Buffer, tempKeysPath)).toThrow(/already exists/);
  });

  test('should throw error when raw PEM doesn\'t contain embedded RICS/KeyId', () => {
    // 537926001 does not have RICS/KeyId embedded in DN
    const content = readFileSync('/home/francis/uic-certs/537926001.pem', 'utf8');
    expect(() => addCertificate(content, tempKeysPath)).toThrow(/Failed to determine RICS code/);
  });

  test('should successfully add a directory of PEM files', () => {
    // Let's create a temp directory with a couple of pem files
    const tempDir = join(__dirname, '../../tmp-certs-dir');
    if (!existsSync(tempDir)) {
      mkdirSync(tempDir);
    }
    
    // Copy 537926001.pem and 3076TR001.pem into it
    const file1 = readFileSync('/home/francis/uic-certs/537926001.pem');
    const file2 = readFileSync('/home/francis/uic-certs/3076TR001.pem');
    
    writeFileSync(join(tempDir, '537926001.pem'), file1);
    writeFileSync(join(tempDir, '3076TR001.pem'), file2);

    try {
      addCertificate(tempDir, tempKeysPath);
      
      const keysData = JSON.parse(readFileSync(tempKeysPath, 'utf8'));
      // Previous was 4. Now we added 537926001 (RICS 5379, KeyId 26001) and 3076TR001 (RICS 3076, KeyId TR001 but wait!
      // In the previous test we added 3076AM013 which has RICS 3076 but KeyID AM013.
      // So 3076TR001 is not a duplicate.
      // 537926001 is also not a duplicate.
      // Total should be 4 + 2 = 6.
      expect(keysData.keys.key.length).toBe(6);

      const k5379 = (keysData.keys.key as TestKey[]).find((k) => k.issuerCode[0] === '5379');
      expect(k5379).toBeDefined();
      expect(k5379!.id[0]).toBe('26001');
    } finally {
      // Cleanup temp directory
      unlinkSync(join(tempDir, '537926001.pem'));
      unlinkSync(join(tempDir, '3076TR001.pem'));
      rmdirSync(tempDir);
    }
  });

  test('should preserve custom certificates when updateLocalCerts postinstall script runs', async () => {
    // Run updateLocalCerts on our tempKeysPath
    // This will fetch fresh keys from railpublickey.uic.org and merge existing custom keys
    await updateLocalCerts(tempKeysPath);

    const keysData = JSON.parse(readFileSync(tempKeysPath, 'utf8'));
    // Check that our custom keys (like issuerCode: 80, id: 201) are still in the merged result
    const customKey = (keysData.keys.key as TestKey[]).find((k) => k.issuerCode[0] === '80' && k.id[0] === '201');
    expect(customKey).toBeDefined();
    expect(customKey!.isCustom[0]).toBe(true);

    const anotherCustomKey = (keysData.keys.key as TestKey[]).find((k) => k.issuerCode[0] === '3634' && k.id[0] === 'DTV01');
    expect(anotherCustomKey).toBeDefined();
    expect(anotherCustomKey!.isCustom[0]).toBe(true);
  }, 120000);
});
