import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageClassifierViewComponent } from '@pp/image-classifiers/image-classifier-view/image-classifier-view.component';

const routes: Routes = [
  {
    path: '',
    component: ImageClassifierViewComponent,
    children: [
      {
        path: 'overview',
        loadChildren: () => import('./image-classifier-overview/image-classifier-overview.module').then(m => m.ImageClassifierOverviewModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./image-classifier-settings/image-classifier-settings.module').then(m => m.ImageClassifierSettingsModule)
      },
      // {
      //   path: 'images',
      //   loadChildren: () => import('./image-classifier-images-view/image-classifier-images-view.module').then(m => m.ImageClassifierImagesViewModule)
      // },
      // {
      //   path: 'setup',
      //   loadChildren: () => import('./image-classifier-setup/image-classifier-setup.module').then(m => m.ImageClassifierSetupModule)
      // },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImageClassifierViewRoutingModule { }
