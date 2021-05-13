import axios, { AxiosResponse } from "axios"
import * as xml2js from "xml2js"
import * as fs from 'fs';
import {UICHeader} from './UICHeader'
import { Helper } from "../Helper";



export class UICPublicKeys {
    private static keysRemoteUrl = "https://railpublickey.uic.org/download.php"
    private static keysJsonFileName = "../../keys.json"

    // private localKeys : IUICPublicKeys = localKeys // TO DO 

    static async fetchKeysFromUrl(options:UICPublicKeysOptions = {}) : Promise<IUICPublicKeys> {
        const parser = new xml2js.Parser({explicitArray:false})
        const url = options.url || UICPublicKeys.keysRemoteUrl
        // Fetch keys as xml
        const keysXML : AxiosResponse<string> = await axios.get(url)
        // Parse XML
        const keys : IUICPublicKeys = await parser.parseStringPromise(keysXML.data )
        // const keys = this.parseKeysFromXML(keysXML.data)
        return keys
    }

    public static async fetchKeysToFile(options:UICPublicKeysOptions = {}) : Promise<void> {
        const filePath = options.fileName || UICPublicKeys.keysJsonFileName
            const data = await this.fetchKeysFromUrl(options)
            await fs.promises.writeFile(filePath, JSON.stringify(data))
    }

    public static async init(options : UICPublicKeysOptions = {}) : Promise<UICPublicKeys> {
        const url = options.url || UICPublicKeys.keysRemoteUrl
        try {
            const keys = await UICPublicKeys.fetchKeysFromUrl(options)
            return Promise.resolve(new UICPublicKeys(keys))
        } catch (error) {
            console.log(`❌ Failed to load public keys from "${url}"`)
            console.log(`ℹ️ ${error.message}`)
            // console.log(error);
            throw new Error(error.message);
        }
    }

    public getCertificateByHeader(ticketHeader: UICHeader ):UICPublicKey{
        const ricsCodeRawValue = ticketHeader.ricsCode.value
        const idSignatureKeyRawValue = ticketHeader.idSignatureKey.value
        
        // Remove leading zeros
        const ricsCode = Helper.removeLeadingZeroesFromStringNumber(ricsCodeRawValue)
        const id = Helper.removeLeadingZeroesFromStringNumber(idSignatureKeyRawValue)

        return this.poolKeys.keys.key.find((key) => {return (key.id === id && key.issuerCode === ricsCode )})
    }

    constructor(
        private poolKeys: IUICPublicKeys
        ){}
}

type UICPublicKeysOptions = {
        url?:string
        fileName?:string
}

export interface IUICPublicKeys {
    keys: Keys;
}

interface Keys {
    key: UICPublicKey[];
}

export interface UICPublicKey {
    issuerName:               string;
    issuerCode:               string;
    versionType:              string;
    signatureAlgorithm:       string;
    id:                       string;
    publicKey:                string;
    barcodeVersion:           string;
    startDate:                Date;
    endDate:                  Date;
    barcodeXsd:               string;
    allowedProductOwnerCodes: AllowedProductOwnerCodesClass | string;
    keyForged:                string;
    commentForEncryptionType: CommentForEncryptionType;
}

interface AllowedProductOwnerCodesClass {
    productOwnerCode: string[];
    productOwnerName: string[];
}

enum CommentForEncryptionType {
    Empty = "",
    PublicKeyPem = "public_key.pem",
    SNCFNSGates16050CERTPem = "SNCF-NSGates-16050CERT.pem",
    SNCFTER2CERTPem = "SNCF-TER-2-CERT.pem",
}