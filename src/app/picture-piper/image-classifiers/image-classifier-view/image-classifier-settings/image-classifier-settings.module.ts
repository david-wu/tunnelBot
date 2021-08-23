import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SearchInputModule } from '@app/common/search-input/search-input.module';
// import { ResourceSelectorModule } from '@pp/common/resource-selector/resource-selector.module';
import { ImageClassifierSettingsEditorComponent } from '@pp/image-classifiers/image-classifier-view/image-classifier-settings/image-classifier-settings-editor/image-classifier-settings-editor.component';
import { ImageClassifierSettingsComponent } from '@pp/image-classifiers/image-classifier-view/image-classifier-settings/image-classifier-settings.component';
import { ImageClassifierSettingsRoutingModule } from '@pp/image-classifiers/image-classifier-view/image-classifier-settings/image-classifier-settings.routes';

import { ResourceListViewModule } from '@pp/common/resource-list-view/resource-list-view.module';

@NgModule({
  imports: [
    CommonModule,
    ImageClassifierSettingsRoutingModule,
    ResourceListViewModule,
    SearchInputModule,
    // ResourceSelectorModule,
  ],
  declarations: [
    ImageClassifierSettingsComponent,
    ImageClassifierSettingsEditorComponent,
  ],
  exports: [
    ImageClassifierSettingsComponent,
    ImageClassifierSettingsEditorComponent,
  ],
})
export class ImageClassifierSettingsModule { }
