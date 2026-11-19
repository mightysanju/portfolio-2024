declare module 'node:fs' {
  export function existsSync(path: string): boolean;
  const fsDefault: {
    existsSync: (path: string) => boolean;
  };
  export default fsDefault;
}

declare module 'node:os' {
  export function homedir(): string;
  const osDefault: {
    homedir: () => string;
  };
  export default osDefault;
}

declare module 'node:path' {
  export function join(...paths: string[]): string;
  const pathDefault: {
    join: (...paths: string[]) => string;
  };
  export default pathDefault;
}

declare const process: {
  env: Record<string, string | undefined>;
};

interface Buffer extends Uint8Array {
  toString(encoding?: string): string;
}

declare const Buffer: {
  from(input: string, encoding?: string): Buffer;
  from(input: Uint8Array | readonly number[]): Buffer;
  isBuffer(value: unknown): value is Buffer;
};
