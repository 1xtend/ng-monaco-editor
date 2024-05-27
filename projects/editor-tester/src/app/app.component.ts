import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MonacoEditorComponent } from '../../../editor/src/public-api';
import {
  NgEditor,
  NgEditorChangeEvent,
  NgEditorModel,
  NgEditorOptions,
} from '../../../editor/src/lib/types';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MonacoEditorComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'editor-tester';

  options: NgEditorOptions = {
    theme: 'vs-dark',
  };

  uri: string = '';

  disabled: boolean = false;

  showSecond = signal<boolean>(false);

  form!: FormGroup;

  value: string = '.css { gap: 10px; }';

  options1: NgEditorOptions = {
    theme: 'vs-light',
    value: '.car {gap: 1px;}',
    language: 'css',
  };

  onChange(e: NgEditorChangeEvent): void {
    console.log(e);
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      editor: new FormControl('value', { nonNullable: true }),
    });

    this.form.valueChanges.subscribe((value) => {
      console.log('form value changes: ', value);
    });
  }

  changeLanguage(): void {
    if (this.options.language === 'css') {
      this.options = {
        ...this.options,
        language: 'html',
      };
    } else {
      this.options = {
        ...this.options,
        language: 'css',
      };
    }
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
  }

  disable() {
    this.disabled = !this.disabled;
  }
}
