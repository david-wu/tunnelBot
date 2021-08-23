import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ResourceCreateButtonComponent } from '@pp/common/resource-create-button/resource-create-button.component';
// import { SearchInputModule } from '@src/app/common/search-input/search-input.module';
// import { ResourceSelectorModule } from '@pp/common/resource-selector/resource-selector.module';

@NgModule({
  imports: [
    CommonModule,
    // ResourceSelectorModule,
    // SearchInputModule,
  ],
  declarations: [
    ResourceCreateButtonComponent,
  ],
  exports: [
    ResourceCreateButtonComponent,
  ],
})
export class ResourceCreateButtonModule { }
