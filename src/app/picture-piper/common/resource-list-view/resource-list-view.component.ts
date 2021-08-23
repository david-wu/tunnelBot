import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
// import { map } from 'lodash';
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
  selector: 'dwu-resource-list-view',
  templateUrl: './resource-list-view.component.html',
  styleUrls: ['./resource-list-view.component.scss']
})
export class ResourceListViewComponent {

  @Input() resourceConfig: any;
  @Input() filterStr = '';
  @Input() selectedResourceId: any;
  @Output() selectedResourceIdChange = new EventEmitter<string>();
  @Input() isMultiSelect: boolean;
  @Input() selectedResourceIds: Set<string>;
  @Output() selectedResourceIdsChange = new EventEmitter<Set<string>>();

  public resourceList$: any;
  public resourceConfig$ = new BehaviorSubject<any>(undefined);

  constructor(public store: Store) {
    this.resourceList$ = this.resourceConfig$.pipe(
      switchMap((resourceConfig)=> {
        return this.store.pipe(
          select(getResourceLists$),
          map((resourceLists) => resourceLists && resourceLists[resourceConfig.path]),
        );
      })
    )
  }

  public ngOnChanges(changes) {
    if (changes.resourceConfig) {
      this.resourceConfig$.next(this.resourceConfig);
      const { currentValue, previousValue } = changes.resourceConfig;
      if (currentValue) {
        this.store.dispatch(PicturePiperActions.addVisibleResourceList({
          resource: currentValue,
        }));
      }
      if (previousValue) {
        this.store.dispatch(PicturePiperActions.removeVisibleResourceList({
          resource: previousValue,
        }));
      }
    }
  }

  public ngOnDestroy() {
    if (this.resourceConfig) {
      this.store.dispatch(PicturePiperActions.removeVisibleResourceList({
        resource: this.resourceConfig,
      }));
    }
  }

  public onSelectedImageSourceIdChange(id) {
    this.selectedResourceIdChange.emit(id);
  }

  public onSelectedResourceIdsChange(ids) {
    this.selectedResourceIdsChange.emit(ids);
  }

}
