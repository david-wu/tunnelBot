import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// import { CodeSnippetModule } from '@common/code-snippet/code-snippet.module';
import { ImageStreamsIntroComponent } from '@pp/common/image-streams-intro/image-streams-intro.component';
import { ImageStreamsIntroRoutingModule } from '@pp/common/image-streams-intro/image-streams-intro.routes';
// import { FileUploaderModule } from '@common/file-uploader/file-uploader.module';

@NgModule({
  imports: [
    CommonModule,
    ImageStreamsIntroRoutingModule,
    // CodeSnippetModule,
    // FileUploaderModule,
  ],
  declarations: [
    ImageStreamsIntroComponent,
  ],
  exports: [
    ImageStreamsIntroComponent,
  ],
})
export class ImageStreamsIntroModule { }
