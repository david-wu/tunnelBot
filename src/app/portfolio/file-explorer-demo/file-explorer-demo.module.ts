import { CommonModule as NgCommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CodeSnippetModule } from '@common/code-snippet/code-snippet.module';
import { FileExplorerModule } from '@common/file-explorer/file-explorer.module';
import { TooltipModule } from '@common/tooltip/tooltip.module';
import { FileExplorerDemoComponent } from '@src/app/portfolio/file-explorer-demo/file-explorer-demo.component';

@NgModule({
  imports: [
    NgCommonModule,
    TooltipModule,
    FormsModule,
    CodeSnippetModule,
    FileExplorerModule,
  ],
  declarations: [
    FileExplorerDemoComponent,
  ],
  exports: [
    FileExplorerDemoComponent,
  ],
})
export class FileExplorerDemoModule { }
