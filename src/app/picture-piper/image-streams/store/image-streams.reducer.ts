import {
  Action,
  ActionReducer,
  createReducer,
  on,
} from '@ngrx/store';

import { ImageStreamsActions } from '@pp/image-streams/store/image-streams.actions';
import {
  ImageStreamsState,
  initialImageStreamsState,
} from '@pp/image-streams/store/image-streams.state';

const reducer: ActionReducer<ImageStreamsState> = createReducer(
  initialImageStreamsState,

  on(ImageStreamsActions.setSelectedImageStreamId, (state: ImageStreamsState, action: any) => {
    return {
      ...state,
      selectedImageStreamId: action.payload,
    };
  }),

  on(ImageStreamsActions.addImagesByStreamId, (state: ImageStreamsState, action: any) => {
    return {
      ...state,
      imagesByStreamId: {
        ...state,
        ...action.payload,
      },
    };
  }),

  on(ImageStreamsActions.setImageStreamViewTab, (state: ImageStreamsState, action: any) => {
    return {
      ...state,
      imageStreamViewTab: action.payload,
    };
  }),

  on(ImageStreamsActions.generateImageStreamToken, (state: ImageStreamsState, action: any) => {
    return {
      ...state,
      isGeneratingTokenByImageStream: {
        ...state.isGeneratingTokenByImageStream,
        [action.payload]: true,
      },
    };
  }),
  on(ImageStreamsActions.generateImageStreamTokenSuccess, (state: ImageStreamsState, action: any) => {
    return {
      ...state,
      isGeneratingTokenByImageStream: {
        ...state.isGeneratingTokenByImageStream,
        [action.payload]: false,
      },
    };
  }),
  on(ImageStreamsActions.generateImageStreamTokenFailure, (state: ImageStreamsState, action: any) => {
    return {
      ...state,
      isGeneratingTokenByImageStream: {
        ...state.isGeneratingTokenByImageStream,
        [action.payload]: false,
      },
    };
  }),

  on(ImageStreamsActions.loadImageStreamTokensSuccess, (state: ImageStreamsState, action: any) => {
    return {
      ...state,
      imageStreamTokensByImageStream: {
        ...state.imageStreamTokensByImageStream,
        [action.imageStreamId]: action.imageStreamTokens,
      },
    };
  })
);

export function imageStreamsReducer(state: ImageStreamsState, action: Action): ImageStreamsState {
  return reducer(state, action);
}
