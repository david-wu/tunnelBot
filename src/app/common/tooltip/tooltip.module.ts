import { CommonModule as NgCommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TooltipViewComponent } from '@src/app/common/tooltip/tooltip-view.component';
import { TooltipComponent } from '@src/app/common/tooltip/tooltip.component';
import { TooltipService } from '@src/app/common/tooltip/tooltip.service';

@NgModule({
  imports: [
    NgCommonModule,
  ],
  entryComponents: [ TooltipViewComponent ],
  declarations: [
    TooltipComponent,
    TooltipViewComponent,
  ],
  exports: [
    TooltipComponent,
    TooltipViewComponent,
  ],
  providers: [
    TooltipService,
  ],
})
export class TooltipModule { }
