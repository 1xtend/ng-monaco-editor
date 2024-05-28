import { MonacoEditorService } from '../services/monaco-editor.service';
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
  NgEditor,
  NgEditorChangeEvent,
  NgEditorOptions,
} from '../models/editor.types';
import { debounce, debounceTime, delay } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { observeResize } from '../helpers/observe-resize';
import { NG_MONACO_EDITOR_CONFIG, NgMonacoEditorConfig } from '../config';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IDisposable, editor } from 'monaco-editor';
import { Monaco } from '../models/global.types';
import { AbstractEditorBaseComponent } from './abstract-editor-base.component';

declare const monaco: Monaco;

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
