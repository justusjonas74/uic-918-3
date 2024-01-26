import * as chai from 'chai';
chai.should()

import {efm_produkt, id_types, sBlockTypes, orgid, tarifpunkt} from '../src/enums'


describe('enums.sBlockTypes', () => {

  it('should return an instance of enum', () => {
    sBlockTypes.should.be.an('object');
  })
  // it('should not be empty', () => {
  //   sBlockTypes.enums.should.not.be.empty // eslint-disable-line no-unused-expressions
  // })
})
describe('id_types', () => {
  const result = id_types
  it('should return an instance of enum', () => {
    result.should.should.be.an('object');
  })
  // it('should not be empty', () => {
  //   result.enums.should.not.be.empty // eslint-disable-line no-unused-expressions
  // })
})
describe('enums.efm_produkt', () => {
  it('should return an object', () => {
    efm_produkt(6263, 1005).should.be.an('object')
  })
  it('should have correct property kvp_organisations_id', () => {
    efm_produkt(6263, 1005).should.have.deep.property('kvp_organisations_id', '6263 (DB Regio Zentrale)')
  })
  it('should have correct property produkt_nr', () => {
    efm_produkt(6263, 1005).should.have.deep.property('produkt_nr', '1005 (Bayern-Ticket)')
  })
  it('should ignore unknow products', () => {
    efm_produkt(6263, 1).should.have.deep.property('kvp_organisations_id', '6263 (DB Regio Zentrale)')
    efm_produkt(6263, 1).should.have.deep.property('produkt_nr', '1')
  })
  it('should ignore unknow organisations', () => {
    efm_produkt(815, 1005).should.have.deep.property('kvp_organisations_id', '815')
    efm_produkt(815, 1005).should.have.deep.property('produkt_nr', '1005')
  })
})

describe('enums.org_id', () => {
  it('should return a string with the correct value', () => {
    orgid(6262).should.be.equal('6262 (DB Fernverkehr)').and.be.a('string')
  })
  it('should ignore unknown values', () => {
    orgid(815).should.be.equal('815').and.be.a('string')
  })
})

describe('enums.tarifpunkt', () => {
  it('should return a string', () => {
    tarifpunkt(6263, 8000284).should.be.a('string')
  })
  it('should have correct properties', () => {
    tarifpunkt(6263, 8000284).should.be.equal('8000284 (Nürnberg Hbf)')
  })
  it('should ignore unknow stops', () => {
    tarifpunkt(6263, 1).should.be.equal('1')
  })
  it('should ignore unknow organisations', () => {
    tarifpunkt(1, 1).should.be.equal('1')
  })
})


