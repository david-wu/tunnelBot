import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';

import { User } from '@models/index';
import { AuthState } from '@src/app/store/auth.state';

export const getAuthState$: MemoizedSelector<AuthState, AuthState> = createFeatureSelector(
  'auth',
);

export const getUser$: MemoizedSelector<AuthState, User> = createSelector(
  getAuthState$,
  (state: AuthState) => state.user,
);

export const getAuthLoading$: MemoizedSelector<AuthState, boolean> = createSelector(
  getUser$,
  (user: User) => user === undefined,
);

export const getCanLogin$: MemoizedSelector<AuthState, boolean> = createSelector(
  getUser$,
  (user: User) => user === null,
);
