import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { map } from 'lodash';

import { File, FileGroup } from '@file-explorer/index';

@Component({
  selector: 'dwu-resource-selector',
  templateUrl: './resource-selector.component.html',
  styleUrls: ['./resource-selector.component.scss']
})
export class ResourceSelectorComponent {

  @Input() resources: any[];
  @Input() filterStr = '';
  @Input() selectedResourceId: any;
  @Output() selectedResourceIdChange = new EventEmitter<string>();

  @Input() isMultiSelect: boolean;
  @Input() selectedResourceIds: Set<string>;
  @Output() selectedResourceIdsChange = new EventEmitter<Set<string>>();

  public resourceIds: Set<string> = new Set<string>();
  public fileGroup: FileGroup = FileGroup.createWithRoot('ROOT');
  public readonly rootFileId = 'ROOT';

  public ngOnChanges(changes) {
    if (changes.resources) {
      this.onResourcesChanges(this.resources);
    }
    if (changes.selectedResourceId && !this.selectedResourceIds) {
      this.resourceIds = this.selectedResourceId ? new Set([this.selectedResourceId]) : new Set();
    }
    if (changes.selectedResourceIds && this.selectedResourceIds) {
      this.resourceIds = new Set(this.selectedResourceIds);
    }
  }

  public onResourcesChanges(resources) {
    const files = map(resources, (resource) => {
      return Object.assign(new File(), {
        id: resource.id,
        label: resource.label || resource.id,
      });
    });
    this.fileGroup.setRootChildren(files);
  }

  public onSelectedFileIdsChange(selectedFileIds: Set<string>) {
    if (this.isMultiSelect) {
      this.selectedResourceIdsChange.emit(selectedFileIds);
    }
    const selectedFileId = Array.from(selectedFileIds || [])[0];
    this.selectedResourceIdChange.emit(selectedFileId);
  }

}
