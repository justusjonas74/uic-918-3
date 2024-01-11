//TODO: No declaration for this package...
import {read as readBarcode} from 'zebra-crossing'

// TODO: Types are defined twice in src\zebra-crossing.d.ts. Should be defined once.
type BarcodeFormats  = 'AZTEC' |'CODABAR' |'CODE_39' |'CODE_93' |'CODE_128' |'DATA_MATRIX' |'EAN_8' |'EAN_13' |'ITF' |'MAXICODE' |'PDF_417' |'QR_CODE' |'RSS_14' |'RSS_EXPANDED' |'UPC_A' |'UPC_E' |'UPC_EAN_EXTENSION'

interface ReadingOptions {
  tryHarder?: boolean
  pureBarcode?: boolean
  productsOnly?: boolean
  multi?: boolean
  crop?: { left: number, top: number, width: number, height: number },
  possibleFormats?: BarcodeFormats,
}

const defaultOptions : ReadingOptions = {
  pureBarcode: true,
  tryHarder: true
}

export function ZXing (data: string|Buffer, options:ReadingOptions = defaultOptions) {
  return readBarcode(data, options)
}
