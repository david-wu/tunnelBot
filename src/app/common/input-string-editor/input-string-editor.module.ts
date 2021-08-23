import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { InputStringEditorComponent } from '@src/app/common/input-string-editor/input-string-editor.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    InputStringEditorComponent,
  ],
  exports: [
    InputStringEditorComponent,
  ],
  providers: [],
})
export class InputStringEditorModule { }

