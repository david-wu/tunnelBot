import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FileUploaderModule } from '@common/file-uploader/file-uploader.module';
import { ImageGridModule } from '@common/image-grid/image-grid.module';
import { ZoomLevelPickerModule } from '@common/zoom-level-picker/zoom-level-picker.module';
import { ImageSourceImagesViewComponent } from '@pp/image-sources/image-source-view/image-source-images-view/image-source-images-view.component';
import { ImageSourceImagesViewRoutingModule } from '@pp/image-sources/image-source-view/image-source-images-view/image-source-images-view.routes';
import { ImageSourceImagesComponent } from '@pp/image-sources/image-source-view/image-source-images-view/image-source-images/image-source-images.component';
import { ImageSourceUploaderComponent } from '@pp/image-sources/image-source-view/image-source-images-view/image-source-uploader/image-source-uploader.component';

@NgModule({
  imports: [
    CommonModule,
    FileUploaderModule,
    ZoomLevelPickerModule,
    ImageGridModule,
    ImageSourceImagesViewRoutingModule,
  ],
  declarations: [
    ImageSourceImagesViewComponent,
    ImageSourceImagesComponent,
    ImageSourceUploaderComponent,
  ],
  exports: [
    ImageSourceImagesViewComponent,
    ImageSourceImagesComponent,
    ImageSourceUploaderComponent,
  ],
})
export class ImageSourceImagesViewModule { }
