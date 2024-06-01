import { InjectionToken } from '@angular/core';
import { NgEditorOptions } from './models/editor.types';

export interface NgMonacoEditorConfig {
  baseUrl?: string;
  defaultOptions?: NgEditorOptions;
  onMonacoLoad?: Function;
  autoLayoutInterval?: number;
}

export const NG_MONACO_EDITOR_CONFIG = new InjectionToken<NgMonacoEditorConfig>(
  'NG_MONACO_EDITOR_CONFIG'
);
