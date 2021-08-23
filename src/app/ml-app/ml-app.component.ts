import { Component } from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { getUser$ } from '@app/store';
// import { FirebaseAuthService } from '@services/index';
import { File, FileGroup } from '@file-explorer/index';
import { MlFilesActions } from '@ml-app/store/index';
import { User } from '@models/index';

@Component({
  selector: 'ml-app',
  templateUrl: './ml-app.component.html',
  styleUrls: ['./ml-app.component.scss']
})
export class MlAppComponent {

  public user$: Observable<User>;
  public filesById: Record<string, File> = {};
  public fileGroup: FileGroup = new FileGroup();
  public filterStr = '';
  public selectedFileId: string;

  constructor(
    public store: Store,
    // public firebaseAuthService: FirebaseAuthService,
    public router: Router,
    public route: ActivatedRoute,
  ) {
    this.user$ = this.store.pipe(select(getUser$));
    this.store.dispatch(MlFilesActions.getUserFiles());
    // this.populateFileGroup();


    // this.store.dispatch(MlFilesActions.createUserFiles({
    //   files: values(this.fileGroup.filesById),
    // }))
    // this.route.queryParams.subscribe((queryParams: Params) => {
    //   if (queryParams.selectedFileId) {
    //     this.fileGroup.setSelectedFileIds(new Set([queryParams.selectedFileId]));
    //     this.selectedFileId = this.fileGroup.getSelectedFileId();
    //   }
    // })
    // this.router.events.subscribe((routerEvent) => {
    //   if (routerEvent instanceof NavigationEnd) {
    //     console.log('routerEvent', routerEvent)
    //     const activatedChild = routerEvent.urlAfterRedirects.split('/')[2];
    //     this.fileGroup.setSelectedFileIds(new Set([activatedChild]));
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

  // public onSelectedFileIdsChange(fileIds) {
  //   const selectedFileId = Array.from(fileIds)[0];
  //   if (selectedFileId) {
  //     this.router.navigate([], {
  //       relativeTo: this.route,
  //       queryParams: { selectedFileId },
  //     });
  //   }
  // }

}
