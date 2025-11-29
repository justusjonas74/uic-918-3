import { TicketDataContainer } from './barcode-data.js';
import { DC_LISTE_TYPE, RCT2_BLOCK } from './block-types.js';
import { UFLEXTicket } from './types/UFLEXTicket.js';
import { interpretFieldResult } from './utils.js';

export type SupportedTypes =
  | Date
  | string
  | number
  | Buffer
  | DC_LISTE_TYPE
  | RCT2_BLOCK[]
  | interpretFieldResult
  | TicketDataContainer
  | UFLEXTicket;

export type InterpreterFunctionType<T extends SupportedTypes> = (x: Buffer) => T | Promise<T>;
export type InterpreterArrayFunctionType<T extends SupportedTypes> = (x: Buffer) => T[] | Promise<T[]>;

export interface FieldsType {
  length?: number;
  name: string;
  interpreterFn?: InterpreterFunctionType<SupportedTypes>;
}
