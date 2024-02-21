import { ZXing } from './barcode-reader';
import interpretBarcode, { ParsedUIC918Barcode } from './barcode-data';
import { loadFileOrBuffer } from './checkInput';

import { verifyTicket as verifySignature, TicketSignatureVerficationStatus } from './check_signature';

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
  const ticket = interpretBarcode(barcodeData);
  if (opts.verifySignature) {
    const validityOfSignature = await verifySignature(ticket);
    ticket.validityOfSignature = validityOfSignature;
    if (validityOfSignature === TicketSignatureVerficationStatus.VALID) {
      ticket.isSignatureValid = true;
    } else if (validityOfSignature === TicketSignatureVerficationStatus.INVALID) {
      ticket.isSignatureValid = false;
    }
  }
  return ticket;
};

export { default as interpretBarcode } from './barcode-data';
