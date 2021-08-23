import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';

import { LocationData } from '@photo-gallery/models/index';
import { UploadFile } from '@photo-gallery/models/upload-file.model';
import { PhotoGalleryState } from '@src/app/photo-gallery/store/photo-gallery.state';

export const getPhotoGalleryState$: MemoizedSelector<PhotoGalleryState, PhotoGalleryState> = createFeatureSelector(
  'photoGallery',
);

export const getUserLocation$: MemoizedSelector<PhotoGalleryState, LocationData> = createSelector(
  getPhotoGalleryState$,
  (state: PhotoGalleryState) => state.userLocation,
);

export const getNearbyImagesVisible$: MemoizedSelector<PhotoGalleryState, boolean> = createSelector(
  getPhotoGalleryState$,
  (state: PhotoGalleryState) => state.nearbyImagesVisible,
);

export const getNearbyImages$: MemoizedSelector<PhotoGalleryState, UploadFile[]> = createSelector(
  getPhotoGalleryState$,
  (state: PhotoGalleryState) => state.nearbyImages,
);

export const getLocationPermission$: MemoizedSelector<PhotoGalleryState, boolean> = createSelector(
  getPhotoGalleryState$,
  (state: PhotoGalleryState) => state.locationPermission,
);

export const getMyUploadsVisible$: MemoizedSelector<PhotoGalleryState, boolean> = createSelector(
  getPhotoGalleryState$,
  (state: PhotoGalleryState) => state.myUploadsVisible,
);

export const getMyUploads$: MemoizedSelector<PhotoGalleryState, UploadFile[]> = createSelector(
  getPhotoGalleryState$,
  (state: PhotoGalleryState) => state.myUploads,
);
