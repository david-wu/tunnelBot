import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { InputStringEditorModule } from '@common/input-string-editor/input-string-editor.module';
import { ImageClassifierOverviewComponent } from '@pp/image-classifiers/image-classifier-view/image-classifier-overview/image-classifier-overview.component';
import { ImageClassifierOverviewRoutingModule } from '@pp/image-classifiers/image-classifier-view/image-classifier-overview/image-classifier-overview.routes';

@NgModule({
  imports: [
    CommonModule,
    ImageClassifierOverviewRoutingModule,
    InputStringEditorModule,
  ],
  declarations: [
    ImageClassifierOverviewComponent,
  ],
  exports: [
    ImageClassifierOverviewComponent,
  ],
})
export class ImageClassifierOverviewModule { }
