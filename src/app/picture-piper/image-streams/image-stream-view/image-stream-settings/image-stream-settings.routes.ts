import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageStreamSettingsComponent } from '@pp/image-streams/image-stream-view/image-stream-settings/image-stream-settings.component';

const routes: Routes = [
  {
    path: '',
    component: ImageStreamSettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImageStreamSettingsRoutingModule { }
