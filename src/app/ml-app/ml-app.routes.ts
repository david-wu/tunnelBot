import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MlAppComponent } from '@src/app/ml-app/ml-app.component';

const routes: Routes = [
  {
    path: '',
    component: MlAppComponent,
  },
  // {
  //   path: ':any',
  //   component: MlAppComponent,
  // },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MlAppRoutingModule { }
