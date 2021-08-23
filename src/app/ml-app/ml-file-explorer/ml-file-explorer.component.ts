import { Component } from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  select,
  Store,
} from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  getFilesById$,
  // getMlFilesState$,
} from '@app/ml-app/store/index';
import { File, FileGroup } from '@file-explorer/index';

@Component({
  selector: 'dwu-ml-file-explorer',
  templateUrl: './ml-file-explorer.component.html',
  styleUrls: ['./ml-file-explorer.component.scss']
})
export class MlFileExplorerComponent {

  public filesById: Record<string, File> = {};
  public filesByLabel: Record<string, File> = {};
  public fileGroup: FileGroup = new FileGroup();
  public filterStr = '';
  public selectedFileId: string;

  public filesById$: Observable<Record<string, File>>;
  public rootId = 'ROOT';

  constructor(
    public store: Store,
    public router: Router,
    public route: ActivatedRoute,
  ) {
    this.filesById$ = this.store.pipe(select(getFilesById$));
    // console.log('this.filesById$', this.filesById$)
    this.filesById$.subscribe(console.log);
    // this.populateFileGroup();
    // this.route.queryParams.subscribe((queryParams: Params) => {
    //   if (queryParams.selectedFileId) {
    //     this.fileGroup.setSelectedFileIds(new Set([queryParams.selectedFileId]));
    //     this.selectedFileId = this.fileGroup.getSelectedFileId();
    //   }
    // })
  }

  // public populateFileGroup() {
  //   const fileDataById = {
  //     id: 'ROOT',
  //     childrenById: {
  //       PROJECT_1: {
  //         label: 'Apparel',
  //         childrenById: {
  //           UPLOAD_IMAGES: {
  //             label: 'Staging Area',
  //           },
  //           CLASSIFICATIONS: {
  //             label: 'Classifications',
  //             childrenById: {
  //               T_SHIRTS: { label: 't shirts' },
  //               SHORTS: { label: 'shorts' },
  //               SOCKS: { label: 'socks' },
  //             }
  //           },
  //         },
  //       },
  //     }
  //   };

  //   const files = this.fileGroup.filesByIdFromJson(fileDataById);
  //   this.filesById = keyBy(files, 'id');
  //   this.fileGroup.setRootFile(this.filesById.ROOT);
  // }

  // public getSelectedFileId() {
  //   const selectedFileIds = Array.from(this.fileGroup.selectedFileIds || [])
  //   return (selectedFileIds.length === 1) && selectedFileIds[0];
  // }

  public onSelectedFileIdsChange(fileIds: Set<string>) {
    console.log('onSelectedFileIdsChange', fileIds);
    const selectedFileId = Array.from(fileIds)[0];
    // this.selectedFileId = selectedFileId;
    this.fileGroup.setSelectedFileIds(new Set([selectedFileId]));
    // if (selectedFileId) {
    //   this.router.navigate([], {
    //     relativeTo: this.route,
    //     queryParams: { selectedFileId },
    //   });
    // }
  }

}
