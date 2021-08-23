import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageSourceSetupComponent } from '@pp/image-sources/image-source-view/image-source-setup/image-source-setup.component';

const routes: Routes = [
  {
    path: '',
    component: ImageSourceSetupComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImageSourceSetupRoutingModule { }
