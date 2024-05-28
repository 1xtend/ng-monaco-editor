import { Injectable, inject } from '@angular/core';
import {
  NgDiffEditor,
  NgEditor,
  NgEditorOptions,
} from '../models/editor.types';
import { NG_MONACO_EDITOR_CONFIG, NgMonacoEditorConfig } from '../config';
import { Monaco, Require } from '../models/global.types';

@Injectable({
  providedIn: 'root',
})
export class MonacoEditorService {
  private config: NgMonacoEditorConfig = inject(NG_MONACO_EDITOR_CONFIG);

  private _monaco?: Monaco;
  private _loadedMonaco?: Promise<Monaco>;

  get monaco(): Monaco {
    return (this._monaco || window.monaco)!;
  }

  get require(): Require | undefined {
    return (<any>window).require as Require;
  }

  initMonaco(): Promise<Monaco> {
    return this._loadedMonaco || (this._loadedMonaco = this.loadMonaco());
  }

  private loadMonacoModule(deps: string[]) {
    return new Promise<Monaco>((resolve) => this.require!(deps, resolve));
  }

  private getAmdLoader(baseUrl: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.monaco && this.require) {
        return resolve();
      }

      const loaderScript = document.createElement('script');
      loaderScript.type = 'text/javascript';
      loaderScript.src = `${baseUrl}/monaco-editor/min/vs/loader.js`;
      loaderScript.addEventListener('load', () => {
        this.require?.config({
          baseUrl,
          paths: { vs: `${baseUrl}/monaco-editor/min/vs` },
        });

        resolve();
      });
      loaderScript.addEventListener('error', reject);
      document.body.append(loaderScript);
    }).catch((error) => {
      throw new ReferenceError(
        `Check if you have imported 'monaco-editor' into ${baseUrl} folder.`
      );
    });
  }

  private async loadMonaco(): Promise<Monaco> {
    await this.getAmdLoader(this.config.baseUrl || '/assets');
    return this.loadMonacoModule(['vs/editor/editor.main']).then((monaco) => {
      this._monaco = monaco;

      if (typeof this.config.onMonacoLoad === 'function') {
        this.config.onMonacoLoad();
      }

      return monaco;
    });
  }

  createEditor(el: HTMLElement, options?: NgEditorOptions): NgEditor {
    this.assertMonaco();

    return this.monaco.editor.create(el, this.getOptions(options));
  }

  createDiffEditor(el: HTMLElement, options?: NgEditorOptions): NgDiffEditor {
    this.assertMonaco();

    return this.monaco.editor.createDiffEditor(el, this.getOptions(options));
  }

  getOptions(options?: NgEditorOptions): NgEditorOptions {
    return {
      ...this.config.defaultOptions,
      ...options,
    };
  }

  private assertMonaco(): void {
    if (!this.monaco) {
      throw new Error(`'monaco' has not been found on window.`);
    }

    if (!this.require) {
      throw new Error(`'require' has not been found on window`);
    }
  }
}
