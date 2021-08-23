import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PpTestAppComponent } from '@app/pp-test-app/pp-test-app.component';

const routes: Routes = [
  {
    path: '',
    component: PpTestAppComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PpTestAppRoutingModule { }
