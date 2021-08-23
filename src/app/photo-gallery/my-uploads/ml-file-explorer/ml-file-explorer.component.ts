import { Component } from '@angular/core';
import { keyBy } from 'lodash';
import {
  NavigationEnd,
  Params,
} from '@angular/router';
import { Observable } from 'rxjs';
import {
  select,
  Store,
} from '@ngrx/store';

import { FileGroup, FileType, File } from '@file-explorer/index';
import {
  getFilesById$,
  // getMlFilesState$,
} from '@app/ml-app/store/index';

@Component({
  selector: 'dwu-ml-file-explorer',
  templateUrl: './ml-file-explorer.component.html',
  styleUrls: ['./ml-file-explorer.component.scss']
})
export class MlFileExplorerComponent {

  public filesById: Record<string, File> = {};
  public filesByLabel: Record<string, File> = {};
  public fileGroup: FileGroup = new FileGroup();
  public filterStr: string = '';
  public selectedFileId: string;

  public filesById$: Observable<Record<string, File>>;
  public rootId: string = 'ROOT';

  constructor(
    public store: Store,
  ) {
    this.filesById$ = this.store.pipe(select(getFilesById$));
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

  public onSelectedFileIdsChange(fileIds) {
    console.log('onSelectedFileIdsChange', fileIds);
    const selectedFileId = Array.from(fileIds)[0];
    // if (selectedFileId) {
    //   this.router.navigate([], {
    //     relativeTo: this.route,
    //     queryParams: { selectedFileId },
    //   });
    // }
  }

}
