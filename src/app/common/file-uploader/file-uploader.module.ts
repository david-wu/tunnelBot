import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// import { FirebaseAuthModule } from '@src/app/firebase-auth/firebase-auth.module';
import { FileUploaderComponent } from '@common/file-uploader/file-uploader.component';
import { FirebaseStorageService } from '@services/firebase-storage.service';

@NgModule({
  declarations: [
    FileUploaderComponent,
  ],
  imports: [
    CommonModule,
    // FirebaseAuthModule,
  ],
  exports: [
    FileUploaderComponent,
  ],
  providers: [
    FirebaseStorageService,
  ],
})
export class FileUploaderModule { }
