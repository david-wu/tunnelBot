import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BarChartModule } from '@src/app/common/charts/bar-chart/bar-chart.module';
import { ChartLegendComponent } from '@src/app/common/charts/chart-legend/chart-legend.component';
import { LineChartModule } from '@src/app/common/charts/line-chart/line-chart.module';
import { StatViewerComponent } from '@src/app/common/charts/stat-viewer/stat-viewer.component';

@NgModule({
  imports: [
    CommonModule,
    BarChartModule,
    LineChartModule,
  ],
  declarations: [
    ChartLegendComponent,
    StatViewerComponent,
  ],
  exports: [
    BarChartModule,
    LineChartModule,
    ChartLegendComponent,
    StatViewerComponent,
  ],
  providers: [],
})
export class ChartsModule { }

