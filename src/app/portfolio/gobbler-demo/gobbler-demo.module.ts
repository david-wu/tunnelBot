import { CommonModule as NgCommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// import { GobblerModule } from '@common/charts/bar-chart/bar-chart.module';
import { CodeSnippetModule } from '@common/code-snippet/code-snippet.module';
import { TooltipModule } from '@common/tooltip/tooltip.module';
import { GobblerDemoComponent } from '@src/app/portfolio/gobbler-demo/gobbler-demo.component';
import { GobblerDemoRoutingModule } from '@src/app/portfolio/gobbler-demo/gobbler-demo.routes';
import { GobblerModule } from '@src/app/portfolio/gobbler-demo/gobbler/gobbler.module';

@NgModule({
  imports: [
    NgCommonModule,
    TooltipModule,
    GobblerDemoRoutingModule,
    CodeSnippetModule,
    GobblerModule,
  ],
  declarations: [
    GobblerDemoComponent,
  ],
  exports: [
    GobblerDemoComponent,
  ],
})
export class GobblerDemoModule { }
