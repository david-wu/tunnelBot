import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
} from '@ngrx/effects';
import {
  Action,
  select,
  Store,
} from '@ngrx/store';
import {
  from,
  Observable,
  of,
} from 'rxjs';
import {
  catchError,
  filter,
  map,
  switchMap,
} from 'rxjs/operators';

import {
  getUser$
} from '@app/store';
import {
  FirebaseAuthService,
  FirebaseFirestoreService,
  FirebaseStorageService,
} from '@services/index';

import { File } from '@file-explorer/models/index';
import {
  User,
} from '@models/index';
import { MlFilesActions } from '@src/app/ml-app/store/ml-files.actions';

// import { LocationData } from '@photo-gallery/models/index';

@Injectable()
export class MlFilesEffects {

  public getUserFiles$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(MlFilesActions.getUserFiles),
      switchMap(() => {
        return this.store$.pipe(
          select(getUser$),
          filter(Boolean),
          switchMap((user: User) => {
            const filesRef = this.firestoreService.db.collection(`users/${user.uid}/files`);
            return from(filesRef.get()).pipe(
              map((fileRefs: any) => {
                const files = fileRefs.docs.map((fileRef) => {
                  return Object.assign(new File(), {
                    ...fileRef.data(),
                    id: fileRef.id,
                  });
                });
                return MlFilesActions.getUserFilesSuccess({
                  files
                });
              }),
              catchError((error: any) => of(MlFilesActions.getUserFilesFailure({ error }))),
            );
          })
        );
      }),
    );
  });

  public createUserFiles$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(MlFilesActions.createUserFiles),
      switchMap((action: any) => {
        const files: File[] = action.files;

        return this.store$.pipe(
          select(getUser$),
          filter(Boolean),
          switchMap((user: User) => {
            const fs = this.firestoreService.db;
            const batch = fs.batch();
            const filesRef = fs.collection(`users/${user.uid}/files`);

            files.forEach((file: File) => {
              filesRef.doc(file.id).set({
                ...file
              });
            });
            const commitP = batch.commit();
            // commitP.then((d) => {
            //   console.log('committed', d);
            // });

            return from(commitP).pipe(
              map((fileRefs: any) => {
                return MlFilesActions.createUserFilesSuccess({
                  files
                });
              }),
              catchError((error: any) => of(MlFilesActions.createUserFilesFailure({ error }))),
            );
          })
        );
      }),
    );
  });

  constructor(
    public store$: Store,
    public actions$: Actions,
    public firestoreService: FirebaseFirestoreService,
    public auth: FirebaseAuthService,
    public storage: FirebaseStorageService,
  ) {}
}
