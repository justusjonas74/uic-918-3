import { existsSync } from 'fs'
import {join} from 'path'
import {describe, test, beforeAll} from '@jest/globals';

// import {updateLocalCerts} from '../src/get_certs'
import {fileName} from '../cert_url.json'

const filePath = join(__dirname, '../', fileName)

describe('get_certs.js', () => {
  describe('updateLocalCerts', () => {
    beforeAll(() => {
      if (existsSync(filePath)) {
        // unlinkSync(filePath)
      }
    })
    test('should create a not empty file', () => {
      // expect(file(filePath)).to.exist.and.to.not.be.empty()
    })
  })
  describe('getCertByID', () => {
    test('should return ', () => {
    // gc.getCertByID().should
    })
  })
})
