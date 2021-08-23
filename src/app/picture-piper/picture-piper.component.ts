import { Component } from '@angular/core';
import {
  select,
  Store,
} from '@ngrx/store';
import { Observable } from 'rxjs';

import { getUser$ } from '@app/store';
import { User } from '@models/index';

@Component({
  selector: 'dwu-picture-piper',
  templateUrl: './picture-piper.component.html',
  styleUrls: ['./picture-piper.component.scss']
})
export class PicturePiperComponent {

  public user$: Observable<User>;

  constructor(public store: Store) {
    this.user$ = this.store.pipe(select(getUser$));
  }
}
