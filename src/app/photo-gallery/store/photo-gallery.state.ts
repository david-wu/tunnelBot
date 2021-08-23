import { LocationData } from '@photo-gallery/models/index';

export interface PhotoGalleryState  {
  nearbyImagesVisible: boolean;
  nearbyImages: any[];
  userLocation: LocationData;
  locationPermission: boolean;
  myUploadsVisible: boolean;
  myUploads: any[];
}

export const initialPhotoGalleryState = {
  nearbyImagesVisible: false,
  nearbyImages: undefined,
  userLocation: undefined,
  locationPermission: undefined,
  myUploadsVisible: undefined,
  myUploads: undefined,
};
