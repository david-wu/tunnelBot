import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DEMO_PAGE_COMPONENTS } from '@src/app/portfolio/fuzz-demo/demo-page/index';

@NgModule({
  declarations: [
    ...DEMO_PAGE_COMPONENTS,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
  ],
  exports: [
    ...DEMO_PAGE_COMPONENTS,
  ]
})
export class DemoPageModule { }
