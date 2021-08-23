import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ResourceListViewComponent } from '@pp/common/resource-list-view/resource-list-view.component';
import { SearchInputModule } from '@src/app/common/search-input/search-input.module';
import { ResourceSelectorModule } from '@pp/common/resource-selector/resource-selector.module';

@NgModule({
  imports: [
    CommonModule,
    ResourceSelectorModule,
    SearchInputModule,
  ],
  declarations: [
    ResourceListViewComponent,
  ],
  exports: [
    ResourceListViewComponent,
  ],
})
export class ResourceListViewModule { }
