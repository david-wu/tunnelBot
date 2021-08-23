import {
  Action,
  ActionReducer,
  createReducer,
  on,
} from '@ngrx/store';

import { PicturePiperActions } from '@pp/store/picture-piper.actions';
import {
  initialPicturePiperState,
  PicturePiperState,
} from '@pp/store/picture-piper.state';

const reducer: ActionReducer<PicturePiperState> = createReducer(
  initialPicturePiperState,

  on(PicturePiperActions.addVisibleResourceList, (state: PicturePiperState, action: any) => {
    const currentCount = state.visibleResourceListCounts[action.resource.path];
    return {
      ...state,
      visibleResourceListCounts: {
        ...state.visibleResourceListCounts,
        [action.resource.path]: currentCount ? currentCount + 1 : 1,
      },
    };
  }),

  on(PicturePiperActions.removeVisibleResourceList, (state: PicturePiperState, action: any) => {
    const currentCount = state.visibleResourceListCounts[action.resource.path];
    return {
      ...state,
      visibleResourceListCounts: {
        ...state.visibleResourceListCounts,
        [action.resource.path]: currentCount ? currentCount - 1 : 0,
      },
    };
  }),

  on(PicturePiperActions.setResourceList, (state: PicturePiperState, action: any) => {
    return {
      ...state,
      resourceLists: {
        ...state.resourceLists,
        [action.resource.path]: action.list,
      },
    };
  }),

  on(PicturePiperActions.addVisibleResourceDoc, (state: PicturePiperState, action: any) => {
    const currentCount = state.visibleResourceDocCounts[action.resource.path];
    return {
      ...state,
      visibleResourceDocCounts: {
        ...state.visibleResourceDocCounts,
        [action.resource.path]: currentCount ? currentCount + 1 : 1,
      },
    };
  }),

  on(PicturePiperActions.removeVisibleResourceDoc, (state: PicturePiperState, action: any) => {
    const currentCount = state.visibleResourceDocCounts[action.resource.path];
    return {
      ...state,
      visibleResourceDocCounts: {
        ...state.visibleResourceDocCounts,
        [action.resource.path]: currentCount ? currentCount - 1 : 0,
      },
    };
  }),

  on(PicturePiperActions.setResourceDoc, (state: PicturePiperState, action: any) => {
    return {
      ...state,
      resourceDocs: {
        ...state.resourceLists,
        [action.resource.path]: action.doc,
      },
    };
  }),



  // on(PicturePiperActions.setImageSourcesListVisible, (state: ImageSourcesState, action: any) => {
  //   return {
  //     ...state,
  //     imageSourcesListVisible: action.payload,
  //   };
  // }),

  // on(PicturePiperActions.setImageSourcesList, (state: ImageSourcesState, action: any) => {
  //   const imageSourcesList = action.payload || [];
  //   return {
  //     ...state,
  //     imageSourcesList,
  //   };
  // }),

  // on(PicturePiperActions.createImageSourceSuccess, (state: ImageSourcesState, action: any) => {
  //   return state;
  // }),

  // on(PicturePiperActions.createImageSourceFailure, (state: ImageSourcesState, action: any) => {
  //   return state;
  // }),

  // on(PicturePiperActions.setSelectedImageSourceId, (state: ImageSourcesState, action: any) => {
  //   return {
  //     ...state,
  //     selectedImageSourceId: action.payload,
  //   };
  // }),

  // on(PicturePiperActions.addImagesBySourceId, (state: ImageSourcesState, action: any) => {
  //   return {
  //     ...state,
  //     imagesBySourceId: {
  //       ...state,
  //       ...action.payload,
  //     },
  //   };
  // }),

  // on(PicturePiperActions.setImageSourceViewTab, (state: ImageSourcesState, action: any) => {
  //   return {
  //     ...state,
  //     imageSourceViewTab: action.payload,
  //   };
  // }),

  // on(PicturePiperActions.generateImageSourceToken, (state: ImageSourcesState, action: any) => {
  //   return {
  //     ...state,
  //     isGeneratingTokenByImageSource: {
  //       ...state.isGeneratingTokenByImageSource,
  //       [action.payload]: true,
  //     },
  //   };
  // }),
  // on(PicturePiperActions.generateImageSourceTokenSuccess, (state: ImageSourcesState, action: any) => {
  //   return {
  //     ...state,
  //     isGeneratingTokenByImageSource: {
  //       ...state.isGeneratingTokenByImageSource,
  //       [action.payload]: false,
  //     },
  //   };
  // }),
  // on(PicturePiperActions.generateImageSourceTokenFailure, (state: ImageSourcesState, action: any) => {
  //   return {
  //     ...state,
  //     isGeneratingTokenByImageSource: {
  //       ...state.isGeneratingTokenByImageSource,
  //       [action.payload]: false,
  //     },
  //   };
  // }),

  // on(PicturePiperActions.loadImageSourceTokensSuccess, (state: ImageSourcesState, action: any) => {
  //   return {
  //     ...state,
  //     imageSourceTokensByImageSource: {
  //       ...state.imageSourceTokensByImageSource,
  //       [action.imageSourceId]: action.imageSourceTokens,
  //     },
  //   }
  // })
);

export function picturePiperReducer(state: PicturePiperState, action: Action): PicturePiperState {
  return reducer(state, action);
}
