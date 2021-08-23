import {
  Action,
  ActionReducer,
  createReducer,
  on,
} from '@ngrx/store';

import { PhotoGalleryActions } from '@src/app/photo-gallery/store/photo-gallery.actions';
import {
  initialPhotoGalleryState,
  PhotoGalleryState,
} from '@src/app/photo-gallery/store/photo-gallery.state';

const reducer: ActionReducer<PhotoGalleryState> = createReducer(
  initialPhotoGalleryState,

  // on(PhotoGalleryActions.requestUserLocation, (state: PhotoGalleryState, action: PhotoGalleryActions) => {
  //   return {
  //     ...state,
  //   };
  // }),

  on(PhotoGalleryActions.setUserLocation, (state: PhotoGalleryState, action: any) => {
    return {
      ...state,
      userLocation: action.payload,
    };
  }),

  on(PhotoGalleryActions.setNearbyImagesVisible, (state: PhotoGalleryState, action: any) => {
    return {
      ...state,
      nearbyImagesVisible: action.payload,
    };
  }),

  on(PhotoGalleryActions.setNearbyImages, (state: PhotoGalleryState, action: any) => {
    return {
      ...state,
      nearbyImages: action.payload,
    };
  }),

  on(PhotoGalleryActions.setUserLocationPermission, (state: PhotoGalleryState, action: any) => {
    return {
      ...state,
      locationPermission: action.locationPermission,
    };
  }),

  on(PhotoGalleryActions.setMyUploadsVisible, (state: PhotoGalleryState, action: any) => {
    return {
      ...state,
      myUploadsVisible: action.payload,
    };
  }),

  on(PhotoGalleryActions.setMyUploads, (state: PhotoGalleryState, action: any) => {
    return {
      ...state,
      myUploads: action.payload,
    };
  }),
);

export function photoGalleryReducer(state: PhotoGalleryState, action: Action): PhotoGalleryState {
  return reducer(state, action);
}
