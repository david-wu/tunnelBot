import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { CommonModule as MyCommonModule } from '@src/app/common/common.module';
import { FileExplorerModule } from '@file-explorer/file-explorer.module';
import { FileUploaderModule } from '@common/file-uploader/file-uploader.module';
import { UserLoginModule } from '@app/user-login/user-login.module';
import { MlAppComponent } from '@src/app/ml-app/ml-app.component';
import { MlUploadImagesComponent } from '@src/app/ml-app/ml-upload-images/ml-upload-images.component';
import { MlFileExplorerComponent } from '@app/ml-app/ml-file-explorer/ml-file-explorer.component';
import { MlAppRoutingModule } from '@src/app/ml-app/ml-app.routes';
import {
  MlFilesEffects,
  mlFilesReducer,
} from '@ml-app/store/index';

const COMPONENTS = [
  MlUploadImagesComponent,
  MlAppComponent,
  MlFileExplorerComponent,
];

@NgModule({
  imports: [
    FileUploaderModule,
    MlAppRoutingModule,
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
