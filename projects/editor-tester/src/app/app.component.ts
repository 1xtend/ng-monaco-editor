import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MonacoEditorComponent } from '../../../editor/src/public-api';
import {
  NgEditor,
  NgEditorChangeEvent,
  NgEditorOptions,
} from '../../../editor/src/lib/models/editor.types';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MonacoDiffEditorComponent } from '../../../editor/src/lib/components/monaco-diff-editor.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MonacoEditorComponent,
    MonacoDiffEditorComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  form!: FormGroup;

  diffOptions: NgEditorOptions = {};
  diffOriginalValue: string = 'diff original value';

  options: NgEditorOptions = {
    theme: 'vs-dark',
  };
  uri: string = '///file';

  ngOnInit(): void {
    this.form = new FormGroup({
      editor: new FormControl('editor value', { nonNullable: true }),
      diffEditor: new FormControl('diff editor value', { nonNullable: true }),
    });

    this.form.valueChanges.subscribe((value) => {
      console.log('form value changes: ', value);
    });
  }

  changeOriginalValue(): void {
    this.diffOriginalValue = 'changed value ' + Math.random().toString();
  }

  onLoad(e: NgEditor): void {
    console.log('EDITOR LOADED', e);
  }

  changeTheme(): void {
    if (this.options.theme === 'vs-dark') {
      this.options = {
        ...this.options,
        theme: 'vs-light',
      };
    } else {
      this.options = {
        ...this.options,
        theme: 'vs-dark',
      };
    }

    // this.options = {
    //   ...this.options,
    //   theme: 'vs-dark',
    // };
  }

  changeUri(): void {
    this.uri = '///file-' + Math.random();
  }
}
