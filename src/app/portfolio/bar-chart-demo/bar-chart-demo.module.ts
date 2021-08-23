import { CommonModule as NgCommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BarChartModule } from '@common/charts/bar-chart/bar-chart.module';
import { CodeSnippetModule } from '@common/code-snippet/code-snippet.module';
import { TooltipModule } from '@common/tooltip/tooltip.module';
import { BarChartDemoComponent } from '@src/app/portfolio/bar-chart-demo/bar-chart-demo.component';

@NgModule({
  imports: [
    NgCommonModule,
    TooltipModule,
    BarChartModule,
    CodeSnippetModule,
  ],
  declarations: [
    BarChartDemoComponent,
  ],
  exports: [
    BarChartDemoComponent,
  ],
})
export class BarChartDemoModule { }
