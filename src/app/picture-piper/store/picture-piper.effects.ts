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
  Observable,
  of,
} from 'rxjs';
import {
  switchMap,
  catchError,
} from 'rxjs/operators';

import {
  map,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators';

import { PicturePiperService } from '@pp/services';
import { PicturePiperActions } from '@pp/store/picture-piper.actions';
import {
  getVisibleResourceDocCounts$,
  getVisibleResourceListCounts$,
} from '@pp/store/picture-piper.selectors';
import { getUser$ } from '@src/app/store/index';

@Injectable()
export class PicturePiperEffects {

  public addVisibleResourceList$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(PicturePiperActions.addVisibleResourceList),
      withLatestFrom(
        this.store$.pipe(select(getUser$)),
        this.store$.pipe(select(getVisibleResourceListCounts$)),
      ),
      mergeMap(([action, user, visibleResourceListCounts]) => {
        const resource = action.resource;
        const visibleResourceListCount = visibleResourceListCounts[resource.path];

        if (visibleResourceListCount === 1) {
          return this.ppService.getResourceList$(user, resource).pipe(
            map((list) => {
              return PicturePiperActions.setResourceList({
                resource,
                list,
              });
            }),
          );
        }
        return of(PicturePiperActions.setResourceList({
          resource: 'null',
          list: [],
        }));
      }),
    );
  });

  public addVisibleResourceDoc$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(PicturePiperActions.addVisibleResourceDoc),
      withLatestFrom(
        this.store$.pipe(select(getUser$)),
        this.store$.pipe(select(getVisibleResourceDocCounts$)),
      ),
      mergeMap(([action, user, visibleResourceDocCounts]) => {
        const resource = action.resource;
        const visibleResourceDocCount = visibleResourceDocCounts[resource.path];

        if (visibleResourceDocCount === 1) {
          return this.ppService.getResourceDoc$(user, resource).pipe(
            map((doc) => {
              return PicturePiperActions.setResourceDoc({
                resource,
                doc,
              });
            }),
          );
        }
        return of(PicturePiperActions.setResourceDoc({
          resource: 'null',
          doc: undefined,
        }));
      }),
    );
  });

  public patchResourceDoc$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(PicturePiperActions.patchResourceDoc),
      withLatestFrom(
        this.store$.pipe(select(getUser$)),
      ),
      mergeMap(([action, user]) => {
        const resource = action.resource;
        const patch = action.patch;
        return this.ppService.patchResourceDoc(user, resource, patch).pipe(
          map((doc) => {
            return PicturePiperActions.patchResourceSuccess({
              resource,
            });
          }),
        );
      }),
    );
  });

  public createResourceDoc$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(PicturePiperActions.createResourceDoc),
      withLatestFrom(this.store$.pipe(select(getUser$))),
      switchMap(([action, user]) => {
        const { resource, patch } = action;
        if (!user) {
          return of(PicturePiperActions.createResourceDocFailure({ resource: resource.path }));
        }
        return this.ppService.createResourceDoc(user, resource, patch).pipe(
          map((imageSource) => {
            return PicturePiperActions.createResourceDocSuccess({ resource: resource.path });
          }),
          catchError((err) => {
            return of(PicturePiperActions.createResourceDocFailure({ resource: resource.path }));
          })
        );
      }),
    );
  });

  constructor(
    public store$: Store,
    public actions$: Actions,
    public ppService: PicturePiperService,
  ) {}
}
