declare global {
  interface Window {
    monaco?: Monaco;
  }
}

export type Monaco = typeof import('monaco-editor');

export interface Require {
  <T>(deps: string[], callback: (result: T) => void): void;
  config(options: {
    baseUrl: string;
    paths: {
      [key: string]: string;
    };
  }): void;
}
