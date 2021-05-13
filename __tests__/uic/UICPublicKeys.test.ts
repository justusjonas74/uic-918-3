// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs").promises;

// import { result } from "lodash";
import { UICHeader } from "../../src/uic/UICHeader";
import { UICPublicKeys } from "../../src/uic/UICPublicKeys"
import * as testData from '../testData.json'
const  fullTicket1 = Buffer.from(testData.fullTicket1, 'hex')
const  fullTicket2 = Buffer.from(testData.fullTicket2, 'hex')
const testHeader1 = UICHeader.fromBuffer(fullTicket1)
const testHeader2 = UICHeader.fromBuffer(fullTicket2)
describe("UICPublicKeys class", () => {
    describe("init() method", ()=>{
        it("should return an instance of UICPublicKeys", ()=>{
            const keys =  UICPublicKeys.init()
            return expect(keys).resolves.toBeInstanceOf(UICPublicKeys)
        })
        it("should throw an error if public keys couldn't be fetched", async ()=>{
            beforeEach(() => {
                consoleSpy.mockClear()
            })
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
            const keys = UICPublicKeys.init({url: "kpokpokpo"})
            await expect(keys).rejects.toThrow();
            expect(console.log).toBeCalledTimes(2) 
            consoleSpy.mockRestore();

        })
    })
    
    describe("static method fetchKeysFromUrl", () => {
        it("should be fullfilled with no arguments", () => {
            return expect(UICPublicKeys.fetchKeysFromUrl()).resolves.toHaveProperty('keys');
        })
        it("should be rejeceted, if url option isn't  valid url", ()=>{
            return expect(UICPublicKeys.fetchKeysFromUrl({url:"lknln"})).rejects.toThrow();
        })
        it("should return a value which has all required properties", async ()=>{ 
            const {keys}  = await UICPublicKeys.fetchKeysFromUrl()
            const firstKey = keys.key[0]
            expect(firstKey).toHaveProperty("issuerName")
            expect(firstKey).toHaveProperty("issuerCode")
            expect(firstKey).toHaveProperty("versionType")
            expect(firstKey).toHaveProperty("signatureAlgorithm")
            expect(firstKey).toHaveProperty("id")
            expect(firstKey).toHaveProperty("publicKey")
            expect(firstKey).toHaveProperty("barcodeVersion")
            expect(firstKey).toHaveProperty("startDate")
            expect(firstKey).toHaveProperty("endDate")
            expect(firstKey).toHaveProperty("barcodeXsd")
            expect(firstKey).toHaveProperty("allowedProductOwnerCodes")
            expect(firstKey).toHaveProperty("keyForged")
            expect(firstKey).toHaveProperty("commentForEncryptionType")
        })
    })
    describe("fetchKeysToFile() method", ()=>{
        it("should write data to a file", async ()=>{
            const writeFileSpy = jest.spyOn(fs, "writeFile");
            await UICPublicKeys.fetchKeysToFile()
            expect(writeFileSpy).toHaveBeenCalledTimes(1);
            writeFileSpy.mockClear();
        })
        it("should not write data to a file, if url is wrong", async ()=>{
            const writeFileSpy = jest.spyOn(fs, "writeFile");
            const result = UICPublicKeys.fetchKeysToFile({ url: "123htdlkn" })
            await expect(result).rejects.toThrow()
            expect(writeFileSpy).not.toHaveBeenCalled()
            writeFileSpy.mockClear();
        })
    })
    describe("getCertificateByHeader() method", ()=>{

        it("should return undefined if the key isn't available", async ()=>{
            const publicKeys = await UICPublicKeys.init({url: "https://railpublickey.uic.org/download.php"})
            expect(publicKeys.getCertificateByHeader(testHeader1)).toBeUndefined()
        })
        it("should return a key, if the key is available", async ()=>{
            const publicKeys = await UICPublicKeys.init({url: "https://railpublickey.uic.org/download.php"})
            expect(publicKeys.getCertificateByHeader(testHeader2)).toHaveProperty("issuerCode", "1080")

        })
     
    })
})