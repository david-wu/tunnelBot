import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoronaComponent } from '@src/app/corona/corona.component';

export const routes: Routes = [
  {
    path: '',
    component: CoronaComponent,
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
export class CoronaRoutingModule { }
