import { existsSync, unlinkSync, readFileSync } from 'fs';
import { join } from 'path';
import { describe, test, beforeAll, expect, jest } from '@jest/globals';
import { fileName } from '../cert_url.json';

import axios from 'axios';

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
    // expect(file(filePath)).to.exist.and.to.not.be.empty()
  });
  test('Should handle connection error', async () => {
    jest.mock('axios');
    const mockedAxios = jest.mocked(axios, true);
    // const mockedAxios = axios as jest.Mocked<typeof axios>;
    // const axiosGetMock = <jest.Mock>axios.get;
    mockedAxios.get.mockImplementationOnce(() => Promise.reject(new Error('No Connection')));
    expect(updateLocalCerts()).resolves.not.toThrow();
  });
});
