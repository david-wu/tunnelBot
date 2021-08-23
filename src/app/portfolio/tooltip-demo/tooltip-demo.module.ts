import { CommonModule as NgCommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TooltipModule } from '@common/tooltip/tooltip.module';
import { TooltipDemoComponent } from '@src/app/portfolio/tooltip-demo/tooltip-demo.component';

@NgModule({
  imports: [
    NgCommonModule,
    TooltipModule,
  ],
  declarations: [
    TooltipDemoComponent,
  ],
  exports: [
    TooltipDemoComponent,
  ],
})
export class TooltipDemoModule { }
