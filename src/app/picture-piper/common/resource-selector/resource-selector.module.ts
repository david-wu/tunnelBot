import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FileExplorerModule } from '@file-explorer/file-explorer.module';
import { ResourceSelectorComponent } from '@pp/common/resource-selector/resource-selector.component';

@NgModule({
  imports: [
    CommonModule,
    FileExplorerModule,
  ],
  declarations: [
    ResourceSelectorComponent,
  ],
  exports: [
    ResourceSelectorComponent,
  ],
})
export class ResourceSelectorModule { }
