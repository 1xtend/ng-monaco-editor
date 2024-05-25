import { InjectionToken } from '@angular/core';

export interface NgMonacoEditorConfig {
  baseUrl?: string;
  defaultOptions?: {
    theme?: 'vs-dark' | 'vs-light';
    [key: string]: any;
  };
  onMonacoLoad?: Function;
  autoLayoutInterval?: number;
}

export const NG_MONACO_EDITOR_CONFIG = new InjectionToken<NgMonacoEditorConfig>(
  'NG_MONACO_EDITOR_CONFIG'
);
