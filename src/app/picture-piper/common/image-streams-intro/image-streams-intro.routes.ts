import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageStreamsIntroComponent } from '@pp/common/image-streams-intro/image-streams-intro.component';

const routes: Routes = [
  {
    path: '',
    component: ImageStreamsIntroComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImageStreamsIntroRoutingModule { }
