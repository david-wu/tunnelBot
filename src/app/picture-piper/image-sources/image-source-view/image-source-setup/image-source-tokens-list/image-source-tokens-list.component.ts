import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { File, FileGroup } from '@file-explorer/index';
import {
  select,
  Store,
} from '@ngrx/store';
import {
  // getSelectedImageSourceId$,
  getImageSourceTokensByImageSource$,
  // getImagesBySourceId$,
  ImageSourcesActions,
} from '@pp/image-sources/store/index';
import { keyBy } from 'lodash';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'dwu-image-source-tokens-list',
  templateUrl: './image-source-tokens-list.component.html',
  styleUrls: ['./image-source-tokens-list.component.scss']
})
export class ImageSourceTokensListComponent {

  @Input() imageSourceId: string;
  @Input() filterStr: string;
  @Output() selectToken = new EventEmitter<any>();

  public imageTokens$: Observable<any[]>;
  public imageTokensById: any;
  public fileGroup: FileGroup = FileGroup.createWithRoot('ROOT');
  public selectedFileIds = new Set<string>();
  public readonly rootFileId = 'ROOT';
  private imageSourceId$ = new BehaviorSubject<string>(undefined);
  public subs;

  constructor(public store: Store) {
    this.imageTokens$ = combineLatest(
      this.store.pipe(select(getImageSourceTokensByImageSource$)),
      this.imageSourceId$,
    ).pipe(
      map(([tokensById, id]: [Record<string, any[]>, string]) => tokensById[id] || []),
    );
  }

  public ngOnInit() {
    this.subs = [
      this.imageTokens$.subscribe((imageTokens: any[]) => {
        this.imageTokensById = keyBy(imageTokens, 'id');
        const files = (imageTokens || []).map((imageToken) => {
          return Object.assign(new File(), {
            id: imageToken.id,
            label: this.getTokenLabel(imageToken),
          });
        });
        this.fileGroup.setRootChildren(files);
      }),
    ];
  }

  public ngOnDestroy() {
    (this.subs || []).forEach((sub) => sub.unsubscribe());
  }

  public ngOnChanges(changes) {
    if (changes.imageSourceId) {
      this.store.dispatch(ImageSourcesActions.loadImageSourceTokens({ imageSourceId: this.imageSourceId }));
      this.imageSourceId$.next(this.imageSourceId);
    }
  }

  public getTokenLabel(token) {
    return token.label || token.value.slice(0, 6);
  }

  public onSelectedFileIds(ids: Set<string>) {
    this.selectedFileIds = ids;
    const selectedTokenId = Array.from(ids || [])[0];
    this.selectToken.emit(this.imageTokensById[selectedTokenId]);
  }

}
