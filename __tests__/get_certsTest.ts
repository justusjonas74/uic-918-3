import { existsSync, unlinkSync } from 'fs'
import {join} from 'path'
import {describe, test, beforeAll} from '@jest/globals';

// import {updateLocalCerts} from '../src/get_certs'
import {fileName} from '../cert_url.json'

const filePath = join(__dirname, '../', fileName)

describe('get_certs.js', () => {
  describe('updateLocalCerts', () => {
    beforeAll((done) => {
      // remove keys.json
      if (existsSync(filePath)) {
        unlinkSync(filePath)
      }
      // updateLocalCerts()
      done()
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
