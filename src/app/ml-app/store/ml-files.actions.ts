import { File } from '@file-explorer/models/index';
import {
  createAction,
  props,
} from '@ngrx/store';

export class MlFilesActions {
  public static readonly CATEGORY = '[ML_FILES]';

  public static getUserFiles = createAction(
    `${MlFilesActions.CATEGORY} GET_USER_FILES`,
  );
  public static getUserFilesSuccess = createAction(
    `${MlFilesActions.CATEGORY} GET_USER_FILES_SUCCESS`,
    props<{ files: File[] }>(),
  );
  public static getUserFilesFailure = createAction(
    `${MlFilesActions.CATEGORY} GET_USER_FILES_FAILURE`,
    props<{ error: any }>(),
  );

  public static createUserFiles = createAction(
    `${MlFilesActions.CATEGORY} CREATE_USER_FILES`,
    props<{ files: File[] }>(),
  );
  public static createUserFilesSuccess = createAction(
    `${MlFilesActions.CATEGORY} CREATE_USER_FILES_SUCCESS`,
    props<{ files: File[] }>(),
  );
  public static createUserFilesFailure = createAction(
    `${MlFilesActions.CATEGORY} CREATE_USER_FILES_FAILURE`,
    props<{ error: any }>(),
  );

  public static editUserFiles = createAction(
    `${MlFilesActions.CATEGORY} EDIT_USER_FILES`,
  );
  public static editUserFilesSuccess = createAction(
    `${MlFilesActions.CATEGORY} EDIT_USER_FILES_SUCCESS`,
  );
  public static editUserFilesFailure = createAction(
    `${MlFilesActions.CATEGORY} EDIT_USER_FILES_FAILURE`,
  );

  public static deleteUserFiles = createAction(
    `${MlFilesActions.CATEGORY} DELETE_USER_FILES`,
  );
  public static deleteUserFilesSuccess = createAction(
    `${MlFilesActions.CATEGORY} DELETE_USER_FILES_SUCCESS`,
  );
  public static deleteUserFilesFailure = createAction(
    `${MlFilesActions.CATEGORY} DELETE_USER_FILES_FAILURE`,
  );








  // public static requestUserLocation = createAction(
  //   `${MlFilesActions.CATEGORY} REQUEST_USER_LOCATION`,
  // );

  // public static setUserLocation = createAction(
  //   `${MlFilesActions.CATEGORY} SET_USER_LOCATION`,
  //   props<{ locationData: LocationData }>(),
  // );

  // public static checkUserLocationPermission = createAction(
  //   `${MlFilesActions.CATEGORY} CHECK_USER_LOCATION_PERMISSION`,
  // );

  // public static setUserLocationPermission = createAction(
  //   `${MlFilesActions.CATEGORY} SET_USER_LOCATION_PERMISSION`,
  //   props<{ locationPermission: any }>(),
  // );

}
