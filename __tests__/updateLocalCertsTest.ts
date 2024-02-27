import { existsSync, unlinkSync, readFileSync } from 'fs';
import { join } from 'path';
import { describe, test, beforeAll, expect } from '@jest/globals';
import { fileName } from '../cert_url.json';

import { updateLocalCerts } from '../src/updateLocalCerts';

const filePath = join(__dirname, '../', fileName);

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
  }, 15000);
});
