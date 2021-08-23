import { Component } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
} from '@angular/router';
import {
  select,
  Store,
} from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { getUser$ } from '@app/store';
import { User } from '@models/index';
import {
  getSelectedImageClassifierId$,
  ImageClassifiersActions,
} from '@pp/image-classifiers/store/index';

@Component({
  selector: 'dwu-image-classifiers',
  templateUrl: './image-classifiers.component.html',
  styleUrls: ['./image-classifiers.component.scss']
})
export class ImageClassifiersComponent {

  public user$: Observable<User>;
  public selectedImageClassifierId$: Observable<string>;

  public filterStr = '';
  public leftSideExpanded = false;
  public sub: Subscription;
  public readonly imageClassifiersConfig = {
    path: 'imageClassifiers',
  };

  constructor(
    public store: Store,
    public router: Router,
    public activatedRoute: ActivatedRoute,
  ) {
    this.user$ = this.store.pipe(select(getUser$));
    this.selectedImageClassifierId$ = this.store.pipe(select(getSelectedImageClassifierId$));
  }

  public ngOnInit() {
    this.loadInUrlState(this.router.url);
    this.sub = this.router.events.subscribe((routerEvent) => {
      if (routerEvent instanceof NavigationEnd) {
        this.loadInUrlState(routerEvent.url);
      }
    });
  }

  public ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
  }

  public onSelectedImageClassifierIdChange(selectedImageClassifierId: string) {
    const urlTree = this.router.createUrlTree([selectedImageClassifierId], { relativeTo: this.activatedRoute });
    this.store.dispatch(ImageClassifiersActions.navigateToImageClassifierView({ payload: urlTree.toString() }));
  }

  /**
   * loadInUrlState
   * @param {string} url
   */
  public loadInUrlState(url: string) {
    const urlArr = url.split('/');
    const baseIndex = urlArr.indexOf('image-classifiers');
    const idIndex = baseIndex + 1;
    const tabIndex = baseIndex + 2;

    const imageClassifierId = urlArr[idIndex] === 'intro' ? undefined : urlArr[idIndex];
    const tabName = urlArr[tabIndex];
    this.store.dispatch(ImageClassifiersActions.setSelectedImageClassifierId({ payload: imageClassifierId }));
    this.store.dispatch(ImageClassifiersActions.setImageClassifierViewTab({ payload: tabName }));
  }
}
