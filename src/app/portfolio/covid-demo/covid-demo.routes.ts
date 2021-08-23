import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CovidDemoComponent } from '@src/app/portfolio/covid-demo/covid-demo.component';
const routes: Routes = [
  {
    path: '',
    component: CovidDemoComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('@src/app/corona/corona.module').then(m => m.CoronaModule)
      },
    ],
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
export class CovidDemoRoutingModule { }
