import { existsSync, unlinkSync, readFileSync } from 'fs';
import { join } from 'path';
import { describe, test, beforeAll, expect } from 'vitest';

import { updateLocalCerts } from '../../src/postinstall/updateLocalCerts.js';
const filePath = join(__dirname, '../../keys.json');

describe('updateLocalCerts', () => {
  beforeAll(() => {
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  });
  test('should create a not empty file', async () => {
    await updateLocalCerts(filePath);
    expect(existsSync(filePath)).toBeTruthy();
    expect(readFileSync(filePath).length).toBeGreaterThan(0);
  }, 120000);
});
