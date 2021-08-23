import { CommonModule as NgCommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MissingDemoComponent } from '@src/app/portfolio/missing-demo/missing-demo.component';
// import { MissingDemoModule } from '@common/missing/missing.module';

@NgModule({
  imports: [
    NgCommonModule,
    // MissingDemoModule,
  ],
  declarations: [
    MissingDemoComponent,
  ],
  exports: [
    MissingDemoComponent,
  ],
})
export class MissingDemoModule { }
