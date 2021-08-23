import { CommonModule as NgCommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LineChartComponent } from '@src/app/common/charts/line-chart/line-chart.component';

@NgModule({
  imports: [
    NgCommonModule,
  ],
  declarations: [
    LineChartComponent,
  ],
  exports: [
    LineChartComponent,
  ],
})
export class LineChartModule { }
