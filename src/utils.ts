import { FieldsType, SupportedTypes } from './FieldsType.js';

export type interpretFieldResult = { [index: string]: SupportedTypes };

export async function interpretField(data: Buffer, fields: FieldsType[]): Promise<interpretFieldResult> {
  let remainder = data;
  const res: interpretFieldResult = {};
  for (const field of fields) {
    const { name, interpreterFn, length } = field;
    const interpreterFnDefault = (x: Buffer): Buffer => x;
    const interpretFunction = interpreterFn || interpreterFnDefault;

    if (length) {
      const result = interpretFunction(remainder.subarray(0, length));
      res[name] = result instanceof Promise ? await result : result;
      remainder = remainder.subarray(length);
    } else {
      const result = interpretFunction(remainder);
      res[name] = result instanceof Promise ? await result : result;
    }
  }
  return res;
}

// f is a function which returns an array with a interpreted value from data and the remaining data as the second item
export type parsingFunction = (data: Buffer) => [SupportedTypes, Buffer?];
export function parseContainers(data: Buffer, f: parsingFunction): SupportedTypes[] {
  // f is a function which returns an array with a interpreted value from data and the remaining data as the second item
  let remainder = data;
  const containers = [];
  while (remainder.length > 0) {
    const result = f(remainder);
    containers.push(result[0]);
    remainder = result[1];
  }
  return containers;
}

export function pad(number: number | string, length: number): string {
  let str = '' + number;
  while (str.length < length) {
    str = '0' + str;
  }
  return str;
}

export function handleError(error: Error): void {
  console.log(error);
}
