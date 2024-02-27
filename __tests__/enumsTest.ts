import { describe, expect, test } from '@jest/globals';

import { efm_produkt, id_types, sBlockTypes, orgid, tarifpunkt } from '../src/enums';

describe('enums.sBlockTypes', () => {
  test('should return an instance of enum', () => {
    expect(sBlockTypes).toBeInstanceOf(Object);
  });
});
describe('id_types', () => {
  const result = id_types;
  test('should return an instance of enum', () => {
    expect(result).toBeInstanceOf(Object);
  });
});
describe('enums.efm_produkt', () => {
  test('should return a object', () => {
    expect(efm_produkt(6263, 1005)).toBeInstanceOf(Object);
  });
  test('should have correct property kvp_organisations_id', () => {
    expect(efm_produkt(6263, 1005)).toHaveProperty('kvp_organisations_id', '6263 (DB Regio Zentrale)');
  });
  test('should have correct property produkt_nr', () => {
    expect(efm_produkt(6263, 1005)).toHaveProperty('produkt_nr', '1005 (Bayern-Ticket)');
  });
  test('should ignore unknow products', () => {
    expect(efm_produkt(6263, 1)).toHaveProperty('kvp_organisations_id', '6263 (DB Regio Zentrale)');
    expect(efm_produkt(6263, 1)).toHaveProperty('produkt_nr', '1');
  });
  test('should ignore unknow organisations', () => {
    expect(efm_produkt(815, 1005)).toHaveProperty('kvp_organisations_id', '815');
    expect(efm_produkt(815, 1005)).toHaveProperty('produkt_nr', '1005');
  });
});

describe('enums.org_id', () => {
  test('should return a string with the correct value', () => {
    expect(typeof orgid(6262)).toBe('string');
  });
  test('should ignore unknown values', () => {
    expect(typeof orgid(815)).toBe('string');
  });
});

describe('enums.tarifpunkt', () => {
  test('should return a string', () => {
    expect(typeof tarifpunkt(6263, 8000284)).toBe('string');
  });
  test('should have correct properties', () => {
    expect(tarifpunkt(6263, 8000284)).toBe('8000284 (Nürnberg Hbf)');
  });
  test('should ignore unknow stops', () => {
    expect(tarifpunkt(6263, 1)).toBe('1');
  });
  test('should ignore unknow organisations', () => {
    expect(tarifpunkt(1, 1)).toBe('1');
  });
});
