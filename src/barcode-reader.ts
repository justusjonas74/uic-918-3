import { ReaderOptions, readBarcodesFromImageFile } from 'zxing-wasm';
const defaultOptions: ReaderOptions = {
  tryHarder: true,
  formats: ['Aztec']
};

export async function ZXing(data: string | Buffer, options: ReaderOptions = defaultOptions): Promise<Buffer> {
  const [barcodeResult] = await readBarcodesFromImageFile(new Blob([data]), options);
  if (!barcodeResult || !barcodeResult.isValid || !barcodeResult.bytes) {
    throw new Error('Could not detect a valid Aztec barcode');
  }
  return Buffer.from(barcodeResult.bytes);
}
