import type { editor } from 'monaco-editor';

declare global {
  interface Window {
    monaco?: Monaco;
  }
}

export type Monaco = typeof import('monaco-editor');
export type NgEditor = editor.IStandaloneCodeEditor;
export type NgEditorOptions = editor.IStandaloneEditorConstructionOptions;
export interface NgEditorChangeEvent {
  editor: NgEditor;
  model: editor.IModel;
  value: string;
}

export interface Require {
  <T>(deps: string[], callback: (result: T) => void): void;
  config(options: {
    baseUrl: string;
    paths: {
      [key: string]: string;
    };
  }): void;
}
