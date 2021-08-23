import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PhotoAppDemoComponent } from '@src/app/portfolio/photo-app-demo/photo-app-demo.component';
// import { CoronaModule } from '@src/app/corona/corona.module';
const routes: Routes = [
  {
    path: '',
    component: PhotoAppDemoComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('@src/app/photo-gallery/photo-gallery.module').then(m => m.PhotoGalleryModule)
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
export class PhotoAppDemoRoutingModule { }
