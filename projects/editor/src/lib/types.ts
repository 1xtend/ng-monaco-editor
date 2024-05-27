import type { Uri, editor } from 'monaco-editor';

export interface NgEditorModel {
  value: string;
  language?: string;
  uri?: string;
}

export type Monaco = typeof import('monaco-editor');
export type NgEditorOptions = editor.IStandaloneEditorConstructionOptions;
export type NgEditor = editor.IStandaloneCodeEditor;
export interface NgEditorChangeEvent {
  editor: NgEditor;
  model: editor.IModel;
  value: string;
}

declare global {
  interface Window {
    monaco?: Monaco;
  }
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
