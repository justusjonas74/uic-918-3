import { existsSync, unlinkSync, readFileSync } from 'fs';
import { join } from 'path';
import { describe, test, beforeAll, expect } from 'vitest';
import cert_url from '../../cert_url.json';

import { updateLocalCerts } from '../../src/postinstall/updateLocalCerts.js';

const filePath = join(__dirname, '../../', cert_url.fileName);

describe('updateLocalCerts', () => {
  beforeAll(() => {
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  });
  test('should create a not empty file', async () => {
    await updateLocalCerts();
    expect(existsSync(filePath)).toBeTruthy();
    expect(readFileSync(filePath).length).toBeGreaterThan(0);
  }, 120000);
});
