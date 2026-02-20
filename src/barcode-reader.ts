import { ReaderOptions, readBarcodes } from 'zxing-wasm/reader';
const defaultOptions: ReaderOptions = {
  tryHarder: true,
  formats: ['Aztec']
};

export async function ZXing(data: string | Buffer, options: ReaderOptions = defaultOptions): Promise<Buffer> {
  const blobData = typeof data === 'string' ? data : new Uint8Array(data);
  const [barcodeResult] = await readBarcodes(new Blob([blobData]), options);
  if (!barcodeResult || !barcodeResult.isValid || !barcodeResult.bytes) {
    throw new Error('Could not detect a valid Aztec barcode');
  }
  return Buffer.from(barcodeResult.bytes);
}
