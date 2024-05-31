import { ApplicationConfig } from '@angular/core';
import {
  NG_MONACO_EDITOR_CONFIG,
  NgMonacoEditorConfig,
} from '../../../editor/src/lib/config';
import { Monaco } from '../../../editor/src/lib/models/global.types';

declare const monaco: Monaco;

const config: NgMonacoEditorConfig = {
  /**
   * Optional.
   *
   * Base URL to monaco-editor assets via AMD.
   */
  // baseUrl: '/lib/assets',

  /**
   * Optional.
   *
   * Provide editor default options.
   */
  defaultOptions: {
    theme: 'vs-dark',
    fontSize: 20,
  },

  /**
   * Optional.
   *
   * This function is called when monaco is loadedю
   */
  onMonacoLoad: () => {
    /**
     * Нou can use it to set various settings.
     */
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSyntaxValidation: true,
      noSemanticValidation: true,
    });

    console.log('monaco has been loaded successfully!');
  },

  /**
   * Optional.
   *
   * The interval for auto re-layout. Defaul value is 100ms.
   */
  autoLayoutInterval: 500,
};

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: NG_MONACO_EDITOR_CONFIG,
      useValue: config,
    },
  ],
};
