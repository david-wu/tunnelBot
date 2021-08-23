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

import { ImageStreamsService } from '@pp/image-streams/services';
import { ImageStreamsActions } from '@pp/image-streams/store/image-streams.actions';
import {
  getImageStreamsListVisible$,
  getImageStreamViewTab$,
} from '@pp/image-streams/store/image-streams.selectors';
import { PicturePiperService } from '@pp/services';
import {
  AuthActions,
  getUser$,
} from '@src/app/store/index';

@Injectable()
export class ImageStreamsEffects {

  public loadImagesByStreamId$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImageStreamsActions.loadImagesByStreamId),
      withLatestFrom(this.store$.pipe(select(getUser$))),
      switchMap(([action, user]) => {
        const streamId = action.payload;
        if (!streamId || !user) {
          return of(ImageStreamsActions.addImagesByStreamId({ payload: {} }));
        }
        return this.firestore.getFilesForStream$(streamId).pipe(
          map((myUploads) => {
            return ImageStreamsActions.addImagesByStreamId({
              payload: {
                [streamId]: myUploads,
              },
            });
          })
        );
      }),
    );
  });

  public uploadImageStreamFile$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImageStreamsActions.uploadImageStreamFile),
      withLatestFrom(this.store$.pipe(select(getUser$))),
      switchMap(([action, user]) => {
        const streamId = action.selectedImageStreamId;
        const file = action.file;
        if (!streamId || !user) {
          return of(ImageStreamsActions.uploadImageStreamFileFailure({ payload: 'no user or stream' }));
        }
        return from(this.imageStreamsService.uploadImageStreamFile(file, user, streamId)).pipe(
          map((uploadedImage) => {
            return ImageStreamsActions.uploadImageStreamFileSuccess({
              selectedImageStreamId: streamId,
            });
          })
        );
      }),
    );
  });

  public deleteUpload$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImageStreamsActions.deleteUpload),
      switchMap((action) => {
        const uploadId = action.payload;
        if (!uploadId) {
          return of(ImageStreamsActions.deleteUploadFailure({ payload: 'no uploadId' }));
        }
        return from(this.imageStreamsService.deleteFile(uploadId)).pipe(
          map((uploadedImage) => ImageStreamsActions.deleteUploadSuccess({ payload: uploadId })),
        );
      }),
    );
  });

  public navigateToImageStreamView$: Observable<any> = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImageStreamsActions.navigateToImageStreamView),
      withLatestFrom(this.store$.pipe(select(getImageStreamViewTab$))),
      map(([action, viewTab]) => {
        return this.router.navigate([
          action.payload,
          ...(viewTab ? [viewTab] : []),
        ]);
      }),
    );
  }, { dispatch: false });

  public updateImageStream$: Observable<any> = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImageStreamsActions.updateImageStream),
      switchMap((action) => {
        const { imageStreamId, patch } = action;
        return from(this.imageStreamsService.updateImageStream(imageStreamId, patch)).pipe(
          map((uploadedImage) => ImageStreamsActions.updateImageStreamSuccess({ imageStreamId, patch })),
        );
      }),
    );
  });

  constructor(
    public store$: Store,
    public actions$: Actions,
    public firestore: FirebaseFirestoreService,
    public imageStreamsService: ImageStreamsService,
    public router: Router,
    public ppService: PicturePiperService,
  ) {}
}
