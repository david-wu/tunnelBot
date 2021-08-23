import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageSourceImagesViewComponent } from '@pp/image-sources/image-source-view/image-source-images-view/image-source-images-view.component';

const routes: Routes = [
  {
    path: '',
    component: ImageSourceImagesViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImageSourceImagesViewRoutingModule { }
