import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ng-diff-editor',
  template: `<div style="height: 300px;" #editorEl></div>`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonacoDiffEditorComponent {}
