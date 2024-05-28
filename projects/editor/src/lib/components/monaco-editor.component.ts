import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { NgEditor, NgEditorOptions } from '../models/editor.types';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractEditorBaseComponent } from './abstract-editor-base.component';

@Component({
  selector: 'ng-monaco-editor',
  standalone: true,
  template: `<div
    class="ng-monaco-editor-wrapper ng-monaco-editor"
    #editorEl
  ></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MonacoEditorComponent),
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
