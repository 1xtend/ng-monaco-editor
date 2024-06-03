import { Component } from '@angular/core';
import { NgEditorOptions } from '../../../editor/src/lib/models/editor.types';
import { MonacoEditorComponent } from '../../../editor/src/public-api';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonacoDiffEditorComponent } from '../../../editor/src/lib/components/monaco-diff-editor.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MonacoEditorComponent,
    MonacoDiffEditorComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  editorOptions: NgEditorOptions = {
    language: 'html',
    theme: 'vs-dark',
  };
  editorValue: string = '<div></div>';

  diffEditorOptions: NgEditorOptions = {
    language: 'typescript',
  };
  diffOriginalValue: string = 'function getValue() {}';
  diffEditorControl = new FormControl('const getValue = () => {}', {
    nonNullable: true,
  });

  changeLanguage(): void {
    if (this.editorOptions.language === 'html') {
      this.editorOptions = {
        ...this.editorOptions,
        language: 'css',
      };
    } else {
      this.editorOptions = {
        ...this.editorOptions,
        language: 'html',
      };
    }
  }
}
