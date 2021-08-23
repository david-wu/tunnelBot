import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SearchInputModule } from '@app/common/search-input/search-input.module';
// import { ResourceSelectorModule } from '@pp/common/resource-selector/resource-selector.module';
import { ImageStreamClassifiersEditorComponent } from '@pp/image-streams/image-stream-view/image-stream-classifiers/image-stream-classifiers-editor/image-stream-classifiers-editor.component';
import { ImageStreamClassifiersComponent } from '@pp/image-streams/image-stream-view/image-stream-classifiers/image-stream-classifiers.component';
import { ImageStreamClassifiersRoutingModule } from '@pp/image-streams/image-stream-view/image-stream-classifiers/image-stream-classifiers.routes';

import { ResourceListViewModule } from '@pp/common/resource-list-view/resource-list-view.module';

@NgModule({
  imports: [
    CommonModule,
    ImageStreamClassifiersRoutingModule,
    ResourceListViewModule,
    SearchInputModule,
    // ResourceSelectorModule,
  ],
  declarations: [
    ImageStreamClassifiersComponent,
    ImageStreamClassifiersEditorComponent,
  ],
  exports: [
    ImageStreamClassifiersComponent,
    ImageStreamClassifiersEditorComponent,
  ],
})
export class ImageStreamClassifiersModule { }
