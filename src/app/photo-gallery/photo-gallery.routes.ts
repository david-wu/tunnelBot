import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhotoGalleryComponent } from '@src/app/photo-gallery/photo-gallery.component';

const routes: Routes = [
  {
    path: '',
    component: PhotoGalleryComponent,
    children: [
      {
        path: 'near-me',
        loadChildren: () => import('./near-me/near-me.module').then(m => m.NearMeModule),
      },
      {
        path: 'my-uploads',
        loadChildren: () => import('./my-uploads/my-uploads.module').then(m => m.MyUploadsModule),
      },
      {
        path: '',
        redirectTo: 'near-me',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhotoGalleryRoutingModule { }
