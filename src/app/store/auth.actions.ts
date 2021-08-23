import { User } from '@models/index';
import {
  createAction,
  props,
} from '@ngrx/store';

export class AuthActions {
  public static readonly CATEGORY = '[AUTH]';

  public static linkFirebaseAuth = createAction(
    `${AuthActions.CATEGORY} LINK_FIREBASE_AUTH`,
  );

  public static setUser = createAction(
    `${AuthActions.CATEGORY} SET_USER`,
    props<{ payload: User }>(),
  );

  public static renderLogin = createAction(
    `${AuthActions.CATEGORY} RENDER_LOGIN`,
    props<{ nativeEl: HTMLElement }>(),
  );

  public static signOut = createAction(
    `${AuthActions.CATEGORY} SIGN_OUT`,
    props<{ nativeEl: HTMLElement }>(),
  );

  // public static getUserFilesSuccess = createAction(
  //   `${AuthActions.CATEGORY} GET_USER_FILES_SUCCESS`,
  // );
  // public static getUserFilesFailure = createAction(
  //   `${AuthActions.CATEGORY} GET_USER_FILES_FAILURE`,
  // );

}
