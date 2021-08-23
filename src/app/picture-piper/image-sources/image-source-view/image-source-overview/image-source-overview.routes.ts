import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageSourceOverviewComponent } from '@pp/image-sources/image-source-view/image-source-overview/image-source-overview.component';

const routes: Routes = [
  {
    path: '',
    component: ImageSourceOverviewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImageSourceOverviewRoutingModule { }
