import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { LocationPickerComponent } from '@photo-gallery/photo-gallery-common/location-picker/location-picker.component';
// import { PhotoGalleryComponent } from '@photo-gallery/photo-gallery.component';
import { PHOTO_GALLERY_SERVICES } from '@photo-gallery/services/index';
// import { UploadFileListViewerComponent } from '@photo-gallery/photo-gallery-common/upload-file-list-viewer/upload-file-list-viewer.component';
// import { UploadFileGridViewerComponent } from '@photo-gallery/photo-gallery-common/upload-file-grid-viewer/upload-file-grid-viewer.component';

const PHOTO_GALLERY_COMMON_COMPONENTS = [
  // UploadFileListViewerComponent,
  // UploadFileGridViewerComponent,
  LocationPickerComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ScrollingModule,
  ],
  declarations: [
    ...PHOTO_GALLERY_COMMON_COMPONENTS,
  ],
  exports: [
    ...PHOTO_GALLERY_COMMON_COMPONENTS,
  ],
  providers: [
    ...PHOTO_GALLERY_SERVICES,
  ],
})
export class PhotoGalleryCommonModule { }
