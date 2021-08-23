import { ActionReducerMap } from '@ngrx/store';

import {
  NearMeState,
} from './near-me.state';
import { nearMeReducer } from './near-me.reducer';

export const nearMeReducerMap: ActionReducerMap<any> = {
  // nearMeState: nearMeReducer,
};
