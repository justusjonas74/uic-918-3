import { FieldsType, SupportedTypes } from './FieldsType.js';

export type interpretFieldResult = { [index: string]: SupportedTypes };

export function interpretField(data: Buffer, fields: FieldsType[]): interpretFieldResult {
  let remainder = data;
  const res: interpretFieldResult = {};
  fields.forEach((field) => {
    const { name, interpreterFn, length } = field;
    const interpreterFnDefault = (x: Buffer): Buffer => x;
    const interpretFunction = interpreterFn || interpreterFnDefault;

    if (length) {
      res[name] = interpretFunction(remainder.subarray(0, length));
      remainder = remainder.subarray(length);
    } else {
      res[name] = interpretFunction(remainder);
    }
  });
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
