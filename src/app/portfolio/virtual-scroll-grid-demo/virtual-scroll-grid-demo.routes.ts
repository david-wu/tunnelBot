import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VirtualScrollGridDemoComponent } from '@src/app/portfolio/virtual-scroll-grid-demo/virtual-scroll-grid-demo.component';

const routes: Routes = [
  {
    path: '',
    component: VirtualScrollGridDemoComponent,
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
export class VirtualScrollGridDemoRoutingModule { }
