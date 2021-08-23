import {
  createAction,
  props,
} from '@ngrx/store';

export class ImageStreamsActions {
  public static readonly CATEGORY = '[IMAGE_STREAMS]';

  public static setSelectedImageStreamId = createAction(
    `${ImageStreamsActions.CATEGORY} SET_SELECTED_IMAGE_STREAM_ID`,
    props<{ payload: string }>(),
  );
  public static loadImagesByStreamId = createAction(
    `${ImageStreamsActions.CATEGORY} LOAD_IMAGES_BY_STREAM_ID`,
    props<{ payload: string }>(),
  );
  public static addImagesByStreamId = createAction(
    `${ImageStreamsActions.CATEGORY} ADD_IMAGES_BY_STREAM_ID`,
    props<{ payload: Record<string, any[]> }>(),
  );

  public static uploadImageStreamFile = createAction(
    `${ImageStreamsActions.CATEGORY} UPLOAD_IMAGE_STREAM_FILE`,
    props<{ selectedImageStreamId: string, file: File }>(),
  );
  public static uploadImageStreamFileSuccess = createAction(
    `${ImageStreamsActions.CATEGORY} UPLOAD_IMAGE_STREAM_FILE_SUCCESS`,
    props<{ selectedImageStreamId: string }>(),
  );
  public static uploadImageStreamFileFailure = createAction(
    `${ImageStreamsActions.CATEGORY} UPLOAD_IMAGE_STREAM_FILE_FAILURE`,
    props<{ payload: any }>(),
  );

  public static deleteUpload = createAction(
    `${ImageStreamsActions.CATEGORY} DELETE_UPLOAD`,
    props<{ payload: string, }>(),
  );
  public static deleteUploadSuccess = createAction(
    `${ImageStreamsActions.CATEGORY} DELETE_UPLOAD_SUCCESS`,
    props<{ payload: string }>(),
  );
  public static deleteUploadFailure = createAction(
    `${ImageStreamsActions.CATEGORY} DELETE_UPLOAD_FAILURE`,
    props<{ payload: any }>(),
  );

  public static setImageStreamViewTab = createAction(
    `${ImageStreamsActions.CATEGORY} SET_IMAGE_STREAM_VIEW_TAB`,
    props<{ payload: string }>(),
  );
  public static navigateToImageStreamView = createAction(
    `${ImageStreamsActions.CATEGORY} NAVIGATE_TO_IMAGE_STREAM_VIEW`,
    props<{ payload: string }>(),
  );

  public static updateImageStream = createAction(
    `${ImageStreamsActions.CATEGORY} UPDATE_IMAGE_STREAM`,
    props<{ imageStreamId: string, patch: any }>(),
  );
  public static updateImageStreamSuccess = createAction(
    `${ImageStreamsActions.CATEGORY} UPDATE_IMAGE_STREAM_SUCCESS`,
    props<{ imageStreamId: string, patch: any }>(),
  );
  public static updateImageStreamFailure = createAction(
    `${ImageStreamsActions.CATEGORY} UPDATE_IMAGE_STREAM_FAILURE`,
    props<{ imageStreamId: string, patch: any, error: string }>(),
  );

  public static generateImageStreamToken = createAction(
    `${ImageStreamsActions.CATEGORY} GENERATE_IMAGE_STREAM_TOKEN`,
    props<{ payload: string }>(),
  );
  public static generateImageStreamTokenSuccess = createAction(
    `${ImageStreamsActions.CATEGORY} GENERATE_IMAGE_STREAM_TOKEN_SUCCESS`,
    props<{ payload: string }>(),
  );
  public static generateImageStreamTokenFailure = createAction(
    `${ImageStreamsActions.CATEGORY} GENERATE_IMAGE_STREAM_TOKEN_FAILURE`,
    props<{ payload: string }>(),
  );

  public static loadImageStreamTokens = createAction(
    `${ImageStreamsActions.CATEGORY} LOAD_IMAGE_STREAM_TOKENS`,
    props<{ imageStreamId: string }>(),
  );
  public static loadImageStreamTokensSuccess = createAction(
    `${ImageStreamsActions.CATEGORY} LOAD_IMAGE_STREAM_TOKENS_SUCCESS`,
    props<{ imageStreamId: string, imageStreamTokens: any[] }>(),
  );
  public static loadImageStreamTokensFailure = createAction(
    `${ImageStreamsActions.CATEGORY} LOAD_IMAGE_STREAM_TOKENS_FAILURE`,
    props<{ imageStreamId: string }>(),
  );

}
