import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { UserLoginModule } from '@app/user-login/user-login.module';
import { PicturePiperComponent } from '@pp/picture-piper.component';
import { PicturePiperRoutingModule } from '@pp/picture-piper.routes';
import { PICTURE_PIPER_SERVICES } from '@pp/services';
import {
  PicturePiperEffects,
  picturePiperReducer,
} from '@pp/store/index';

@NgModule({
  imports: [
    CommonModule,
    PicturePiperRoutingModule,
    UserLoginModule,
    StoreModule.forFeature('picturePiper', picturePiperReducer),
    EffectsModule.forFeature([PicturePiperEffects]),
  ],
  declarations: [
    PicturePiperComponent,
  ],
  exports: [
    PicturePiperComponent,
  ],
  providers: [
    ...PICTURE_PIPER_SERVICES,
  ],
})
export class PicturePiperModule { }
