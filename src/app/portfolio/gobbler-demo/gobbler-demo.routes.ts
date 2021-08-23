import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GobblerDemoComponent } from '@src/app/portfolio/gobbler-demo/gobbler-demo.component';
// import { CoronaModule } from '@src/app/corona/corona.module';
const routes: Routes = [
  {
    path: '',
    component: GobblerDemoComponent,
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
export class GobblerDemoRoutingModule { }
