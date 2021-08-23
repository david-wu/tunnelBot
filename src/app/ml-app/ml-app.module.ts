import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { MlFileExplorerComponent } from '@app/ml-app/ml-file-explorer/ml-file-explorer.component';
import { UserLoginModule } from '@app/user-login/user-login.module';
import { FileUploaderModule } from '@common/file-uploader/file-uploader.module';
import { SearchInputModule } from '@common/search-input/search-input.module';
import { FileExplorerModule } from '@file-explorer/file-explorer.module';
import {
  MlFilesEffects,
  mlFilesReducer,
} from '@ml-app/store/index';
import { CommonModule as MyCommonModule } from '@src/app/common/common.module';
import { MlAppComponent } from '@src/app/ml-app/ml-app.component';
import { MlAppRoutingModule } from '@src/app/ml-app/ml-app.routes';
import { MlUploadImagesComponent } from '@src/app/ml-app/ml-upload-images/ml-upload-images.component';

const COMPONENTS = [
  MlUploadImagesComponent,
  MlAppComponent,
  MlFileExplorerComponent,
];

@NgModule({
  imports: [
    FileUploaderModule,
    MlAppRoutingModule,
    SearchInputModule,
    UserLoginModule,
    CommonModule,
    MyCommonModule,
    FileExplorerModule,
    StoreModule.forFeature('mlFiles', mlFilesReducer),
    EffectsModule.forFeature([MlFilesEffects]),
  ],
  providers: [],
  declarations: [
    ...COMPONENTS,
  ],
})
export class MlAppModule { }
