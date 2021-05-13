import { UICTicket } from "../../src/uic/UICTicket"
import * as zlib from 'zlib'
// const spy = jest.spyOn(global.console, 'log')


import * as testData from '../testData.json'
const  fullTicket = Buffer.from(testData.fullTicket1, 'hex')

describe("UICTicket class", () => {
    describe("static getLengthOfCompressedData()", () => {
        it("should return a number with the ascii encoded length of the compressed ticket data block", ()=>{
            const buf = Buffer.from('30313233', 'hex')
            const result = UICTicket.getLengthOfCompressedData(buf)
            expect(result).toBe(123)
        })
        it("should only use the leading four bytes", ()=>{
            const buf = Buffer.from('3031323330323435', 'hex')
            const result = UICTicket.getLengthOfCompressedData(buf)
            expect(result).toBe(123)
        })
    })

    describe("static unzipTicketData()", () => {


        it("should return an uncompressed buffer", ()=>{
            const testData = Buffer.from('1234567890ABCDEF', 'hex')
            const zippedTestData = zlib.gzipSync(testData)
            const result = UICTicket.unzipTicketData(zippedTestData)
            expect(result).toStrictEqual(testData)
        })
        it("should return undefined if Buffer is empty", ()=>{
            const emptyBuffer = Buffer.from('', 'hex')
            const result = UICTicket.unzipTicketData(emptyBuffer)
            expect(result).toBeUndefined()
            
        })
        it("should return undefined if unzip thorws an error", ()=>{
            beforeEach(() => {
                consoleSpy.mockClear()
            })
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
             // const spy = jest.spyOn(console, 'log').mockImplementation();
            const emptyBuffer = Buffer.from('1234567890', 'hex')
            const result = UICTicket.unzipTicketData(emptyBuffer)
            expect(result).toBeUndefined()
            expect(console.log).toBeCalledTimes(1) 
            consoleSpy.mockRestore();
        })
        it("should handle real world tickets", ()=>{
            const uncompressedData = Buffer.from(testData.ticketOneUncompressed, 'hex')
            const testTicket = UICTicket.fromBuffer(fullTicket)
            // console.log(result.toString('hex'))
            expect(testTicket.ticketDataUncompressed).toBeDefined()
            expect(testTicket.ticketDataUncompressed).toStrictEqual(uncompressedData)
            
        })
    })
    describe("fromBuffer()", ()=>{
        it("should return a UICTicket", () =>{
            const testTicket = UICTicket.fromBuffer(fullTicket)
            expect(testTicket).toHaveProperty('lengthOfCompressedData')
            expect(testTicket).toHaveProperty('ticketDataCompressed')
            expect(testTicket).toHaveProperty('ticketDataUncompressed')
    
        })
    })
    describe("sliceUncompressedData()", ()=>{
        it("should return an array which isn't empty", ()=>{
            const testTicket = UICTicket.fromBuffer(fullTicket)
            const slicedData = UICTicket.sliceUncompressedData(testTicket.ticketDataUncompressed)
            
            expect(Array.isArray(slicedData)).toBe(true);
            expect(slicedData.length).toBe(2)
        })
           
    })
})