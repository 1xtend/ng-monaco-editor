import type { editor } from 'monaco-editor';

export type NgEditor = editor.IStandaloneCodeEditor;
export type NgEditorOptions = editor.IStandaloneEditorConstructionOptions;
export interface NgEditorChangeEvent {
  editor: NgEditor;
  model: editor.IModel;
  value: string;
}
