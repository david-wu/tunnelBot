import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ImageSourceViewComponent } from '@pp/image-sources/image-source-view/image-source-view.component';
import { ImageSourceViewRoutingModule } from '@pp/image-sources/image-source-view/image-source-view.routes';

@NgModule({
  imports: [
    CommonModule,
    ImageSourceViewRoutingModule,
  ],
  declarations: [
    ImageSourceViewComponent,
  ],
  exports: [
    ImageSourceViewComponent,
  ],
})
export class ImageSourceViewModule { }
