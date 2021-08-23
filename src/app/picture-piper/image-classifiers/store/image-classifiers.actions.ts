import {
  createAction,
  props,
} from '@ngrx/store';

export class ImageClassifiersActions {
  public static readonly CATEGORY = '[IMAGE_CLASSIFIERS]';

  public static setSelectedImageClassifierId = createAction(
    `${ImageClassifiersActions.CATEGORY} SET_SELECTED_IMAGE_CLASSIFIER_ID`,
    props<{ payload: string }>(),
  );
  public static loadImagesByClassifierId = createAction(
    `${ImageClassifiersActions.CATEGORY} LOAD_IMAGES_BY_CLASSIFIER_ID`,
    props<{ payload: string }>(),
  );
  public static addImagesByClassifierId = createAction(
    `${ImageClassifiersActions.CATEGORY} ADD_IMAGES_BY_CLASSIFIER_ID`,
    props<{ payload: Record<string, any[]> }>(),
  );

  public static uploadImageClassifierFile = createAction(
    `${ImageClassifiersActions.CATEGORY} UPLOAD_IMAGE_CLASSIFIER_FILE`,
    props<{ selectedImageClassifierId: string, file: File }>(),
  );
  public static uploadImageClassifierFileSuccess = createAction(
    `${ImageClassifiersActions.CATEGORY} UPLOAD_IMAGE_CLASSIFIER_FILE_SUCCESS`,
    props<{ selectedImageClassifierId: string }>(),
  );
  public static uploadImageClassifierFileFailure = createAction(
    `${ImageClassifiersActions.CATEGORY} UPLOAD_IMAGE_CLASSIFIER_FILE_FAILURE`,
    props<{ payload: any }>(),
  );

  public static deleteUpload = createAction(
    `${ImageClassifiersActions.CATEGORY} DELETE_UPLOAD`,
    props<{ payload: string, }>(),
  );
  public static deleteUploadSuccess = createAction(
    `${ImageClassifiersActions.CATEGORY} DELETE_UPLOAD_SUCCESS`,
    props<{ payload: string }>(),
  );
  public static deleteUploadFailure = createAction(
    `${ImageClassifiersActions.CATEGORY} DELETE_UPLOAD_FAILURE`,
    props<{ payload: any }>(),
  );

  public static setImageClassifierViewTab = createAction(
    `${ImageClassifiersActions.CATEGORY} SET_IMAGE_CLASSIFIER_VIEW_TAB`,
    props<{ payload: string }>(),
  );
  public static navigateToImageClassifierView = createAction(
    `${ImageClassifiersActions.CATEGORY} NAVIGATE_TO_IMAGE_CLASSIFIER_VIEW`,
    props<{ payload: string }>(),
  );

  public static updateImageClassifier = createAction(
    `${ImageClassifiersActions.CATEGORY} UPDATE_IMAGE_CLASSIFIER`,
    props<{ imageClassifierId: string, patch: any }>(),
  );
  public static updateImageClassifierSuccess = createAction(
    `${ImageClassifiersActions.CATEGORY} UPDATE_IMAGE_CLASSIFIER_SUCCESS`,
    props<{ imageClassifierId: string, patch: any }>(),
  );
  public static updateImageClassifierFailure = createAction(
    `${ImageClassifiersActions.CATEGORY} UPDATE_IMAGE_CLASSIFIER_FAILURE`,
    props<{ imageClassifierId: string, patch: any, error: string }>(),
  );

  public static loadImageClassifierTokens = createAction(
    `${ImageClassifiersActions.CATEGORY} LOAD_IMAGE_CLASSIFIER_TOKENS`,
    props<{ imageClassifierId: string }>(),
  );
  public static loadImageClassifierTokensSuccess = createAction(
    `${ImageClassifiersActions.CATEGORY} LOAD_IMAGE_CLASSIFIER_TOKENS_SUCCESS`,
    props<{ imageClassifierId: string, imageClassifierTokens: any[] }>(),
  );
  public static loadImageClassifierTokensFailure = createAction(
    `${ImageClassifiersActions.CATEGORY} LOAD_IMAGE_CLASSIFIER_TOKENS_FAILURE`,
    props<{ imageClassifierId: string }>(),
  );

}
