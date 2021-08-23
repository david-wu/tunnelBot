import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';

import { PicturePiperState } from '@pp/store/picture-piper.state';

export const getPicturePiperState$: MemoizedSelector<PicturePiperState, PicturePiperState> = createFeatureSelector(
  'picturePiper',
);

export const getVisibleResourceListCounts$: MemoizedSelector<PicturePiperState, Record<string, number>> = createSelector(
  getPicturePiperState$,
  (state: PicturePiperState) => state.visibleResourceListCounts,
);
export const getResourceLists$: MemoizedSelector<PicturePiperState, Record<string, any[]>> = createSelector(
  getPicturePiperState$,
  (state: PicturePiperState) => state.resourceLists,
);
export const getResourceListsLoading$: MemoizedSelector<PicturePiperState, Record<string, boolean>> = createSelector(
  getPicturePiperState$,
  (state: PicturePiperState) => state.resourceListsLoading,
);

export const getVisibleResourceDocCounts$: MemoizedSelector<PicturePiperState, Record<string, number>> = createSelector(
  getPicturePiperState$,
  (state: PicturePiperState) => state.visibleResourceDocCounts,
);
export const getResourceDocs$: MemoizedSelector<PicturePiperState, Record<string, any>> = createSelector(
  getPicturePiperState$,
  (state: PicturePiperState) => state.resourceDocs,
);
export const getResourceDocsLoading$: MemoizedSelector<PicturePiperState, Record<string, boolean>> = createSelector(
  getPicturePiperState$,
  (state: PicturePiperState) => state.resourceDocsLoading,
);
