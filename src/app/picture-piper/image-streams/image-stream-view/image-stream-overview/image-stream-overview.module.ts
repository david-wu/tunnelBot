import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { InputStringEditorModule } from '@common/input-string-editor/input-string-editor.module';
import { ImageStreamOverviewComponent } from '@pp/image-streams/image-stream-view/image-stream-overview/image-stream-overview.component';
import { ImageStreamOverviewRoutingModule } from '@pp/image-streams/image-stream-view/image-stream-overview/image-stream-overview.routes';

@NgModule({
  imports: [
    CommonModule,
    ImageStreamOverviewRoutingModule,
    InputStringEditorModule,
  ],
  declarations: [
    ImageStreamOverviewComponent,
  ],
  exports: [
    ImageStreamOverviewComponent,
  ],
})
export class ImageStreamOverviewModule { }
