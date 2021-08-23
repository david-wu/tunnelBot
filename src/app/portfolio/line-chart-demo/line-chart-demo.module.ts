import { CommonModule as NgCommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LineChartModule } from '@common/charts/line-chart/line-chart.module';
import { CodeSnippetModule } from '@common/code-snippet/code-snippet.module';
import { TooltipModule } from '@common/tooltip/tooltip.module';
import { LineChartDemoComponent } from '@src/app/portfolio/line-chart-demo/line-chart-demo.component';

@NgModule({
  imports: [
    NgCommonModule,
    TooltipModule,
    LineChartModule,
    CodeSnippetModule,
  ],
  declarations: [
    LineChartDemoComponent,
  ],
  exports: [
    LineChartDemoComponent,
  ],
})
export class LineChartDemoModule { }
