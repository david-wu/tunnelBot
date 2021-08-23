import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PicturePiperDemoComponent } from '@src/app/portfolio/picture-piper-demo/picture-piper-demo.component';
// import { CoronaModule } from '@src/app/corona/corona.module';
const routes: Routes = [
  {
    path: '',
    component: PicturePiperDemoComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('@src/app/picture-piper/picture-piper.module').then(m => m.PicturePiperModule)
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
export class PicturePiperDemoRoutingModule { }
