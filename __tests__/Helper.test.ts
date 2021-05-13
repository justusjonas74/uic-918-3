import { fromBufferWithRemainderOptions, Helper } from "../src/Helper"

describe("Helper class", () => {
    describe("removeLeadingZeroesFromStringNumber function", () => {
        it("should return the input, if the input is no number",() => {
            const input = "hello"
            const result = Helper.removeLeadingZeroesFromStringNumber(input)
            expect(result).toBe(input)
        })
        it("should return the input without leading zeros, if leading zeroes are present",() => {
            const input = "0012"
            const result = Helper.removeLeadingZeroesFromStringNumber(input)
            expect(result).toBe("12")
        })
        it("should return the input, if no leading zeroes are present",() => {
            const input = "1200232"
            const result = Helper.removeLeadingZeroesFromStringNumber(input)
            expect(result).toBe(input)
        })
    })
    describe("slicedRawData()", ()=>{
        it("should slice data with offset to given end", ()=>{
            const buffer = Buffer.from('0123456789', 'hex')
            const fourFive = Buffer.from('45', 'hex')
            // const fromFour = Buffer.from('456789', 'hex')
            const result1 = Helper.slicedRawData(buffer, 2,3)
            expect(result1).toStrictEqual(fourFive)
        })
        it("should slice data with offset to end", ()=>{
            const buffer = Buffer.from('0123456789', 'hex')
            // const fourFive = Buffer.from('45', 'hex')
            const fromFour = Buffer.from('456789', 'hex')
            const result = Helper.slicedRawData(buffer, 2)
            expect(result).toStrictEqual(fromFour)
        })


    })

    describe("slicedRawDataString()", ()=>{
        it("should return a string with the correct value",()=>{        
            const helloHex =  "48656c6c6f"
            const hello = "Hello"
            const offset = "012345" // 3 Bytes
            
            const buffer = Buffer.from( offset+helloHex, 'hex')
            const result = Helper.slicedRawDataString(buffer, 3)
            expect(result).toBe(hello)
        })
        it("should return a string with the correct value with a given end",()=>{        
            const helloHex =  "48656c6c6f"
            const hello = "Hello"
            const offset = "012345" // 3 Bytes
            
            const buffer = Buffer.from( offset+helloHex+offset, 'hex')
            const result = Helper.slicedRawDataString(buffer, 3, 3+5)
            expect(result).toBe(hello)
        })

    })

    describe("slicedRawDataNumber()", ()=>{
        it("should return a number", ()=>{
            const aNumber = 345
            const aNumberAsFourByteAsciiCode= "30333435"
            const buffer = Buffer.from(aNumberAsFourByteAsciiCode, 'hex')
            const result = Helper.slicedRawDataNumber(buffer,0)
            expect(result).toBe(aNumber)
        })
    })

    describe("fromBufferWithRemainder()",()=>{


        it("should return an array of a given type", ()=>{
            const helloHex =  "48656c6c6f"
            const lengthHex = "30303137"
            const container = "010101010101" + "3031" + lengthHex + helloHex // 6 + 2 + 4 + 5 Bytes
            const ticketData = Buffer.from(container+container, 'hex')
    
            const initializer = (buf:Buffer) => {return buf.slice(12, buf.length).toString()}
    
            const opts : fromBufferWithRemainderOptions<string> = {
                buffer:ticketData,
                initializer:initializer
            } 
            const result = Helper.fromBufferWithRemainder(opts)
           
            expect(result).toHaveLength(2)
            expect(result[0]).toBe("Hello")
            expect(result[1]).toStrictEqual(Buffer.from(container, 'hex'))
        })

        
    })
})