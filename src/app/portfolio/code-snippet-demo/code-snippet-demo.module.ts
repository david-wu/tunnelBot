import { CommonModule as NgCommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CodeSnippetModule } from '@common/code-snippet/code-snippet.module';
import { CodeSnippetDemoComponent } from '@src/app/portfolio/code-snippet-demo/code-snippet-demo.component';

@NgModule({
  imports: [
    NgCommonModule,
    CodeSnippetModule,
  ],
  declarations: [
    CodeSnippetDemoComponent,
  ],
  exports: [
    CodeSnippetDemoComponent,
  ],
})
export class CodeSnippetDemoModule { }
