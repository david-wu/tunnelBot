import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SearchInputModule } from '@app/common/search-input/search-input.module';
// import { ResourceSelectorModule } from '@pp/common/resource-selector/resource-selector.module';
import { ImageStreamSettingsEditorComponent } from '@pp/image-streams/image-stream-view/image-stream-settings/image-stream-settings-editor/image-stream-settings-editor.component';
import { ImageStreamSettingsComponent } from '@pp/image-streams/image-stream-view/image-stream-settings/image-stream-settings.component';
import { ImageStreamSettingsRoutingModule } from '@pp/image-streams/image-stream-view/image-stream-settings/image-stream-settings.routes';

import { ResourceListViewModule } from '@pp/common/resource-list-view/resource-list-view.module';

@NgModule({
  imports: [
    CommonModule,
    ImageStreamSettingsRoutingModule,
    ResourceListViewModule,
    SearchInputModule,
    // ResourceSelectorModule,
  ],
  declarations: [
    ImageStreamSettingsComponent,
    ImageStreamSettingsEditorComponent,
  ],
  exports: [
    ImageStreamSettingsComponent,
    ImageStreamSettingsEditorComponent,
  ],
})
export class ImageStreamSettingsModule { }
