import {
  Action,
  ActionReducer,
  createReducer,
  on,
} from '@ngrx/store';
import { keyBy } from 'lodash';

import { MlFilesActions } from '@src/app/ml-app/store/ml-files.actions';
import {
  initialMlFilesState,
  MlFilesState,
} from '@src/app/ml-app/store/ml-files.state';

const reducer: ActionReducer<MlFilesState> = createReducer(
  initialMlFilesState,
  on(MlFilesActions.getUserFilesSuccess, (state: MlFilesState, action) => {
    // console.log('MlFilesState state', state)
    const incomingFilesById = keyBy(action.files, 'id');
    // console.log('incomingFilesById', incomingFilesById)
    return {
      ...state,
      filesById: {
        ...state.filesById,
        ...incomingFilesById,
      },
    };
  }),
  // on(MlFilesActions.setUserLocation, (state: MlFilesState, action: any) => {
  //   console.log('setUserLocation action', action, state)
  //   return {
  //     ...state,
  //     userLocation: action.userLocation,
  //   };
  // }),
  // on(MlFilesActions.setUserLocationPermission, (state: MlFilesState, action: any) => {
  //   console.log('action, setUserLocationPermission', action)
  //   return {
  //     ...state,
  //     locationPermission: action.locationPermission,
  //   };
  // }),
);

export function mlFilesReducer(state: MlFilesState, action: Action): MlFilesState {
  return reducer(state, action);
}

// interface MlFilesState  {

// }

// export const MlFilesReducerMap: ActionReducerMap<MlFilesState> = {
//   MlFilesState: '',
// };
