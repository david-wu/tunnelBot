import {
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  select,
  Store,
} from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  AuthActions,
  getAuthLoading$,
  getCanLogin$,
  getUser$,
} from '@app/store/index';
import { User } from '@models/index';

declare global {
  interface Window {
    firebase: any;
    firebaseui: any;
  }
}

@Component({
  selector: 'dwu-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent {

  @ViewChild('loginRef', { static: true }) loginRef: ElementRef;

  public user$: Observable<User>;
  public authLoading$: Observable<boolean>;
  public canLogin$: Observable<boolean>;

  constructor(
    public store: Store<any>,
    public hostEl: ElementRef,
  ) {
    this.user$ = this.store.pipe(select(getUser$));
    this.authLoading$ = this.store.pipe(select(getAuthLoading$));
    this.canLogin$ = this.store.pipe(select(getCanLogin$));
  }

  public ngOnInit() {
    this.store.dispatch(AuthActions.renderLogin({
      nativeEl: this.loginRef.nativeElement
    }));
  }

  public signOut() {
    this.store.dispatch(AuthActions.signOut({
      nativeEl: this.loginRef.nativeElement,
    }));
  }
}
