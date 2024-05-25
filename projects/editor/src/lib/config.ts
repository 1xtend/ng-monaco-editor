import { InjectionToken } from '@angular/core';

export interface NgMonacoEditorConfig {
  baseUrl?: string;
  defaultOptions?: { [key: string]: any };
  onMonacoLoad?: Function;
}

export const NG_MONACO_EDITOR_CONFIG = new InjectionToken<NgMonacoEditorConfig>(
  'NG_MONACO_EDITOR_CONFIG'
);
