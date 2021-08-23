import {
  Action,
  ActionReducer,
  createReducer,
  on,
} from '@ngrx/store';

import { NearMeActions } from './near-me.actions';
import {
  initialNearMeState,
  NearMeState,
} from './near-me.state';
// import {
//   initialNearMeState,
//   NearMeState,
// } from './near-me.state';
const reducer: ActionReducer<NearMeState> = createReducer(
  initialNearMeState,
  on(NearMeActions.loadNearMe, (state: NearMeState, action: NearMeActions) => {
    // console.log('NearMeState state', state)
    return {
      ...state,
      b: state.b + 1,
    };
  }),
);

export function nearMeReducer(state: NearMeState, action: Action): NearMeState {
  return reducer(state, action);
}

// interface PhotoGalleryState  {

// }

// export const photoGalleryReducerMap: ActionReducerMap<PhotoGalleryState> = {
//   photoGalleryState: '',
// };
