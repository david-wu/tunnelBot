import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UserLoginSuccessComponent } from '@app/user-login/user-login-success/user-login-success.component';
import { UserLoginComponent } from '@app/user-login/user-login.component';
import { UserLoginRoutingModule } from '@app/user-login/user-login.routes';
import {
  FirebaseAuthService,
  FirebaseFirestoreService,
} from '@services/index';

@NgModule({
  declarations: [
    UserLoginComponent,
    UserLoginSuccessComponent,
  ],
  imports: [
    CommonModule,
    UserLoginRoutingModule,
  ],
  exports: [
    UserLoginComponent,
    UserLoginSuccessComponent,
  ],
  providers: [
    FirebaseAuthService,
    FirebaseFirestoreService,
  ],
})
export class UserLoginModule { }
