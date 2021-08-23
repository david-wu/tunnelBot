import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageSourcesComponent } from '@pp/image-sources/image-sources.component';

const routes: Routes = [
  {
    path: '',
    component: ImageSourcesComponent,
    children: [
      {
        path: 'intro',
        loadChildren: () => import('@app/picture-piper/common/image-sources-intro/image-sources-intro.module').then(m => m.ImageSourcesIntroModule)
      },
      {
        path: ':imageSourceId',
        loadChildren: () => import('./image-source-view/image-source-view.module').then(m => m.ImageSourceViewModule)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'intro',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImageSourcesRoutingModule { }
