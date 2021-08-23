import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// import { CodeSnippetModule } from '@common/code-snippet/code-snippet.module';
import { ImageSourcesIntroComponent } from '@pp/common/image-sources-intro/image-sources-intro.component';
import { ImageSourcesIntroRoutingModule } from '@pp/common/image-sources-intro/image-sources-intro.routes';
// import { FileUploaderModule } from '@common/file-uploader/file-uploader.module';

@NgModule({
  imports: [
    CommonModule,
    ImageSourcesIntroRoutingModule,
    // CodeSnippetModule,
    // FileUploaderModule,
  ],
  declarations: [
    ImageSourcesIntroComponent,
  ],
  exports: [
    ImageSourcesIntroComponent,
  ],
})
export class ImageSourcesIntroModule { }
