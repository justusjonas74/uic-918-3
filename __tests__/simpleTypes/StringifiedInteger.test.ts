import { StringifiedInteger } from "../../src/simpleTypes/StringifiedInteger"

describe("StringifiedInteger class", ()=>{
    it("should return a number as a string",()=>{
        const buf = Buffer.from("30303132",'hex')
        const result = new StringifiedInteger(buf)
        expect(result.value).toBe("12")
        expect(result).toHaveProperty("typeName", "Stringified Integer")
    })
})