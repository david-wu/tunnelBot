import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
} from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  Action,
  select,
} from '@ngrx/store';
import {
  // FirebaseAuthService,
  FirebaseFirestoreService,
  // FirebaseStorageService,
} from '@services/index';
import {
  sortBy,
} from 'lodash';
import {
  from,
  Observable,
  of,
} from 'rxjs';
import {
  map,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';

import { LocationData } from '@photo-gallery/models/index';
import { UserLocationService } from '@photo-gallery/services/index';
import { PhotoGalleryActions } from '@src/app/photo-gallery/store/photo-gallery.actions';
import {
  getMyUploadsVisible$,
  getNearbyImagesVisible$,
  getUserLocation$,
} from '@src/app/photo-gallery/store/photo-gallery.selectors';
import {
  AuthActions,
  getUser$,
} from '@src/app/store/index';

@Injectable()
export class PhotoGalleryEffects {

  public requestUserLocation$: Observable<Action> = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(PhotoGalleryActions.requestUserLocation),
        switchMap(() => {
          return from(this.userLocationService.getUserLocation()).pipe(
            map((locationData: LocationData) => {
              return PhotoGalleryActions.setUserLocation({ payload: locationData });
            }),
          );
        }),
      );
    },
  );

  public loadNearbyLocation$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        PhotoGalleryActions.setUserLocation,
        PhotoGalleryActions.setNearbyImagesVisible,
      ),
      withLatestFrom(
        this.store$.pipe(select(getUserLocation$)),
        this.store$.pipe(select(getNearbyImagesVisible$)),
      ),
      switchMap(([action, userLocation, nearbyImagesVisible]) => {
        if (!nearbyImagesVisible || !userLocation) {
          return of(PhotoGalleryActions.setNearbyImages({ payload: undefined }));
        }
        return this.firestore.getNearbyUploads$(userLocation).pipe(
          map((nearbyUploads: any[]) => {
            const sortedUploads =  sortBy(nearbyUploads, (upload) => {
              return Math.pow(userLocation.latitude - upload.locationData.latitude, 2) + Math.pow(userLocation.longitude - upload.locationData.longitude, 2);
            });
            return PhotoGalleryActions.setNearbyImages({ payload: sortedUploads });
          }),
        );
      }),
    );
  });

  public getMyUploads$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        AuthActions.setUser,
        PhotoGalleryActions.setMyUploadsVisible,
      ),
      withLatestFrom(
        this.store$.pipe(select(getUser$)),
        this.store$.pipe(select(getMyUploadsVisible$)),
      ),
      switchMap(([action, user, myUploadsVisible]) => {
        if (!myUploadsVisible || !user) {
          return of(PhotoGalleryActions.setMyUploads({ payload: [] }));
        }
        return this.firestore.getUploadedFiles$(user).pipe(
          map((myUploads) => {
            // const sortedUploads = orderBy(myUploads, (upload) => {
            //   if (!upload.metaData) {
            //     return 0;
            //   }
            //   return upload.metaData.updatedAt;
            // }, 'desc');
            return PhotoGalleryActions.setMyUploads({ payload: myUploads });
          })
        );
      }),
    );
  });

  public checkUserLocationPermission$: Observable<Action> = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(PhotoGalleryActions.checkUserLocationPermission),
        switchMap(() => {
          return from(this.userLocationService.getIsPermissionGranted()).pipe(
            map((permission) => PhotoGalleryActions.setUserLocationPermission({ locationPermission: permission }))
          );
        }),
      );
    }
  );

  constructor(
    public store$: Store,
    public actions$: Actions,
    public userLocationService: UserLocationService,
    public firestore: FirebaseFirestoreService,
  ) {}
}
