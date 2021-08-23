import {
  Action,
  ActionReducer,
  createReducer,
  on,
} from '@ngrx/store';

import { ImageClassifiersActions } from '@pp/image-classifiers/store/image-classifiers.actions';
import {
  ImageClassifiersState,
  initialImageClassifiersState,
} from '@pp/image-classifiers/store/image-classifiers.state';

const reducer: ActionReducer<ImageClassifiersState> = createReducer(
  initialImageClassifiersState,

  on(ImageClassifiersActions.setSelectedImageClassifierId, (state: ImageClassifiersState, action: any) => {
    return {
      ...state,
      selectedImageClassifierId: action.payload,
    };
  }),

  on(ImageClassifiersActions.addImagesByClassifierId, (state: ImageClassifiersState, action: any) => {
    return {
      ...state,
      imagesByClassifierId: {
        ...state,
        ...action.payload,
      },
    };
  }),

  on(ImageClassifiersActions.setImageClassifierViewTab, (state: ImageClassifiersState, action: any) => {
    return {
      ...state,
      imageClassifierViewTab: action.payload,
    };
  }),

  on(ImageClassifiersActions.loadImageClassifierTokensSuccess, (state: ImageClassifiersState, action: any) => {
    return {
      ...state,
      imageClassifierTokensByImageClassifier: {
        ...state.imageClassifierTokensByImageClassifier,
        [action.imageClassifierId]: action.imageClassifierTokens,
      },
    };
  })
);

export function imageClassifiersReducer(state: ImageClassifiersState, action: Action): ImageClassifiersState {
  return reducer(state, action);
}
