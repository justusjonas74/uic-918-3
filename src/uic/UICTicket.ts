import * as zlib from 'zlib'
import { UICRCT2Block } from './UIC_RCT2Block'

export class UICTicket {

    public static fromBuffer(buffer: Buffer) : UICTicket {
        const slicedBuffer = buffer.slice(64, buffer.length)
        return new UICTicket (slicedBuffer)
    }

    static unzipTicketData (buffer: Buffer) : Buffer | undefined {
        if (!buffer || buffer.length === 0) return undefined
        try {
            return zlib.unzipSync(buffer)
        } catch (err) {
            console.log(`❌ An error occured: Could not decompress ticket data: \n ${err}`)
            return undefined
        }
    }
    

    // TODO Make this more generic and move it to the Helper class 
    public static sliceUncompressedData (buffer: Buffer) : UICRCT2Block[] {
        let remainder : Buffer | undefined = buffer
        let blocks : UICRCT2Block[] = []
        while (remainder) {
            const [rct2Block, newRemainder] = UICRCT2Block.fromBufferWithRemainder(remainder)
            blocks = [...blocks, rct2Block]
            remainder = newRemainder    
        }
        return blocks
    }
    
    static getLengthOfCompressedData (buffer:Buffer):number {
        const slicedBuffer = buffer.slice(0,4)
        return parseInt(slicedBuffer.toString(),10)
    }
  
    constructor (
        private _rawData : Buffer
        ){}

    public get lengthOfCompressedData() : number {
        return UICTicket.getLengthOfCompressedData(this._rawData)
    }
    public get ticketDataCompressed() : Buffer {
        const rawData = this._rawData
        return rawData.slice(4, rawData.length)
    } 
    public get ticketDataUncompressed() : Buffer {
        return UICTicket.unzipTicketData(this.ticketDataCompressed)
    } 

}