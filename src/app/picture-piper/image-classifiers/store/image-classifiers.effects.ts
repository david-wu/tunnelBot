import { Injectable } from '@angular/core';
import {
  Router,
} from '@angular/router';
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
  FirebaseFirestoreService,
} from '@services/index';
import {
  from,
  Observable,
  of,
} from 'rxjs';
import {
  catchError,
  map,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';

import { ImageClassifiersService } from '@pp/image-classifiers/services';
import { ImageClassifiersActions } from '@pp/image-classifiers/store/image-classifiers.actions';
import {
  getImageClassifiersListVisible$,
  getImageClassifierViewTab$,
} from '@pp/image-classifiers/store/image-classifiers.selectors';
import { PicturePiperService } from '@pp/services';
import {
  AuthActions,
  getUser$,
} from '@src/app/store/index';

@Injectable()
export class ImageClassifiersEffects {

  // public loadImagesByClassifierId$: Observable<Action> = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(ImageClassifiersActions.loadImagesByClassifierId),
  //     withLatestFrom(this.store$.pipe(select(getUser$))),
  //     switchMap(([action, user]) => {
  //       const classifierId = action.payload;
  //       if (!classifierId || !user) {
  //         return of(ImageClassifiersActions.addImagesByClassifierId({ payload: {} }));
  //       }
  //       return this.firestore.getFilesForClassifier$(classifierId).pipe(
  //         map((myUploads) => {
  //           return ImageClassifiersActions.addImagesByClassifierId({
  //             payload: {
  //               [classifierId]: myUploads,
  //             },
  //           });
  //         })
  //       );
  //     }),
  //   );
  // });

  // public uploadImageClassifierFile$: Observable<Action> = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(ImageClassifiersActions.uploadImageClassifierFile),
  //     withLatestFrom(this.store$.pipe(select(getUser$))),
  //     switchMap(([action, user]) => {
  //       const classifierId = action.selectedImageClassifierId;
  //       const file = action.file;
  //       if (!classifierId || !user) {
  //         return of(ImageClassifiersActions.uploadImageClassifierFileFailure({ payload: 'no user or classifier' }));
  //       }
  //       return from(this.imageClassifiersService.uploadImageClassifierFile(file, user, classifierId)).pipe(
  //         map((uploadedImage) => {
  //           return ImageClassifiersActions.uploadImageClassifierFileSuccess({
  //             selectedImageClassifierId: classifierId,
  //           });
  //         })
  //       );
  //     }),
  //   );
  // });

  // public deleteUpload$: Observable<Action> = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(ImageClassifiersActions.deleteUpload),
  //     switchMap((action) => {
  //       const uploadId = action.payload;
  //       if (!uploadId) {
  //         return of(ImageClassifiersActions.deleteUploadFailure({ payload: 'no uploadId' }));
  //       }
  //       return from(this.imageClassifiersService.deleteFile(uploadId)).pipe(
  //         map((uploadedImage) => ImageClassifiersActions.deleteUploadSuccess({ payload: uploadId })),
  //       );
  //     }),
  //   );
  // });

  public navigateToImageClassifierView$: Observable<any> = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImageClassifiersActions.navigateToImageClassifierView),
      withLatestFrom(this.store$.pipe(select(getImageClassifierViewTab$))),
      map(([action, viewTab]) => {
        return this.router.navigate([
          action.payload,
          ...(viewTab ? [viewTab] : []),
        ]);
      }),
    );
  }, { dispatch: false });

  public updateImageClassifier$: Observable<any> = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImageClassifiersActions.updateImageClassifier),
      switchMap((action) => {
        const { imageClassifierId, patch } = action;
        return from(this.imageClassifiersService.updateImageClassifier(imageClassifierId, patch)).pipe(
          map((uploadedImage) => ImageClassifiersActions.updateImageClassifierSuccess({ imageClassifierId, patch })),
        );
      }),
    );
  });

  constructor(
    public store$: Store,
    public actions$: Actions,
    public firestore: FirebaseFirestoreService,
    public imageClassifiersService: ImageClassifiersService,
    public router: Router,
    public ppService: PicturePiperService,
  ) {}
}
