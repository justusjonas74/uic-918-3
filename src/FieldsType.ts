import { DC_LISTE_TYPE, RCT2_BLOCK } from "./block-types";
import { interpretFieldResult } from "./utils";

export type SupportedTypes = Date | string | number | Buffer | DC_LISTE_TYPE | RCT2_BLOCK | interpretFieldResult// TODO: Stupid Solution

export type InterpreterFunctionType<T extends SupportedTypes> = (x: Buffer) => T;

export interface FieldsType {
  length?: number;
  name: string;
  interpreterFn?: InterpreterFunctionType<SupportedTypes>
}
