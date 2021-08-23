import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageStreamClassifiersComponent } from '@pp/image-streams/image-stream-view/image-stream-classifiers/image-stream-classifiers.component';

const routes: Routes = [
  {
    path: '',
    component: ImageStreamClassifiersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImageStreamClassifiersRoutingModule { }
