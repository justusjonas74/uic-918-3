import { DBDateTime } from "../../src/simpleTypes/DBDateTime"

describe("DBDateTime class",()=>{
    it("should have return a date sting as value",()=>{
        const dateBuf = Buffer.from("323530323230323130393331", "hex")
        const result = new DBDateTime(dateBuf)
        expect(result.value).toBe("Thu Feb 25 2021 09:31:00 GMT+0100 (Central European Standard Time)")
    })
})