import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  effect,
  forwardRef,
  input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractEditorBaseComponent } from './abstract-editor-base.component';
import { NgEditor, NgEditorOptions } from '../models/editor.types';
import { editor } from 'monaco-editor';

@Component({
  selector: 'ng-monaco-diff-editor',
  template: `<div style="height: 300px;" #editorEl></div>`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MonacoDiffEditorComponent),
      multi: true,
    },
  ],
})
export class MonacoDiffEditorComponent extends AbstractEditorBaseComponent {
  originalValue = input<string>('');

  protected _originalModel?: editor.ITextModel;

  protected createEditor(
    el: HTMLElement,
    options?: NgEditorOptions,
    uri?: string
  ): NgEditor {
    this._originalModel = this.createModel(this.originalValue());
    this._model = this.createModel(this.value, uri);

    const editor = this.monacoEditorService.createDiffEditor(el, options);

    this._rootEditor = editor;

    editor.setModel({
      original: this._originalModel,
      modified: this._model,
    });

    return editor.getModifiedEditor();
  }

  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);

    const { originalValue } = changes;

    if (
      originalValue &&
      !originalValue.isFirstChange() &&
      originalValue.previousValue !== originalValue.currentValue
    ) {
      this.loadEditor();
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this._originalModel?.dispose();
    this._originalModel = undefined;
  }
}
