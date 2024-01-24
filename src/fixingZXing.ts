
import * as iconv from "iconv-lite"

const fixingZXing = (buffer:Buffer) => {
  // FIX: https://github.com/ashtuchkin/iconv-lite/wiki/Use-Buffers-when-decoding
  // WORKAROUND:

  // 2024-01-24: Commented out the next to lines of code. Node sure if it will break the tests
  // TODO: Check if this works...
  // iconv.skipDecodeWarning = true 
  // const latin1str = iconv.decode(buffer.toString('utf-8'), 'ISO-8859-1')
  const latin1str = iconv.decode(Buffer.from(buffer.toString('utf-8')), 'ISO-8859-1')
  return Buffer.from(latin1str, 'latin1')
}

export default fixingZXing