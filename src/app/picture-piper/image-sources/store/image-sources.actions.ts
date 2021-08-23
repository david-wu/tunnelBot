import {
  createAction,
  props,
} from '@ngrx/store';

export class ImageSourcesActions {
  public static readonly CATEGORY = '[IMAGE_SOURCES]';

  public static setSelectedImageSourceId = createAction(
    `${ImageSourcesActions.CATEGORY} SET_SELECTED_IMAGE_SOURCE_ID`,
    props<{ payload: string }>(),
  );
  public static loadImagesBySourceId = createAction(
    `${ImageSourcesActions.CATEGORY} LOAD_IMAGES_BY_SOURCE_ID`,
    props<{ payload: string }>(),
  );
  public static addImagesBySourceId = createAction(
    `${ImageSourcesActions.CATEGORY} ADD_IMAGES_BY_SOURCE_ID`,
    props<{ payload: Record<string, any[]> }>(),
  );

  public static uploadImageSourceFile = createAction(
    `${ImageSourcesActions.CATEGORY} UPLOAD_IMAGE_SOURCE_FILE`,
    props<{ selectedImageSourceId: string, file: File }>(),
  );
  public static uploadImageSourceFileSuccess = createAction(
    `${ImageSourcesActions.CATEGORY} UPLOAD_IMAGE_SOURCE_FILE_SUCCESS`,
    props<{ selectedImageSourceId: string }>(),
  );
  public static uploadImageSourceFileFailure = createAction(
    `${ImageSourcesActions.CATEGORY} UPLOAD_IMAGE_SOURCE_FILE_FAILURE`,
    props<{ payload: any }>(),
  );

  public static deleteUpload = createAction(
    `${ImageSourcesActions.CATEGORY} DELETE_UPLOAD`,
    props<{ payload: string, }>(),
  );
  public static deleteUploadSuccess = createAction(
    `${ImageSourcesActions.CATEGORY} DELETE_UPLOAD_SUCCESS`,
    props<{ payload: string }>(),
  );
  public static deleteUploadFailure = createAction(
    `${ImageSourcesActions.CATEGORY} DELETE_UPLOAD_FAILURE`,
    props<{ payload: any }>(),
  );

  public static setImageSourceViewTab = createAction(
    `${ImageSourcesActions.CATEGORY} SET_IMAGE_SOURCE_VIEW_TAB`,
    props<{ payload: string }>(),
  );
  public static navigateToImageSourceView = createAction(
    `${ImageSourcesActions.CATEGORY} NAVIGATE_TO_IMAGE_SOURCE_VIEW`,
    props<{ payload: string }>(),
  );

  public static updateImageSource = createAction(
    `${ImageSourcesActions.CATEGORY} UPDATE_IMAGE_SOURCE`,
    props<{ imageSourceId: string, patch: any }>(),
  );
  public static updateImageSourceSuccess = createAction(
    `${ImageSourcesActions.CATEGORY} UPDATE_IMAGE_SOURCE_SUCCESS`,
    props<{ imageSourceId: string, patch: any }>(),
  );
  public static updateImageSourceFailure = createAction(
    `${ImageSourcesActions.CATEGORY} UPDATE_IMAGE_SOURCE_FAILURE`,
    props<{ imageSourceId: string, patch: any, error: string }>(),
  );

  public static generateImageSourceToken = createAction(
    `${ImageSourcesActions.CATEGORY} GENERATE_IMAGE_SOURCE_TOKEN`,
    props<{ payload: string }>(),
  );
  public static generateImageSourceTokenSuccess = createAction(
    `${ImageSourcesActions.CATEGORY} GENERATE_IMAGE_SOURCE_TOKEN_SUCCESS`,
    props<{ payload: string }>(),
  );
  public static generateImageSourceTokenFailure = createAction(
    `${ImageSourcesActions.CATEGORY} GENERATE_IMAGE_SOURCE_TOKEN_FAILURE`,
    props<{ payload: string }>(),
  );

  public static loadImageSourceTokens = createAction(
    `${ImageSourcesActions.CATEGORY} LOAD_IMAGE_SOURCE_TOKENS`,
    props<{ imageSourceId: string }>(),
  );
  public static loadImageSourceTokensSuccess = createAction(
    `${ImageSourcesActions.CATEGORY} LOAD_IMAGE_SOURCE_TOKENS_SUCCESS`,
    props<{ imageSourceId: string, imageSourceTokens: any[] }>(),
  );
  public static loadImageSourceTokensFailure = createAction(
    `${ImageSourcesActions.CATEGORY} LOAD_IMAGE_SOURCE_TOKENS_FAILURE`,
    props<{ imageSourceId: string }>(),
  );

}
