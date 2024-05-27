import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
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
  forwardRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { Monaco, NgEditor, NgEditorModel, NgEditorOptions } from './types';
import { EditorService } from './editor.service';
import { delay, fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { observeResize } from './helpers/observe-resize';
import { NG_MONACO_EDITOR_CONFIG, NgMonacoEditorConfig } from './config';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { IDisposable, Uri, editor } from 'monaco-editor';

declare const monaco: Monaco;

@Component({
  selector: 'ngx-monaco-editor',
  standalone: true,
  imports: [],
  template: ` <div style="height: 300px;" #editorEl></div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MonacoEditorComponent),
      multi: true,
    },
  ],
})
export class MonacoEditorComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
  private editorService = inject(EditorService);
  private zone = inject(NgZone);
  private destroyRef = inject(DestroyRef);
  private config: NgMonacoEditorConfig = inject(NG_MONACO_EDITOR_CONFIG);

  private editorRef = viewChild<ElementRef<HTMLElement>>('editorEl');

  private _editor?: NgEditor;
  private _value: string = '';
  private _model?: editor.IModel;
  private _disposables: IDisposable[] = [];

  options = input<NgEditorOptions>();
  uri = input<string>('');

  loading = output<boolean>();
  editorChange = output<NgEditor>();

  get value() {
    return this._value;
  }

  constructor() {
    effect(() => {
      const options = this.options();
      const uri = this.uri();

      if (this._editor) {
        this._editor.dispose();
        this.loadEditor(options, uri);
      }
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.loadMonaco();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.dispose();
  }

  setDisabledState(disabled: boolean): void {
    // this.disabled = disabled;
  }

  private loadMonaco(): void {
    this.loading.emit(true);

    this.editorService.initMonaco().then(() => {
      const options = this.options();
      const uri = this.uri();

      this.loadEditor(options, uri);

      this.loading.emit(false);
    });
  }

  private loadEditor(options?: NgEditorOptions, uri?: string): void {
    const editor = this.editorRef()?.nativeElement;

    this._model = this.createModel(this.value, options?.language, uri);

    if (editor) {
      this._editor = this.editorService.create(editor, {
        ...options,
        model: this._model,
      });
      this.resizeEditor(editor);
      this.listenToModelChanges();
      this.editorChange.emit(this._editor);
    }
  }

  private createModel(value: string, language?: string, uri?: string) {
    const parsedUri = uri ? monaco.Uri.parse(uri) : undefined;
    const model = parsedUri && monaco.editor.getModel(parsedUri);
    model?.dispose();
    return monaco.editor.createModel(value, language, parsedUri);
  }

  private resizeEditor(editor: HTMLElement): void {
    const interval = this.config.autoLayoutInterval || 100;

    observeResize(editor)
      .pipe(takeUntilDestroyed(this.destroyRef), delay(interval))
      .subscribe(() => {
        this._editor?.layout();
      });
  }

  private listenToModelChanges(): void {
    const editor = this._editor!;
    const model = this._model!;

    this._disposables = [
      model.onDidChangeContent(() => {
        const value = model.getValue();

        if (this._value === value) {
          return;
        }

        this.onChange(value);
        this._value = value;
      }),
    ];
  }

  private dispose(): void {
    this._editor?.dispose();
    this._editor = undefined;

    this._model?.dispose();
    this._model = undefined;

    this._disposables.forEach((disposable) => disposable.dispose());
    this._disposables = [];
  }

  // Control value accessor
  writeValue(value: string): void {
    this._value = value || '';

    if (this._editor) {
      this._model!.setValue(value);
    }
  }

  onTouched = () => {};

  onChange = (value: string) => {};

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
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
