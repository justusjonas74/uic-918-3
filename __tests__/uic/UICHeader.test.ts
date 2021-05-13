import { UICHeader } from '../../src/uic/UICHeader'
import * as testData from '../testData.json'
const  fullTicket = Buffer.from(testData.fullTicket1, 'hex')

describe("UICHeader class", ()=>{
    const testHeader = UICHeader.fromBuffer(fullTicket)

     it("should have a public property 'uniqueMessageTypeID'", ()=>{
        expect(testHeader.uniqueMessageTypeID.hex).toBe(testData.uniqueMessageTypeID.hex)
        expect(testHeader.uniqueMessageTypeID.value).toBe(testData.uniqueMessageTypeID.value)
    })
     it("should have a public property 'messageTypeVersion'", ()=>{
        expect(testHeader.messageTypeVersion.hex).toBe(testData.messageTypeVersion.hex)
        expect(testHeader.messageTypeVersion.value).toBe(testData.messageTypeVersion.value)
     })
     it("should have a public property 'ricsCode'", ()=>{
        expect(testHeader.ricsCode.hex).toBe(testData.ricsCode.hex)
        expect(testHeader.ricsCode.value).toBe(testData.ricsCode.value)
     })
     it("should have a public property 'idSignatureKey'", ()=>{
        expect(testHeader.idSignatureKey.hex).toBe(testData.idSignatureKey.hex)
        expect(testHeader.idSignatureKey.value).toBe(testData.idSignatureKey.value)
     })
})