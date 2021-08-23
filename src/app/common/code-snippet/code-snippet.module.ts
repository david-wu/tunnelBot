import { CommonModule as NgCommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CodeSnippetComponent } from '@src/app/common/code-snippet/code-snippet.component';

@NgModule({
  imports: [
    NgCommonModule,
  ],
  declarations: [
    CodeSnippetComponent,
  ],
  exports: [
    CodeSnippetComponent,
  ],
})
export class CodeSnippetModule { }
