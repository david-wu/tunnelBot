
import { PhotoGalleryService } from '@src/app/photo-gallery/services/photo-gallery.service';
import { UserLocationService } from '@src/app/photo-gallery/services/user-location.service';

export const PHOTO_GALLERY_SERVICES = [
  PhotoGalleryService,
  UserLocationService,
];

export * from './photo-gallery.service';
export * from './user-location.service';
