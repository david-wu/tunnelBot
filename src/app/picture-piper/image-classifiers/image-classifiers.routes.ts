import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageClassifiersComponent } from '@pp/image-classifiers/image-classifiers.component';

const routes: Routes = [
  {
    path: '',
    component: ImageClassifiersComponent,
    children: [
      {
        path: 'intro',
        loadChildren: () => import('@app/picture-piper/common/image-classifiers-intro/image-classifiers-intro.module').then(m => m.ImageClassifiersIntroModule),
      },
      {
        path: ':imageClassifierId',
        loadChildren: () => import('./image-classifier-view/image-classifier-view.module').then(m => m.ImageClassifierViewModule)
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
export class ImageClassifiersRoutingModule { }
