export type SupportedTypes = Date | string | number | Buffer // TODO: Stupid Solution

export type interpreterFunctionType = (x: Buffer) => SupportedTypes;


export interface FieldsType {
  length?: number;
  name: string;
  interpreterFn?: interpreterFunctionType
}
