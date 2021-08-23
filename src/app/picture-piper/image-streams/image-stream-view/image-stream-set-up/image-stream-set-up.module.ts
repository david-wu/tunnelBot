import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ImageStreamSetUpComponent } from '@pp/image-streams/image-stream-view/image-stream-set-up/image-stream-set-up.component';
import { ImageStreamSetUpRoutingModule } from '@pp/image-streams/image-stream-view/image-stream-set-up/image-stream-set-up.routes';

@NgModule({
  imports: [
    CommonModule,
    ImageStreamSetUpRoutingModule,
  ],
  declarations: [
    ImageStreamSetUpComponent,
  ],
  exports: [
    ImageStreamSetUpComponent,
  ],
})
export class ImageStreamSetUpModule { }
