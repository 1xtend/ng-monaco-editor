import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  InputSignal,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Signal,
  SimpleChanges,
  computed,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { Monaco, NgEditor, NgEditorModel, NgEditorOptions } from './types';
import { EditorService } from './editor.service';

declare const monaco: Monaco;

@Component({
  selector: 'ngx-monaco-editor',
  standalone: true,
  imports: [],
  template: ` <div style="height: 300px;" #editorEl></div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonacoEditorComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
  private editorService = inject(EditorService);

  private editorRef = viewChild<ElementRef<HTMLElement>>('editorEl');

  private _editor?: NgEditor;

  options = input<NgEditorOptions>();
  model = input<NgEditorModel>();

  constructor() {
    effect(() => {
      console.log('opt changed', this.options());

      const options = this.options();

      if (this._editor) {
        this._editor.dispose();
        this.createEditor();
      }
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.loadMonaco();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    if (this._editor) {
      this._editor.dispose();
      this._editor = undefined;
    }
  }

  private loadMonaco() {
    this.editorService.initMonaco().then(() => {
      console.log('monaco', monaco);
      this.createEditor();
    });
  }

  private createEditor() {
    const editor = this.editorRef()?.nativeElement;

    if (editor) {
      this._editor = this.editorService.create(editor, this.options());
    }
  }

  // private loadMonaco(): void {
  //   if ((<any>window).monaco) {
  //     this.initEditor(this.editorOptions());
  //   } else {
  //     const onGotAmdLoader = () => {
  //       if ((<any>window).monaco) {
  //         this.initEditor(this.editorOptions());
  //       } else {
  //         // Create path to vs folder
  //         (<any>window).require.config({
  //           paths: { vs: '/assets/monaco-editor/min/vs' },
  //         });
  //         // Import editor.main file
  //         (<any>window).require(['vs/editor/editor.main'], () => {
  //           this.initEditor(this.editorOptions());
  //         });
  //       }
  //     };

  //     if (!(<any>window).require) {
  //       const scriptEl = document.createElement('script');
  //       scriptEl.type = 'text/javascript';
  //       scriptEl.src = './assets/monaco-editor/min/vs/loader.js';
  //       scriptEl.addEventListener('load', onGotAmdLoader);
  //       document.body.appendChild(scriptEl);
  //     } else {
  //       onGotAmdLoader();
  //     }
  //   }
  // }

  // private initEditor(options: any): void {
  //   const editorEl = this.editorRef()?.nativeElement;

  //   if (editorEl) {
  //     this._editor = this.monaco.editor.create(editorEl, options);
  //   }
  // }

  // options: InputSignal<any> = input();
  // model: InputSignal<NgxEditorModel | undefined> = input();

  // private editorRef = viewChild<ElementRef<HTMLElement>>('editorEl');
  // private editorConfig: NgxMonacoEditorConfig = inject(
  //   NGX_MONACO_EDITOR_CONFIG
  // );
  // private _editor: any;

  // constructor() {}

  // ngOnInit(): void {}

  // ngAfterViewInit(): void {
  //   this.loadMonaco();
  // }

  // ngOnDestroy(): void {
  //   if (this._editor) {
  //     this._editor.dispose();
  //   }
  // }

  // private loadMonaco(): void {
  //   // If library is loaded init editor
  //   if ((<any>window).monaco) {
  //     this.initMonaco();
  //   } else {
  //     const baseUrl = this.editorConfig.baseUrl || './assets';

  //     // If monaco is not loaded -- load
  //     const onGotAmdLoader = () => {
  //       if ((<any>window).monaco) {
  //         console.log('Monaco exists');
  //         this.initMonaco();
  //       } else {
  //         // Configure path to monaco-editor
  //         (<any>window).require.config({
  //           paths: { vs: baseUrl + '/monaco-editor/min/vs' },
  //         });
  //         // Load main file and then init monaco-editor
  //         (<any>window).require(['vs/editor/editor.main'], () => {
  //           if (typeof this.editorConfig.onMonacoLoad === 'function') {
  //             this.editorConfig.onMonacoLoad();
  //           }

  //           this.initMonaco();
  //         });
  //       }
  //     };

  //     // Load require if it's not loaded yet
  //     if (!(<any>window).require) {
  //       const loaderScript = document.createElement('script');
  //       loaderScript.type = 'text/javascript';
  //       loaderScript.src = baseUrl + '/monaco-editor/min/vs/loader.js';
  //       loaderScript.addEventListener('load', onGotAmdLoader);
  //       document.body.appendChild(loaderScript);
  //     } else {
  //       onGotAmdLoader();
  //     }
  //   }
  // }

  // private initMonaco(): void {
  //   const editor = this.editorRef()?.nativeElement;

  //   if (editor) {
  //     this._editor = monaco.editor.create(editor, {
  //       ...this.options(),
  //       model: this.model() || monaco.editor.createModel('', 'javascript'),
  //     });
  //   }
  // }
}
