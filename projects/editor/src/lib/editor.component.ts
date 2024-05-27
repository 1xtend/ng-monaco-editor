import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  OnDestroy,
  effect,
  forwardRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import {
  Monaco,
  NgEditor,
  NgEditorChangeEvent,
  NgEditorOptions,
} from './types';
import { EditorService } from './editor.service';
import { delay } from 'rxjs';
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
export class MonacoEditorComponent implements AfterViewInit, OnDestroy {
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
  editorLoad = output<NgEditor>();
  editorChange = output<NgEditorChangeEvent>();
  editorBlur = output<void>();

  get value() {
    return this._value;
  }

  onTouched = () => {};

  onChange = (value: string) => {};

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

  ngAfterViewInit(): void {
    this.loadMonaco();
  }

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

    if (!editor) return;

    this._model = this.createModel(this.value, options?.language, uri);
    this._editor = this.editorService.create(editor, {
      ...options,
      model: this._model,
    });
    this.resizeEditor(editor);
    this.listenToModelChanges();
    this.editorLoad.emit(this._editor);
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
        this.editorChange.emit({
          editor: editor,
          model: model,
          value,
        });
        this._value = value;
      }),
      editor.onDidBlurEditorWidget(() => {
        this.editorBlur.emit();
        this.onTouched();
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

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
