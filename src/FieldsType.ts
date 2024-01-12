export type SupportedTypes = Date | string | number | Buffer // TODO: Stupid Solution

export type InterpreterFunctionType<T extends SupportedTypes> = (x: Buffer) => T;


export interface FieldsType<T extends SupportedTypes> {
  length?: number;
  name: string;
  interpreterFn?: InterpreterFunctionType<T>
}
