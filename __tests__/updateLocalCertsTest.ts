import { existsSync, unlinkSync, readFileSync } from 'fs';
import { join } from 'path';
import { describe, test, beforeAll, expect } from '@jest/globals';
import { fileName } from '../cert_url.json';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, * as _others from 'axios';

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
  // test('Should handle connection error', async () => {
  //   jest.mock('axios');
  //   // const mockedAxios = jest.mocked(axios, true);
  //   // const mockedAxios = axios as jest.Mocked<typeof axios>;
  //   // const axiosGetMock = <jest.Mock>axios.get;
  //   // Mock jest and set the type
  //   const mockedAxios = axios.get as jest.Mocked<typeof axios>;
  //   // mockedAxios.get.mockImplementationOnce(() => Promise.reject(new Error('No Connection')));
  //   mockedAxios.mockRejectedValueOnce(new Error('Foo'));
  //   expect(updateLocalCerts()).resolves.not.toThrow();
  // });
});
