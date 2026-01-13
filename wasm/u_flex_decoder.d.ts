type EmscriptenCwrap = (
  ident: string,
  returnType: string | null,
  argTypes: string[]
) => ((...args: number[]) => number) | ((...args: number[]) => void);

type UFlexModule = {
  cwrap: EmscriptenCwrap;
  lengthBytesUTF8: (value: string) => number;
  stringToUTF8: (value: string, ptr: number, maxBytesToWrite: number) => void;
  UTF8ToString: (ptr: number) => string;
  _malloc: (size: number) => number;
  _free: (ptr: number) => void;
};

type ModuleOptions = {
  locateFile?: (path: string, scriptDirectory?: string) => string;
  [key: string]: unknown;
};

declare const factory: (opts?: ModuleOptions) => Promise<UFlexModule>;

export default factory;

