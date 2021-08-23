import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { LocationPickerModule } from '@common/location-picker/location-picker.module';
import { PhotoGalleryComponent } from '@photo-gallery/photo-gallery.component';
import { PhotoGalleryRoutingModule } from '@photo-gallery/photo-gallery.routes';
import { PHOTO_GALLERY_SERVICES } from '@photo-gallery/services/index';

import {
  PhotoGalleryEffects,
  photoGalleryReducer,
} from '@photo-gallery/store/index';

const PHOTO_GALLERY_COMPONENTS = [
  PhotoGalleryComponent,
];

@NgModule({
  imports: [
    CommonModule,
    LocationPickerModule,
    PhotoGalleryRoutingModule,
    StoreModule.forFeature('photoGallery', photoGalleryReducer),
    EffectsModule.forFeature([PhotoGalleryEffects]),
  ],
  declarations: [
    ...PHOTO_GALLERY_COMPONENTS,
  ],
  exports: [
    ...PHOTO_GALLERY_COMPONENTS,
  ],
  providers: [
    ...PHOTO_GALLERY_SERVICES,
  ],
})
export class PhotoGalleryModule { }
