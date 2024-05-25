import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MonacoEditorComponent } from '../../../editor/src/public-api';
import { NgEditorModel, NgEditorOptions } from '../../../editor/src/lib/types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MonacoEditorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'editor-tester';

  options: NgEditorOptions = {
    value: '.css { color: red }',
    language: 'typescript',
    theme: 'vs-dark',
  };

  showSecond = signal<boolean>(false);

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
}
