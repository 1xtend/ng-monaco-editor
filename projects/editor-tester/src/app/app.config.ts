import { ApplicationConfig } from '@angular/core';
import {
  NG_MONACO_EDITOR_CONFIG,
  NgMonacoEditorConfig,
} from '../../../editor/src/lib/config';

const config: NgMonacoEditorConfig = {
  defaultOptions: {
    // theme: 'vs-dark',
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: NG_MONACO_EDITOR_CONFIG,
      useValue: config,
    },
  ],
};
