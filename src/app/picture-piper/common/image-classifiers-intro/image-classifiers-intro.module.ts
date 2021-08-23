import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// import { CodeSnippetModule } from '@common/code-snippet/code-snippet.module';
import { ImageClassifiersIntroComponent } from '@pp/common/image-classifiers-intro/image-classifiers-intro.component';
import { ImageClassifiersIntroRoutingModule } from '@pp/common/image-classifiers-intro/image-classifiers-intro.routes';
// import { FileUploaderModule } from '@common/file-uploader/file-uploader.module';

@NgModule({
  imports: [
    CommonModule,
    ImageClassifiersIntroRoutingModule,
    // CodeSnippetModule,
    // FileUploaderModule,
  ],
  declarations: [
    ImageClassifiersIntroComponent,
  ],
  exports: [
    ImageClassifiersIntroComponent,
  ],
})
export class ImageClassifiersIntroModule { }
