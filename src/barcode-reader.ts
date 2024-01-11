//TODO: No declaration for this package...
import {read as readBarcode} from 'zebra-crossing'


const defaultOptions : ReadingOptions = {
  pureBarcode: true,
  tryHarder: true
}

export function ZXing (data: string|Buffer, options:ReadingOptions = defaultOptions) {
  return readBarcode(data, options)
}
