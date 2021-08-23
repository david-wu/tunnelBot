import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageClassifierOverviewComponent } from '@pp/image-classifiers/image-classifier-view/image-classifier-overview/image-classifier-overview.component';

const routes: Routes = [
  {
    path: '',
    component: ImageClassifierOverviewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImageClassifierOverviewRoutingModule { }
