import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageStreamSetUpComponent } from '@pp/image-streams/image-stream-view/image-stream-set-up/image-stream-set-up.component';

const routes: Routes = [
  {
    path: '',
    component: ImageStreamSetUpComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('@app/pp-test-app/pp-test-app.module').then(m => m.PpTestAppModule)
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImageStreamSetUpRoutingModule { }
