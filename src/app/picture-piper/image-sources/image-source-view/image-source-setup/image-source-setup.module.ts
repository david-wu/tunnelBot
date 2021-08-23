import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CodeSnippetModule } from '@common/code-snippet/code-snippet.module';
import { FileExplorerModule } from '@file-explorer/file-explorer.module';
import { ImageSourceSetupComponent } from '@pp/image-sources/image-source-view/image-source-setup/image-source-setup.component';
import { ImageSourceSetupRoutingModule } from '@pp/image-sources/image-source-view/image-source-setup/image-source-setup.routes';
import { ImageSourceTokensListComponent } from '@pp/image-sources/image-source-view/image-source-setup/image-source-tokens-list/image-source-tokens-list.component';
import { SearchInputModule } from '@src/app/common/search-input/search-input.module';

@NgModule({
  imports: [
    CommonModule,
    CodeSnippetModule,
    FileExplorerModule,
    SearchInputModule,
    ImageSourceSetupRoutingModule,
  ],
  declarations: [
    ImageSourceSetupComponent,
    ImageSourceTokensListComponent,
  ],
  exports: [
    ImageSourceSetupComponent,
    ImageSourceTokensListComponent,
  ],
})
export class ImageSourceSetupModule { }
