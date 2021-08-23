import { CommonModule as NgCommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BarChartComponent } from '@src/app/common/charts/bar-chart/bar-chart.component';

@NgModule({
  imports: [
    NgCommonModule,
  ],
  declarations: [
    BarChartComponent,
  ],
  exports: [
    BarChartComponent,
  ],
})
export class BarChartModule { }
