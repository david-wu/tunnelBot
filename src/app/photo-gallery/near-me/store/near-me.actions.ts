import {
  createAction,
  props,
} from '@ngrx/store';

export class NearMeActions {
  public static readonly CATEGORY = '[NEAR_ME]'

  public static loadNearMe = createAction(
      `${NearMeActions.CATEGORY} LOAD_NEAR_ME`,
      props<{}>(),
  );
}