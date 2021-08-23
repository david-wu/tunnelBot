import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageClassifiersIntroComponent } from '@pp/common/image-classifiers-intro/image-classifiers-intro.component';

const routes: Routes = [
  {
    path: '',
    component: ImageClassifiersIntroComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImageClassifiersIntroRoutingModule { }
