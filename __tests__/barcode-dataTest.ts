import {describe, expect, test} from '@jest/globals';

import { dummyTicket, dummyTicket2 } from './helper'

import interpretBarcode from '../src/barcode-data'

describe('barcode-data', () => {
  describe('barcode-data.interpret', () => {
    test('should return an object for ticket version 1', () => {
      const ticket = dummyTicket('U_HEAD', '01', 'Hi!')
      expect(interpretBarcode(ticket)).toBeInstanceOf(Object)
    })
    it('should return an object for ticket version 2', () => {
      const ticket = dummyTicket('U_HEAD', '02', 'Hi!')
      expect(interpretBarcode(ticket)).toBeInstanceOf(Object)
    })
    it('should show the correct version for ticket version 1', () => {
      const ticket = dummyTicket('U_HEAD', '01', 'Hi!')
      expect(interpretBarcode(ticket).version).toBe(1)
    })
    it('should show the correct version for ticket version 2', () => {
      const ticket = dummyTicket2('U_HEAD', '01', 'Hi!')
      expect(interpretBarcode(ticket).version).toBe(2)
    })
    it('should return an empty array if input param is an empty buffer.', () => {
      expect(Array.isArray(interpretBarcode(Buffer.from('')).ticketContainers)).toBe(true)
      expect(interpretBarcode(Buffer.from('')).ticketContainers).toHaveLength(0) // eslint-disable-line no-unused-expressions
    })

    describe('on unknown data fields', () => {
      let results
      beforeEach((done) => {
        const ticket = dummyTicket('MYID!!', '01', 'Test')
        results = interpretBarcode(ticket).ticketContainers
        done()
      })
      it('should ignore unkown data fields', () => {
        expect(Object.keys(results)).not.toHaveLength(0) // eslint-disable-line no-unused-expressions
      })
      it('should parse the unknown container id', () => {
        expect(results[0].id).toBe('MYID!!')
      })
      it('should not touch/parse the container data', () => {
        expect(results[0].container_data).toEqual(Buffer.from('Test'))
      })
    })
    describe('on unknown data fieds versions but known id', () => {
      let results
      beforeEach((done) => {
        const ticket = dummyTicket('U_HEAD', '03', 'Test')
        results = interpretBarcode(ticket).ticketContainers
        done()
      })
      it('should ignore unkown versions of data fields', () => {
        expect(Object.keys(results)).not.toHaveLength(0) // eslint-disable-line no-unused-expressions
      })
      it('should parse the unknown container id', () => {
        expect(results[0].id).toBe('U_HEAD')
      })
      it('should not touch/parse the container data', () => {
        expect(results[0].container_data).toEqual(Buffer.from('Test'))
      })
    })
  })
})
