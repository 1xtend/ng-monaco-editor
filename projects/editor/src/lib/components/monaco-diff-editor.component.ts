import {
  ChangeDetectionStrategy,
  Component,
  effect,
  forwardRef,
  input,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractEditorBaseComponent } from './abstract-editor-base.component';
import { NgEditor, NgEditorOptions } from '../models/editor.types';
import { editor } from 'monaco-editor';

@Component({
  selector: 'ng-monaco-diff-editor',
  template: `
    <div class="ng-monaco-editor-wrapper ng-monaco-diff-editor" #editorEl></div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MonacoDiffEditorComponent),
      multi: true,
    },
  ],
  styles: [
    `
      :host {
        display: block;
        height: 300px;
      }

      .ng-monaco-editor-wrapper {
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class MonacoDiffEditorComponent extends AbstractEditorBaseComponent {
  originalValue = input.required<string>();

  private _originalModel?: editor.ITextModel;

  constructor() {
    super();

    effect(() => {
      const options = this._options();
      const uri = this.uri();
      const originalValue = this.originalValue();

      this.loadEditor(options, uri, originalValue);
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this._originalModel?.dispose();
    this._originalModel = undefined;
  }

  protected createEditor(
    el: HTMLElement,
    options?: NgEditorOptions,
    uri?: string,
    originalValue?: string
  ): NgEditor {
    if (!originalValue) {
      throw new Error('Diff editor requires originalValue');
    }

    this._originalModel = this.createModel(originalValue);
    this._model = this.createModel(this.value, uri);

    const editor = this.monacoEditorService.createDiffEditor(el, options);

    this._rootEditor = editor;

    editor.setModel({
      original: this._originalModel,
      modified: this._model,
    });

    return editor.getModifiedEditor();
  }
}
