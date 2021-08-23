import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyUploadsComponent } from '@photo-gallery/my-uploads/my-uploads.component';

const routes: Routes = [
  {
    path: '',
    component: MyUploadsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyUploadsRoutingModule { }
