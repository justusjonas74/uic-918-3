import { existsSync, unlinkSync } from 'fs'
import {join} from 'path'
import * as chai from 'chai';

chai.should()

import {updateLocalCerts} from '../src/get_certs'
import {fileName} from '../cert_url.json'

const filePath = join(__dirname, '../', fileName)

describe('get_certs.js', () => {
  describe('updateLocalCerts', () => {
    before((done) => {
      // remove keys.json
      if (existsSync(filePath)) {
        unlinkSync(filePath)
      }
      updateLocalCerts()
      done()
    })
    it('should create a not empty file', () => {
      // expect(file(filePath)).to.exist.and.to.not.be.empty()
    })
  })
  describe('getCertByID', () => {
    it('should return ', () => {
    // gc.getCertByID().should
    })
  })
})
