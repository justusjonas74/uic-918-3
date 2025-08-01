import { TicketDataContainer } from './barcode-data.js';
import { DC_LISTE_TYPE, RCT2_BLOCK } from './block-types.js';
import { interpretFieldResult } from './utils.js';

export type SupportedTypes =
  | Date
  | string
  | number
  | Buffer
  | DC_LISTE_TYPE
  | RCT2_BLOCK[]
  | interpretFieldResult
  | TicketDataContainer;

export type InterpreterFunctionType<T extends SupportedTypes> = (x: Buffer) => T;
export type InterpreterArrayFunctionType<T extends SupportedTypes> = (x: Buffer) => T[];

export interface FieldsType {
  length?: number;
  name: string;
  interpreterFn?: InterpreterFunctionType<SupportedTypes>;
}
