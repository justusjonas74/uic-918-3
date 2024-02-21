import { ZXing } from './barcode-reader';
import interpretBarcode, { ParsedUIC918Barcode } from './barcode-data';
import { loadFileOrBuffer } from './checkInput';

import { verifyTicket as verifySignature } from './check_signature';

const readZxing = (filePath: string | Buffer): Promise<Buffer> => ZXing(filePath);
const interpretBarcodeFn = (res: Buffer): Promise<ParsedUIC918Barcode> => {
  return Promise.resolve(interpretBarcode(res));
};

const checkSignature = async function (
  ticket: ParsedUIC918Barcode,
  verifyTicket?: boolean
): Promise<ParsedUIC918Barcode> {
  if (verifyTicket) {
    const isValid = await verifySignature(ticket);
    ticket.isSignatureValid = isValid;
  }
  return ticket;
};

type ReadBarcodeOptions = {
  verifySignature?: boolean;
};

export const readBarcode = function (
  input: string | Buffer,
  options?: ReadBarcodeOptions
): Promise<ParsedUIC918Barcode> {
  const defaults = {
    verifySignature: false
  };
  const opts: ReadBarcodeOptions = Object.assign({}, defaults, options);

  return new Promise<ParsedUIC918Barcode>((resolve, reject) => {
    // fileWillExists(filePath)
    loadFileOrBuffer(input)
      .then(readZxing)
      .then(interpretBarcodeFn)
      .then((ticket) => checkSignature(ticket, opts.verifySignature))
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

export { default as interpretBarcode } from './barcode-data';
