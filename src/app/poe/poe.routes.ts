import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoeComponent } from '@src/app/poe/poe.component';

const routes: Routes = [
  {
    path: '',
    component: PoeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoeRoutingModule { }
