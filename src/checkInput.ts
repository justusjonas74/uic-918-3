import { PathLike, promises } from 'fs';
import { isAbsolute, join } from 'path';

const { readFile } = promises;

const tryToLoadFile = async (filePath: string): Promise<Buffer> => {
  const fullPath = isAbsolute(filePath) ? filePath : join(process.cwd(), filePath);
  return await readFile(fullPath);
};

export const loadFileOrBuffer = async (input: PathLike | Buffer): Promise<Buffer> => {
  const inputIsString = typeof input === 'string';
  const inputIsBuffer = input instanceof Buffer;

  if (!inputIsBuffer && !inputIsString) {
    throw new Error('Error: Input must be a Buffer (Image) or a String (path to image)');
  }

  if (inputIsString) {
    return tryToLoadFile(input);
  }

  return input;
};
