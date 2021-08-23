import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioComponent } from '@src/app/portfolio/portfolio.component';
// import { DemoPageWrapperComponent } from 'fuzz-demo-app';

import { BackyardPatioComponent } from '@src/app/portfolio/backyard-patio/backyard-patio.component';
import { BarChartDemoComponent } from '@src/app/portfolio/bar-chart-demo/bar-chart-demo.component';
import { ChartLegendDemoComponent } from '@src/app/portfolio/chart-legend-demo/chart-legend-demo.component';
import { CodeSnippetDemoComponent } from '@src/app/portfolio/code-snippet-demo/code-snippet-demo.component';
import { FileExplorerDemoComponent } from '@src/app/portfolio/file-explorer-demo/file-explorer-demo.component';
import { FuzzDemoComponent } from '@src/app/portfolio/fuzz-demo/fuzz-demo.component';
import { LineChartDemoComponent } from '@src/app/portfolio/line-chart-demo/line-chart-demo.component';
import { MissingDemoComponent } from '@src/app/portfolio/missing-demo/missing-demo.component';
import { TooltipDemoComponent } from '@src/app/portfolio/tooltip-demo/tooltip-demo.component';
// console.log('DemoPageWrapperComponent', DemoPageWrapperComponent)

const routes: Routes = [
  {
    path: '',
    component: PortfolioComponent,
    children: [
      {
        path: 'COVID_DEMO',
        loadChildren: () => import('./covid-demo/covid-demo.module').then(m => m.CovidDemoModule)
      },
      {
        path: 'BACKYARD_PATIO',
        component: BackyardPatioComponent,
      },
      {
        path: 'PHOTO_APP',
        loadChildren: () => import('./photo-app-demo/photo-app-demo.module').then(m => m.PhotoAppDemoModule),
      },
      {
        path: 'GOBBLER',
        loadChildren: () => import('./gobbler-demo/gobbler-demo.module').then(m => m.GobblerDemoModule)
      },
      {
        path: 'PICTURE_PIPER',
        loadChildren: () => import('./picture-piper-demo/picture-piper-demo.module').then(m => m.PicturePiperDemoModule)
      },
      {
        path: 'ML_APP',
        loadChildren: () => import('../ml-app/ml-app.module').then(m => m.MlAppModule)
      },
      {
        path: 'FUZZ',
        component: FuzzDemoComponent,
      },
      {
        path: 'BAR_CHART',
        component: BarChartDemoComponent,
      },
      {
        path: 'LINE_CHART',
        component: LineChartDemoComponent,
      },
      {
        path: 'CHART_LEGEND',
        component: ChartLegendDemoComponent,
      },
      {
        path: 'TOOLTIP',
        component: TooltipDemoComponent,
      },
      {
        path: 'CODE_SNIPPET',
        component: CodeSnippetDemoComponent,
      },
      {
        path: 'FILE_EXPLORER',
        component: FileExplorerDemoComponent,
      },
      {
        path: 'VIRTUAL_SCROLL_GRID',
        loadChildren: () => import('./virtual-scroll-grid-demo/virtual-scroll-grid-demo.module').then(m => m.VirtualScrollGridDemoModule)
      },
      {
        path: ':tab',
        pathMatch: 'full',
        component: MissingDemoComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'COVID_DEMO',
      },
    ]
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioRoutingModule { }
