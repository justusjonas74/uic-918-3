import * as chai from 'chai';
expect(chai)()

import {efm_produkt, id_types, sBlockTypes, orgid, tarifpunkt} from '../src/enums'


describe('enums.sBlockTypes', () => {

  it('should return an instance of enum', () => {
    expect(sBlockTypes).toBeInstanceOf(Object);
  })
  // it('should not be empty', () => {
  //   sBlockTypes.enums.should.not.be.empty // eslint-disable-line no-unused-expressions
  // })
})
describe('id_types', () => {
  const result = id_types
  it('should return an instance of enum', () => {
    expect(result.should).toBeInstanceOf(Object);
  })
  // it('should not be empty', () => {
  //   result.enums.should.not.be.empty // eslint-disable-line no-unused-expressions
  // })
})
describe('enums.efm_produkt', () => {
  it('should return an object', () => {
    expect(efm_produkt(6263, 1005)).toBeInstanceOf(Object)
  })
  it('should have correct property kvp_organisations_id', () => {
    expect(efm_produkt(6263, 1005)).toHaveProperty('kvp_organisations_id', '6263 (DB Regio Zentrale)')
  })
  it('should have correct property produkt_nr', () => {
    expect(efm_produkt(6263, 1005)).toHaveProperty('produkt_nr', '1005 (Bayern-Ticket)')
  })
  it('should ignore unknow products', () => {
    expect(efm_produkt(6263, 1)).toHaveProperty('kvp_organisations_id', '6263 (DB Regio Zentrale)')
    expect(efm_produkt(6263, 1)).toHaveProperty('produkt_nr', '1')
  })
  it('should ignore unknow organisations', () => {
    expect(efm_produkt(815, 1005)).toHaveProperty('kvp_organisations_id', '815')
    expect(efm_produkt(815, 1005)).toHaveProperty('produkt_nr', '1005')
  })
})

describe('enums.org_id', () => {
  it('should return a string with the correct value', () => {
    expect(typeof orgid(6262)).toBe('string')
  })
  it('should ignore unknown values', () => {
    expect(typeof orgid(815)).toBe('string')
  })
})

describe('enums.tarifpunkt', () => {
  it('should return a string', () => {
    expect(typeof tarifpunkt(6263, 8000284)).toBe('string')
  })
  it('should have correct properties', () => {
    expect(tarifpunkt(6263, 8000284)).toBe('8000284 (Nürnberg Hbf)')
  })
  it('should ignore unknow stops', () => {
    expect(tarifpunkt(6263, 1)).toBe('1')
  })
  it('should ignore unknow organisations', () => {
    expect(tarifpunkt(1, 1)).toBe('1')
  })
})


