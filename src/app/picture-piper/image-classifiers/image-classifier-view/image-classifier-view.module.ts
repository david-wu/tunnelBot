import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ImageClassifierViewComponent } from '@pp/image-classifiers/image-classifier-view/image-classifier-view.component';
import { ImageClassifierViewRoutingModule } from '@pp/image-classifiers/image-classifier-view/image-classifier-view.routes';

@NgModule({
  imports: [
    CommonModule,
    ImageClassifierViewRoutingModule,
  ],
  declarations: [
    ImageClassifierViewComponent,
  ],
  exports: [
    ImageClassifierViewComponent,
  ],
})
export class ImageClassifierViewModule { }
