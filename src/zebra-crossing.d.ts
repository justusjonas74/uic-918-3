type BarcodeFormats = 'AZTEC' | 'CODABAR' | 'CODE_39' | 'CODE_93' | 'CODE_128' | 'DATA_MATRIX' | 'EAN_8' | 'EAN_13' | 'ITF' | 'MAXICODE' | 'PDF_417' | 'QR_CODE' | 'RSS_14' | 'RSS_EXPANDED' | 'UPC_A' | 'UPC_E' | 'UPC_EAN_EXTENSION'

interface ReadingOptions {
    tryHarder?: boolean
    pureBarcode?: boolean
    productsOnly?: boolean
    multi?: boolean
    crop?: { left: number, top: number, width: number, height: number },
    possibleFormats?: BarcodeFormats,
}

// TODO: object type is not recommend
type ZebraCrossingReturnType = {
    raw: Buffer,
    parsed: Buffer
    format: BarcodeFormats,
    type: string,
    points: [number, number][],

}

declare module 'zebra-crossing' {
    function read(file: string | Buffer, options: ReadingOptions): Promise<ZebraCrossingReturnType>
}