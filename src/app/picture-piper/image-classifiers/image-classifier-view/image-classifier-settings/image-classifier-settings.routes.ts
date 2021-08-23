import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageClassifierSettingsComponent } from '@pp/image-classifiers/image-classifier-view/image-classifier-settings/image-classifier-settings.component';

const routes: Routes = [
  {
    path: '',
    component: ImageClassifierSettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImageClassifierSettingsRoutingModule { }
