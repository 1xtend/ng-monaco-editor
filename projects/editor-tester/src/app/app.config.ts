import { ApplicationConfig } from '@angular/core';
import {
  NG_MONACO_EDITOR_CONFIG,
  NgMonacoEditorConfig,
} from '../../../editor/src/lib/config';
import { Monaco } from '../../../editor/src/lib/models/types';

declare const monaco: Monaco;

const config: NgMonacoEditorConfig = {
  defaultOptions: {
    theme: 'vs-dark',
  },
  onMonacoLoad: () => {
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });

    console.log('onMonacoLoad was called');
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
