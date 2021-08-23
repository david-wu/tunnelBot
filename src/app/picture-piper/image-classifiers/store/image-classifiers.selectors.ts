import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';
import { keyBy } from 'lodash';

import { ImageClassifiersState } from '@pp/image-classifiers/store/image-classifiers.state';
import { getResourceLists$ } from '@pp/store';

export const getImageClassifiersState$: MemoizedSelector<ImageClassifiersState, ImageClassifiersState> = createFeatureSelector(
  'imageClassifiers',
);

export const getImageClassifiersListVisible$: MemoizedSelector<ImageClassifiersState, boolean> = createSelector(
  getImageClassifiersState$,
  (state: ImageClassifiersState) => state.imageClassifiersListVisible,
);

export const getImageClassifiersList$: MemoizedSelector<ImageClassifiersState, any[]> = createSelector(
  getImageClassifiersState$,
  (state: ImageClassifiersState) => state.imageClassifiersList,
);

export const getImageClassifiersById$: MemoizedSelector<any, Record<string, any>> = createSelector(
  getResourceLists$,
  (resourceLists) => keyBy(resourceLists['imageClassifiers'], 'id'),
);

export const getSelectedImageClassifierId$: MemoizedSelector<ImageClassifiersState, string> = createSelector(
  getImageClassifiersState$,
  (state: ImageClassifiersState) => state.selectedImageClassifierId,
);

export const getSelectedImageClassifier$: MemoizedSelector<ImageClassifiersState, any> = createSelector(
  getImageClassifiersById$,
  getSelectedImageClassifierId$,
  (imageClassifiersById: Record<string, any>, classifierId: string) => imageClassifiersById[classifierId],
);

export const getImagesByClassifierId$: MemoizedSelector<ImageClassifiersState, Record<string, any[]>> = createSelector(
  getImageClassifiersState$,
  (state: ImageClassifiersState) => state.imagesByClassifierId,
);

export const getImageClassifierViewTab$: MemoizedSelector<ImageClassifiersState, string> = createSelector(
  getImageClassifiersState$,
  (state: ImageClassifiersState) => state.imageClassifierViewTab,
);

export const getIsGeneratingTokenByImageClassifier$: MemoizedSelector<ImageClassifiersState, Record<string, boolean>> = createSelector(
  getImageClassifiersState$,
  (state: ImageClassifiersState) => state.isGeneratingTokenByImageClassifier,
);

export const getIsSelectedClassifierGeneratingToken$: MemoizedSelector<ImageClassifiersState, boolean> = createSelector(
  getSelectedImageClassifierId$,
  getIsGeneratingTokenByImageClassifier$,
  (classifierId: string, isGeneratingTokenByClassifier: Record<string, boolean>) => isGeneratingTokenByClassifier[classifierId],
);

export const getImageClassifierTokensByImageClassifier$: MemoizedSelector<ImageClassifiersState, Record<string, any[]>> = createSelector(
  getImageClassifiersState$,
  (state: ImageClassifiersState) => state.imageClassifierTokensByImageClassifier,
);

