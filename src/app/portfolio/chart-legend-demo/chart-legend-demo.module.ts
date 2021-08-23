import { CommonModule as NgCommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ChartsModule } from '@common/charts/charts.module';
import { LineChartModule } from '@common/charts/line-chart/line-chart.module';
import { CodeSnippetModule } from '@common/code-snippet/code-snippet.module';
import { TooltipModule } from '@common/tooltip/tooltip.module';
import { ChartLegendDemoComponent } from '@src/app/portfolio/chart-legend-demo/chart-legend-demo.component';

@NgModule({
  imports: [
    NgCommonModule,
    TooltipModule,
    LineChartModule,
    CodeSnippetModule,
    ChartsModule,
  ],
  declarations: [
    ChartLegendDemoComponent,
  ],
  exports: [
    ChartLegendDemoComponent,
  ],
})
export class ChartLegendDemoModule { }
