import { ZXing } from './barcode-reader';
import interpretBarcode, { ParsedUIC918Barcode } from './barcode-data';
import { loadFileOrBuffer } from './checkInput';

type ReadBarcodeOptions = {
  verifySignature?: boolean;
};

export const readBarcode = async function (
  input: string | Buffer,
  options?: ReadBarcodeOptions
): Promise<ParsedUIC918Barcode> {
  const defaults = {
    verifySignature: false
  };
  const opts: ReadBarcodeOptions = Object.assign({}, defaults, options);

  const imageBuffer = await loadFileOrBuffer(input);
  const barcodeData = await ZXing(imageBuffer);
  const ticket = await interpretBarcode(barcodeData, opts.verifySignature);
  return ticket;
};

export { default as interpretBarcode } from './barcode-data';
