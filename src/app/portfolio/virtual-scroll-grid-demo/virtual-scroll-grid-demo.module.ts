import { CommonModule as NgCommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// import { LineChartModule } from '@common/charts/line-chart/line-chart.module';
import { CodeSnippetModule } from '@common/code-snippet/code-snippet.module';
import { TooltipModule } from '@common/tooltip/tooltip.module';
import { VirtualScrollGridModule } from '@common/virtual-scroll-grid/virtual-scroll-grid.module';
import { VirtualScrollGridDemoComponent } from '@src/app/portfolio/virtual-scroll-grid-demo/virtual-scroll-grid-demo.component';
import { VirtualScrollGridDemoRoutingModule } from '@src/app/portfolio/virtual-scroll-grid-demo/virtual-scroll-grid-demo.routes';

@NgModule({
  imports: [
    NgCommonModule,
    VirtualScrollGridModule,
    TooltipModule,
    VirtualScrollGridDemoRoutingModule,
    FormsModule,
    CodeSnippetModule,
  ],
  declarations: [
    VirtualScrollGridDemoComponent,
  ],
  exports: [
    VirtualScrollGridDemoComponent,
  ],
})
export class VirtualScrollGridDemoModule { }
