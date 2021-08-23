import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageStreamOverviewComponent } from '@pp/image-streams/image-stream-view/image-stream-overview/image-stream-overview.component';

const routes: Routes = [
  {
    path: '',
    component: ImageStreamOverviewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImageStreamOverviewRoutingModule { }
