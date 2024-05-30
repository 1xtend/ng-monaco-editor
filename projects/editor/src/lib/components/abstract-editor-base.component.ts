import {
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  OnInit,
  SimpleChanges,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import {
  NgEditor,
  NgEditorChangeEvent,
  NgEditorModel,
  NgEditorOptions,
} from '../models/editor.types';
import { IDisposable, editor } from 'monaco-editor';
import { MonacoEditorService } from '../services/monaco-editor.service';
import { observeResize } from '../helpers/observe-resize';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { NG_MONACO_EDITOR_CONFIG, NgMonacoEditorConfig } from '../config';
import { Monaco } from '../models/global.types';

declare const monaco: Monaco;

@Component({
  template: '',
})
export abstract class AbstractEditorBaseComponent
  implements OnDestroy, ControlValueAccessor, OnInit
{
  private destroyRef = inject(DestroyRef);
  protected monacoEditorService = inject(MonacoEditorService);
  private config: NgMonacoEditorConfig = inject(NG_MONACO_EDITOR_CONFIG);

  protected editorRef = viewChild<ElementRef<HTMLElement>>('editorEl');

  protected _editor?: NgEditor;
  protected _value: string = '';
  protected _model?: NgEditorModel;
  protected _options?: NgEditorOptions;
  protected _uri?: string;
  protected _disposables: IDisposable[] = [];
  protected _isMonacoLoaded: boolean = false;
  protected _rootEditor?: editor.IEditor;

  options = input<NgEditorOptions>();
  uri = input<string>('');

  loading = output<boolean>();
  editorLoad = output<NgEditor>();
  editorChange = output<NgEditorChangeEvent>();
  editorBlur = output<void>();

  get value() {
    return this._value;
  }

  get rootEditor() {
    return this._rootEditor || this._editor;
  }

  protected abstract createEditor(
    el: HTMLElement,
    options?: NgEditorOptions,
    uri?: string
  ): NgEditor;

  ngOnInit(): void {
    this._options = this.options();
    this._uri = this.uri();

    this.loadEditor();
  }

  ngOnChanges({ options, uri }: SimpleChanges): void {
    if (uri && !uri.isFirstChange()) {
      this._uri = uri.currentValue;
      this.loadEditor();
    }

    if (
      options &&
      !options.isFirstChange() &&
      !this.isEqual(options.previousValue, options.currentValue)
    ) {
      this._options = options.currentValue as NgEditorOptions;
      this.rootEditor?.updateOptions(this._options);
    }
  }

  ngOnDestroy(): void {
    this.dispose();
  }

  private async loadMonaco(): Promise<void> {
    this.loading.emit(true);

    return this.monacoEditorService.initMonaco().then(() => {
      this.loading.emit(false);
    });
  }

  protected async loadEditor(): Promise<void> {
    if (this._isMonacoLoaded) {
      this.dispose();
    } else {
      await this.loadMonaco();
      this._isMonacoLoaded = true;
    }

    const editor = this.editorRef()?.nativeElement;

    if (!editor) return;

    this._editor = this.createEditor(editor, this._options, this._uri);
    this.resizeEditor(editor);
    this.listenToModelChanges();
    this.editorLoad.emit(this._editor);
  }

  protected createModel(value: string, uri?: string) {
    const parsedUri = uri ? monaco.Uri.parse(uri) : undefined;
    const model = parsedUri && monaco.editor.getModel(parsedUri);
    model?.dispose();
    return monaco.editor.createModel(value, this._options?.language, parsedUri);
  }

  protected resizeEditor(editor: HTMLElement): void {
    const interval = this.config.autoLayoutInterval || 100;

    observeResize(editor)
      .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(interval))
      .subscribe(() => {
        this.rootEditor?.layout();
      });
  }

  protected listenToModelChanges(): void {
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

  protected dispose(): void {
    this.rootEditor?.dispose();
    this._rootEditor = this._editor = undefined;

    this._model?.dispose();
    this._model = undefined;

    this._disposables.forEach((disposable) => disposable.dispose());
    this._disposables = [];
  }

  onTouched = () => {};

  onChange = (value: string) => {};

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(value: string): void {
    this._value = value || '';

    if (this._editor) {
      this._model!.setValue(value);
    }
  }

  protected isEqual(item1: unknown, item2: unknown): boolean {
    return JSON.stringify(item1) === JSON.stringify(item2);
  }
}
