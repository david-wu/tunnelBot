import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginComponent } from '@app/user-login/user-login.component';

const routes: Routes = [
  {
    path: 'auth',
    component: UserLoginComponent
  },
  {
    path: 'auth-success',
    component: UserLoginComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserLoginRoutingModule { }
