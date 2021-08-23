import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UserLoginModule } from '@app/user-login/user-login.module';
import { FileUploaderModule } from '@common/file-uploader/file-uploader.module';
import { ImageGridModule } from '@common/image-grid/image-grid.module';
import { ZoomLevelPickerModule } from '@common/zoom-level-picker/zoom-level-picker.module';
import { MyUploadsComponent } from '@photo-gallery/my-uploads/my-uploads.component';
import { MyUploadsRoutingModule } from '@photo-gallery/my-uploads/my-uploads.routes';
import { PHOTO_GALLERY_SERVICES } from '@photo-gallery/services/index';

@NgModule({
  imports: [
    CommonModule,
    MyUploadsRoutingModule,
    ZoomLevelPickerModule,
    UserLoginModule,
    FileUploaderModule,
    ImageGridModule,
  ],
  declarations: [
    MyUploadsComponent,
  ],
  exports: [
    MyUploadsComponent,
  ],
  providers: [
    ...PHOTO_GALLERY_SERVICES,
  ],
})
export class MyUploadsModule { }
