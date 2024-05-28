import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { NgEditor, NgEditorOptions } from '../models/editor.types';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Monaco } from '../models/global.types';
import { AbstractEditorBaseComponent } from './abstract-editor-base.component';

@Component({
  selector: 'ng-monaco-editor',
  standalone: true,
  template: `<div style="height: 300px;" #editorEl></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MonacoEditorComponent),
      multi: true,
    },
  ],
})
export class MonacoEditorComponent extends AbstractEditorBaseComponent {
  protected createEditor(
    el: HTMLElement,
    options?: NgEditorOptions,
    uri?: string
  ): NgEditor {
    this._model = this.createModel(this.value, uri);
    return this.monacoEditorService.createEditor(el, {
      ...options,
      model: this._model,
    });
  }
}
