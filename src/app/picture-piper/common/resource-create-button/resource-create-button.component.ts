import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import {
  select,
  Store,
} from '@ngrx/store';


import { File, FileGroup } from '@file-explorer/index';
import {
  getResourceLists$,
  PicturePiperActions,
} from '@pp/store';

@Component({
  selector: 'dwu-resource-create-button',
  templateUrl: './resource-create-button.component.html',
  styleUrls: ['./resource-create-button.component.scss']
})
export class ResourceCreateButtonComponent {

  @Input() resourceConfig: any;
  @Input() buttonLabel: any = "++";

  constructor(public store: Store) {}

  public onCreateResource() {
    this.store.dispatch(PicturePiperActions.createResourceDoc({
      resource: this.resourceConfig,
      patch: {},
    }));
  }
}
