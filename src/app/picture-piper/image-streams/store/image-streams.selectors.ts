import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';
import { keyBy } from 'lodash';

import { ImageStreamsState } from '@pp/image-streams/store/image-streams.state';
import { getResourceLists$ } from '@pp/store';

export const getImageStreamsState$: MemoizedSelector<ImageStreamsState, ImageStreamsState> = createFeatureSelector(
  'imageStreams',
);

export const getImageStreamsListVisible$: MemoizedSelector<ImageStreamsState, boolean> = createSelector(
  getImageStreamsState$,
  (state: ImageStreamsState) => state.imageStreamsListVisible,
);

export const getImageStreamsList$: MemoizedSelector<ImageStreamsState, any[]> = createSelector(
  getImageStreamsState$,
  (state: ImageStreamsState) => state.imageStreamsList,
);

export const getImageStreamsById$: MemoizedSelector<any, Record<string, any>> = createSelector(
  getResourceLists$,
  (resourceLists) => keyBy(resourceLists['imageStreams'], 'id'),
);

export const getSelectedImageStreamId$: MemoizedSelector<ImageStreamsState, string> = createSelector(
  getImageStreamsState$,
  (state: ImageStreamsState) => state.selectedImageStreamId,
);

export const getSelectedImageStream$: MemoizedSelector<ImageStreamsState, any> = createSelector(
  getImageStreamsById$,
  getSelectedImageStreamId$,
  (imageStreamsById: Record<string, any>, streamId: string) => imageStreamsById[streamId],
);

export const getImagesByStreamId$: MemoizedSelector<ImageStreamsState, Record<string, any[]>> = createSelector(
  getImageStreamsState$,
  (state: ImageStreamsState) => state.imagesByStreamId,
);

export const getImageStreamViewTab$: MemoizedSelector<ImageStreamsState, string> = createSelector(
  getImageStreamsState$,
  (state: ImageStreamsState) => state.imageStreamViewTab,
);

export const getIsGeneratingTokenByImageStream$: MemoizedSelector<ImageStreamsState, Record<string, boolean>> = createSelector(
  getImageStreamsState$,
  (state: ImageStreamsState) => state.isGeneratingTokenByImageStream,
);

export const getIsSelectedStreamGeneratingToken$: MemoizedSelector<ImageStreamsState, boolean> = createSelector(
  getSelectedImageStreamId$,
  getIsGeneratingTokenByImageStream$,
  (streamId: string, isGeneratingTokenByStream: Record<string, boolean>) => isGeneratingTokenByStream[streamId],
);

export const getImageStreamTokensByImageStream$: MemoizedSelector<ImageStreamsState, Record<string, any[]>> = createSelector(
  getImageStreamsState$,
  (state: ImageStreamsState) => state.imageStreamTokensByImageStream,
);

