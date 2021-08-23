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

import { ImageSourcesService } from '@pp/image-sources/services';
import { ImageSourcesActions } from '@pp/image-sources/store/image-sources.actions';
import {
  getImageSourcesListVisible$,
  getImageSourceViewTab$,
} from '@pp/image-sources/store/image-sources.selectors';
import { PicturePiperService } from '@pp/services';
import {
  AuthActions,
  getUser$,
} from '@src/app/store/index';

@Injectable()
export class ImageSourcesEffects {

  public loadImagesBySourceId$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImageSourcesActions.loadImagesBySourceId),
      withLatestFrom(this.store$.pipe(select(getUser$))),
      switchMap(([action, user]) => {
        const sourceId = action.payload;
        if (!sourceId || !user) {
          return of(ImageSourcesActions.addImagesBySourceId({ payload: {} }));
        }
        return this.ppService.getFilesForSource$(sourceId).pipe(
          map((myUploads) => {
            return ImageSourcesActions.addImagesBySourceId({
              payload: {
                [sourceId]: myUploads,
              },
            });
          })
        );
      }),
    );
  });

  public uploadImageSourceFile$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImageSourcesActions.uploadImageSourceFile),
      withLatestFrom(this.store$.pipe(select(getUser$))),
      switchMap(([action, user]) => {
        const sourceId = action.selectedImageSourceId;
        const file = action.file;
        if (!sourceId || !user) {
          return of(ImageSourcesActions.uploadImageSourceFileFailure({ payload: 'no user or source' }));
        }
        return from(this.imageSourcesService.uploadImageSourceFile(file, user, sourceId)).pipe(
          map((uploadedImage) => {
            return ImageSourcesActions.uploadImageSourceFileSuccess({
              selectedImageSourceId: sourceId,
            });
          })
        );
      }),
    );
  });

  public deleteUpload$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImageSourcesActions.deleteUpload),
      switchMap((action) => {
        const uploadId = action.payload;
        if (!uploadId) {
          return of(ImageSourcesActions.deleteUploadFailure({ payload: 'no uploadId' }));
        }
        return from(this.imageSourcesService.deleteFile(uploadId)).pipe(
          map((uploadedImage) => ImageSourcesActions.deleteUploadSuccess({ payload: uploadId })),
        );
      }),
    );
  });

  public navigateToImageSourceView$: Observable<any> = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImageSourcesActions.navigateToImageSourceView),
      withLatestFrom(this.store$.pipe(select(getImageSourceViewTab$))),
      map(([action, viewTab]) => {
        return this.router.navigate([
          action.payload,
          ...(viewTab ? [viewTab] : []),
        ]);
      }),
    );
  }, { dispatch: false });

  public updateImageSource$: Observable<any> = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImageSourcesActions.updateImageSource),
      switchMap((action) => {
        const { imageSourceId, patch } = action;
        return from(this.imageSourcesService.updateImageSource(imageSourceId, patch)).pipe(
          map((uploadedImage) => ImageSourcesActions.updateImageSourceSuccess({ imageSourceId, patch })),
        );
      }),
    );
  });

  public generateImageSourceToken$: Observable<any> = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImageSourcesActions.generateImageSourceToken),
      switchMap((action) => {
        const imageSourceId = action.payload;
        return from(this.imageSourcesService.generateImageSourceToken(imageSourceId)).pipe(
          map(() => ImageSourcesActions.generateImageSourceTokenSuccess({ payload: imageSourceId })),
          catchError(() => of(ImageSourcesActions.generateImageSourceTokenFailure({ payload: imageSourceId }))),
        );
      }),
    );
  });

  public loadImageSourceTokens$: Observable<any> = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImageSourcesActions.loadImageSourceTokens),
      switchMap((action) => {
        const imageSourceId = action.imageSourceId;
        return from(this.imageSourcesService.loadImageSourceTokens(imageSourceId)).pipe(
          map((imageSourceTokens: any[]) => ImageSourcesActions.loadImageSourceTokensSuccess({ imageSourceId, imageSourceTokens })),
        );
      }),
    );
  });

  constructor(
    public store$: Store,
    public actions$: Actions,
    public firestore: FirebaseFirestoreService,
    public imageSourcesService: ImageSourcesService,
    public router: Router,
    public ppService: PicturePiperService,
  ) {}
}
