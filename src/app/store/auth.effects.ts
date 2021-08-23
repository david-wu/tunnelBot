import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
} from '@ngrx/effects';
import { Action } from '@ngrx/store';
import {
  Observable,
  of,
} from 'rxjs';
import {
  map,
  mergeMap,
  startWith,
  switchMap
} from 'rxjs/operators';

import { User } from '@models/index';
import {
  FirebaseAuthService,
  FirebaseFirestoreService,
} from '@services/index';
import { AuthActions } from '@src/app/store/auth.actions';

@Injectable()
export class AuthEffects {

  public linkFirebaseAuth$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.linkFirebaseAuth),
      startWith(AuthActions.linkFirebaseAuth()),
      switchMap(() => {
        return this.authService.getUser$().pipe(
          switchMap((user: User) => {
            if (user) {
              return this.firestoreService.updateUser(user).pipe(
                map(() => AuthActions.setUser({ payload: user })),
              );
            }
            return of(AuthActions.setUser({ payload: user }));
          })
        );
      }),
    );
  });

  public renderLogin$: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.renderLogin),
      switchMap(({ nativeEl }) => this.authService.renderLogin(nativeEl)),
    );
  }, { dispatch: false });

  public signOut$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.signOut),
      switchMap(({ nativeEl }) => {
        return this.authService.signOut().pipe(
          mergeMap(() => {
            return [
              AuthActions.setUser({ payload: undefined}),
              AuthActions.renderLogin({ nativeEl }),
            ];
          }),
        );
      }),
    );
  });


  constructor(
    public actions$: Actions,
    public firestoreService: FirebaseFirestoreService,
    public authService: FirebaseAuthService,
  ) {}
}
