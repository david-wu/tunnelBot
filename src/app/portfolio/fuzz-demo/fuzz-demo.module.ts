import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CodeSnippetModule } from '@common/code-snippet/code-snippet.module';
import { DemoPageModule } from '@src/app/portfolio/fuzz-demo/demo-page/demo-page.module';
import { FuzzDemoComponent } from '@src/app/portfolio/fuzz-demo/fuzz-demo.component';

@NgModule({
  declarations: [
    FuzzDemoComponent,
  ],
  imports: [
    CodeSnippetModule,
    DemoPageModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
  ],
  exports: [
    FuzzDemoComponent,
  ]
})
export class FuzzDemoModule { }
