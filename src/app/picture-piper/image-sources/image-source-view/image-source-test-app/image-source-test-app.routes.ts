import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageSourceTestAppComponent } from '@pp/image-sources/image-source-view/image-source-test-app/image-source-test-app.component';

const routes: Routes = [
  {
    path: '',
    component: ImageSourceTestAppComponent,
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
export class ImageSourceTestAppRoutingModule { }
