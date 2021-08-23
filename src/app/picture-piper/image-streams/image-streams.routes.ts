import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageStreamsComponent } from '@pp/image-streams/image-streams.component';

const routes: Routes = [
  {
    path: '',
    component: ImageStreamsComponent,
    children: [
      {
        path: 'intro',
        loadChildren: () => import('@app/picture-piper/common/image-streams-intro/image-streams-intro.module').then(m => m.ImageStreamsIntroModule),
      },
      {
        path: ':imageStreamId',
        loadChildren: () => import('./image-stream-view/image-stream-view.module').then(m => m.ImageStreamViewModule)
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
export class ImageStreamsRoutingModule { }
