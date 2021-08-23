import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ImageStreamViewComponent } from '@pp/image-streams/image-stream-view/image-stream-view.component';
import { ImageStreamViewRoutingModule } from '@pp/image-streams/image-stream-view/image-stream-view.routes';

@NgModule({
  imports: [
    CommonModule,
    ImageStreamViewRoutingModule,
  ],
  declarations: [
    ImageStreamViewComponent,
  ],
  exports: [
    ImageStreamViewComponent,
  ],
})
export class ImageStreamViewModule { }
