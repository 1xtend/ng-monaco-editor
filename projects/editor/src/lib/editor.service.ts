import { Injectable, inject } from '@angular/core';
import { Monaco, NgEditor, NgEditorOptions, Require } from './types';
import { NG_MONACO_EDITOR_CONFIG, NgMonacoEditorConfig } from './config';

@Injectable({
  providedIn: 'root',
})
export class EditorService {
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

        console.log(`Setup require config`);
        resolve();
      });
      loaderScript.addEventListener('error', reject);
      document.body.append(loaderScript);
    });
  }

  async loadMonaco(): Promise<Monaco> {
    await this.getAmdLoader(this.config.baseUrl || '/assets');
    return this.loadMonacoModule(['vs/editor/editor.main']).then((monaco) => {
      this._monaco = monaco;

      if (typeof this.config.onMonacoLoad === 'function') {
        this.config.onMonacoLoad();
      }

      return monaco;
    });
  }

  create(el: HTMLElement, options?: NgEditorOptions): NgEditor {
    return this.monaco.editor.create(el, this.getOptions(options));
  }

  getOptions(options?: NgEditorOptions): NgEditorOptions {
    return {
      ...this.config.defaultOptions,
      ...options,
    };
  }

  // async initMonaco() {
  //   return this._loadedMonaco || (this._loadedMonaco = this.loadMonaco());
  // }

  // configAmdLoader(baseUrl: string) {
  //   return new Promise<void>((resolve, reject) => {
  //     if (this.monaco && this.require) {
  //       return resolve();
  //     }

  // const loaderScript = document.createElement('script');
  // loaderScript.type = 'text/javascript';
  // loaderScript.src = `${baseUrl}/monaco-editor/min/vs/loader.js`;
  // loaderScript.addEventListener('load', () => {
  //   this.require!.config({
  //     baseUrl,
  //     paths: { vs: 'monaco-editor/min/vs' },
  //   });
  //   resolve();
  // });
  // loaderScript.addEventListener('error', reject);
  // document.body.append(loaderScript);
  //   });
  // }

  // loadMonacoModule(): Promise<Monaco> {
  //   return new Promise<Monaco>((resolve) => {
  //     this.require!(['vs/editor/editor.main'], (monaco: Monaco) => {
  //       this._monaco = monaco;
  //     });
  //   });
  // }

  // async loadMonaco(): Promise<Monaco> {
  //   await this.configAmdLoader(this.config.baseUrl || './assets');

  //   return this.loadMonacoModule();
  // }

  // create(el: HTMLElement, options?: NgEditorOptions) {
  //   this.checkMonaco();

  //   return this.monaco.editor.create(el, this.getOptions(options));
  // }

  // private checkMonaco() {
  //   if (!this.monaco) {
  //     throw new Error(`'monaco' has not been initialized`);
  //   }
  // }

  // private getOptions(options?: NgEditorOptions): NgEditorOptions {
  //   return {
  //     ...this.config.defaultOptions,
  //     ...options,
  //   };
  // }

  // getAmdLoader(baseUrl: string) {
  //   return new Promise<void>((resolve) => {
  //     if (this.monaco && this.require) {
  //       return resolve();
  //     }

  //     const loaderScript = document.createElement('script');
  //     loaderScript.type = 'text/javascript';
  //     loaderScript.src = `${baseUrl}/monaco-editor/min/vs/loader.js`;
  //     loaderScript.addEventListener('load', () => {
  //       this.require?.config({
  //         baseUrl: baseUrl,
  //         paths: {
  //           vs: 'monaco-editor/min/vs',
  //         },
  //       });
  //       resolve();
  //     });
  //     document.body.appendChild(loaderScript);
  //   });
  // }

  // async loadMonaco() {
  //   await this.getAmdLoader(this.config.baseUrl || './assets');
  //   this.require!(['vs/editor/editor.main'], (monaco) => {});

  //   return new Promise<void>((resolve) => {
  //     this.require!(['vs/editor/editor.main'], (monaco: Monaco) => {
  //       this._monaco = monaco;
  //       resolve();
  //     });
  //   });
  // }
}
