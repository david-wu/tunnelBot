import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';
import { keyBy } from 'lodash';

import { ImageSourcesState } from '@pp/image-sources/store/image-sources.state';
import { getResourceLists$ } from '@pp/store';

export const getImageSourcesState$: MemoizedSelector<ImageSourcesState, ImageSourcesState> = createFeatureSelector(
  'imageSources',
);

export const getImageSourcesListVisible$: MemoizedSelector<ImageSourcesState, boolean> = createSelector(
  getImageSourcesState$,
  (state: ImageSourcesState) => state.imageSourcesListVisible,
);

export const getImageSourcesById$: MemoizedSelector<any, Record<string, any>> = createSelector(
  getResourceLists$,
  (resourceLists) => keyBy(resourceLists['imageSources'], 'id'),
);

export const getSelectedImageSourceId$: MemoizedSelector<ImageSourcesState, string> = createSelector(
  getImageSourcesState$,
  (state: ImageSourcesState) => state.selectedImageSourceId,
);

export const getSelectedImageSource$: MemoizedSelector<ImageSourcesState, any> = createSelector(
  getImageSourcesById$,
  getSelectedImageSourceId$,
  (imageSourcesById: Record<string, any>, sourceId: string) => imageSourcesById[sourceId],
);

export const getImagesBySourceId$: MemoizedSelector<ImageSourcesState, Record<string, any[]>> = createSelector(
  getImageSourcesState$,
  (state: ImageSourcesState) => state.imagesBySourceId,
);

export const getImageSourceViewTab$: MemoizedSelector<ImageSourcesState, string> = createSelector(
  getImageSourcesState$,
  (state: ImageSourcesState) => state.imageSourceViewTab,
);

export const getIsGeneratingTokenByImageSource$: MemoizedSelector<ImageSourcesState, Record<string, boolean>> = createSelector(
  getImageSourcesState$,
  (state: ImageSourcesState) => state.isGeneratingTokenByImageSource,
);

export const getIsSelectedSourceGeneratingToken$: MemoizedSelector<ImageSourcesState, boolean> = createSelector(
  getSelectedImageSourceId$,
  getIsGeneratingTokenByImageSource$,
  (sourceId: string, isGeneratingTokenBySource: Record<string, boolean>) => isGeneratingTokenBySource[sourceId],
);

export const getImageSourceTokensByImageSource$: MemoizedSelector<ImageSourcesState, Record<string, any[]>> = createSelector(
  getImageSourcesState$,
  (state: ImageSourcesState) => state.imageSourceTokensByImageSource,
);

