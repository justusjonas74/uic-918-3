import { ElementaryType } from '../../src/simpleTypes/ElementaryType'
import { UICRCT2Block } from '../../src/uic/UIC_RCT2Block'
import * as testData from '../testData.json'


describe("UICRCT2Block", () =>{
    const uheadBlockHex = testData.UHEAD
    const uheadBlock = new UICRCT2Block(Buffer.from(uheadBlockHex, 'hex'))
    const utlayBlockHex = testData.UTLAY
    const utlayBlock = new UICRCT2Block(Buffer.from(utlayBlockHex, 'hex'))

    describe("static getContainerType()", ()=>{
        it("should return an array, if type is known",()=>{
            const result = UICRCT2Block.getContainerType("U_HEAD", 1)
            expect(result).toBeDefined()
            expect(result).toHaveProperty('name')
            expect(result).toHaveProperty('version')
            expect(result).toHaveProperty('handlers')
            expect(result.handlers).toHaveLength(7)
        })
        it("should return an undefined , if type is unknown", ()=>{
            const result = UICRCT2Block.getContainerType("123456", 1)
            expect(result).toBeUndefined()
        })
    })

    describe("static parseFields()", ()=>{

        it("should return undefined if container type is unknown", ()=>{
            beforeEach(() => {
                consoleSpy.mockClear()
            })
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
            const buf = Buffer.from("123456789012303030303030303030")
            const result = UICRCT2Block.parseFields("Hello", 1, buf)
            const warning = "Warning: Container with id Hello and version 1 is unknown. Couldn't parse data"
            expect(result).toBeUndefined()
            expect(console.log).toBeCalledTimes(1) 
            expect(console.log).toBeCalledWith(warning)
            consoleSpy.mockRestore();
        })

        it("should return an array if container type is known", ()=>{
            const buf = Buffer.from(uheadBlockHex, 'hex').slice(12)
            const result = UICRCT2Block.parseFields("U_HEAD", 1, buf)
            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(7)
            result.forEach(field =>{
                expect(field).toBeInstanceOf(ElementaryType)
                expect(field).toHaveProperty("name")
                expect(field).toHaveProperty("type")
                expect(field).toHaveProperty("value")
                expect(field).toHaveProperty("hex")
            })
                
            expect(result[0]).toHaveProperty('name',"carrier")
            expect(result[1]).toHaveProperty('name',"auftragsnummer")
            expect(result[2]).toHaveProperty('name',"padding")
            expect(result[3]).toHaveProperty('name',"creation_date")
            expect(result[4]).toHaveProperty('name',"flags")
            expect(result[5]).toHaveProperty('name',"language")
            expect(result[6]).toHaveProperty('name',"language_2")
        })
    })

    describe ("parsedData property", ()=>{
        it("should return an array if container type is known", ()=>{
            const rct2Block = uheadBlock
            const result = rct2Block.parsedData
            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(7)
            result.forEach(field =>{
                expect(field).toBeInstanceOf(ElementaryType)
                expect(field).toHaveProperty("name")
                expect(field).toHaveProperty("type")
                expect(field).toHaveProperty("value")
                expect(field).toHaveProperty("hex")
            })
                
            expect(result[0]).toHaveProperty('name',"carrier")
            expect(result[1]).toHaveProperty('name',"auftragsnummer")
            expect(result[2]).toHaveProperty('name',"padding")
            expect(result[3]).toHaveProperty('name',"creation_date")
            expect(result[4]).toHaveProperty('name',"flags")
            expect(result[5]).toHaveProperty('name',"language")
            expect(result[6]).toHaveProperty('name',"language_2")
        })
    })
    describe("static fromBufferWithRemainder()", ()=>{
        const testTicket = Buffer.from(testData.ticketOneUncompressed, 'hex')
        it("should return a new instance and a buffer with the remaining data", ()=>{
            const result = UICRCT2Block.fromBufferWithRemainder(testTicket)
            expect(result).toHaveLength(2)
            expect(result[0]).toStrictEqual(uheadBlock)
            expect(result[1]).toStrictEqual(Buffer.from(utlayBlockHex, 'hex'))
        })
        it("should return undefined if no data is remaining", ()=>{
            const result = UICRCT2Block.fromBufferWithRemainder(Buffer.from(utlayBlockHex, 'hex'))
            expect(result[0]).toStrictEqual(utlayBlock)
            expect(result[1]).toBeUndefined()

        })
    })
    describe("slicedRawData ()", ()=> {
        it("shoud return a new sliced buffer", () => {
            const result = uheadBlock.slicedRawData(0,6)
            const uheadBuf = Buffer.from("555f48454144", 'hex')
            expect(result).toStrictEqual(uheadBuf)  
        })
        it("shoud return a new sliced buffer without a given length", () => {
            const result = uheadBlock.slicedRawData(0)
            
            expect(result).toStrictEqual(Buffer.from(uheadBlockHex, 'hex'))  
        })
    })
    describe("slicedRawDataString ()", ()=> {
        it("shoud return sliced data which is casted to string", () => {
            const result = utlayBlock.slicedRawDataString(0,6)
            expect(result).toStrictEqual("U_TLAY")
        })
    })
    describe("slicedRawDataNumber ()", ()=> {
        it("shoud return sliced data which is casted to a number", () => {
            const result = utlayBlock.slicedRawDataNumber(8,12)
            expect(result).toBe(254)
        })
    })
    describe("getter id", ()=> {
        it("shoud return the ID of the container as a string", () => {
            const result = utlayBlock.id
            expect(result).toBe("U_TLAY")
            expect(typeof result).toBe('string')
            
        })
    })
    describe("getter version", ()=> {
        it("shoud return the version of the container type as a number", () => {
            const result = utlayBlock.version
            expect(result).toBe(1)
            expect(typeof result).toBe('number')            
        })
    })
    describe("getter length", ()=> {
        it("shoud return the length of the block as a number", () => {
            const result = utlayBlock.length
            expect(result).toBe(254)
            expect(typeof result).toBe('number')  
        })
    })
    
})


