import { ReaderOptions, readBarcodesFromImageFile } from 'zxing-wasm';
const defaultOptions: ReaderOptions = {
  // isPure: true,
  tryHarder: true
};

export async function ZXing(data: string | Buffer, options: ReaderOptions = defaultOptions): Promise<Buffer> {
  const [barcodeResult] = await readBarcodesFromImageFile(new Blob([data]), options);
  return Buffer.from(barcodeResult.bytes);
}
