import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';

import { File } from '@file-explorer/models/index';
import { MlFilesState } from '@src/app/ml-app/store/ml-files.state';

export const getMlFilesState$: MemoizedSelector<MlFilesState, MlFilesState> = createFeatureSelector(
  'mlFiles',
);

// export const getUserLocation$: MemoizedSelector<MlFilesState, LocationData> = createSelector(
//   getMlFilesState$,
//   (state: MlFilesState) => state.userLocation,
// );

export const getLocationPermission$: MemoizedSelector<MlFilesState, boolean> = createSelector(
  getMlFilesState$,
  (state: MlFilesState) => state.locationPermission,
);

export const getFilesById$: MemoizedSelector<MlFilesState, Record<string, File>> = createSelector(
  getMlFilesState$,
  (state: MlFilesState) => {
    // console.log('state', state)
    return state.filesById;
  },
);
