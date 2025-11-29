type EmscriptenCwrap = (ident: string, returnType: string | null, argTypes: string[]) => (...args: number[]) => number;

type UFlexModule = {
  cwrap: EmscriptenCwrap;
  lengthBytesUTF8: (value: string) => number;
  stringToUTF8: (value: string, ptr: number, maxBytesToWrite: number) => void;
  UTF8ToString: (ptr: number) => string;
  _malloc: (size: number) => number;
  _free: (ptr: number) => void;
};

declare const factory: (opts?: Record<string, unknown>) => Promise<UFlexModule>;

export default factory;

