import { PrintableString } from "../simpleTypes/PrintableString"

export class UICHeader {

    public static fromBuffer(data:Buffer) : UICHeader{
        const uniqueMessageTypeID = new PrintableString(data.slice(0, 3), "uniqueMessageTypeID")
        const messageTypeVersion = new PrintableString(data.slice(3, 5), "messageTypeVersion")
        const ricsCode = new PrintableString(data.slice(5, 9), "ricsCode")
        const idSignatureKey = new PrintableString(data.slice(9, 14), "idSignatureKey")
        return new UICHeader(uniqueMessageTypeID, messageTypeVersion, ricsCode, idSignatureKey)
    }
    constructor(
        public uniqueMessageTypeID: PrintableString,
        public messageTypeVersion: PrintableString,
        public ricsCode: PrintableString,
        public idSignatureKey: PrintableString,
    ){}
}