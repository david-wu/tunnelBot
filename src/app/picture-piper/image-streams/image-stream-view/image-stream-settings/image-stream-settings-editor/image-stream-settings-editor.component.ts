import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  select,
  Store,
} from '@ngrx/store';
import {
  getResourceLists$,
  PicturePiperActions,
} from '@pp/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'dwu-image-stream-settings-editor',
  templateUrl: './image-stream-settings-editor.component.html',
  styleUrls: ['./image-stream-settings-editor.component.scss']
})
export class ImageStreamSettingsEditorComponent {
  @Input() imageStream: any;
  @Output() onSave = new EventEmitter();

  public imageSourcesFilterStr = '';
  public classifiersFilterStr = '';
  public selectedImageSourceIds = new Set();
  public selectedClassifierIds = new Set();
  public editImageSourceIds = new Set();
  public editClassifierIds = new Set();
  public isEditing = false;

  public readonly imageSourcesConfig = {
    path: 'imageSources',
  }
  public readonly classifiersConfig = {
    path: 'classifiers',
  }

  constructor(public store: Store) {}

  public ngOnChanges(changes) {
    if (changes.imageStream) {
      this.stopEdit();
      if (!changes.imageStream.firstChange) {
        this.unwatchData();
      }
      this.watchData();
      this.selectedImageSourceIds = new Set(this.imageStream.sourceIds || []);
      this.selectedClassifierIds = new Set(this.imageStream.classifierIds || []);
    }
  }

  public startEdit() {
    this.isEditing = true;
    this.editImageSourceIds = new Set(this.selectedImageSourceIds);
    this.editClassifierIds = new Set(this.selectedClassifierIds);
  }

  public save() {
    this.isEditing = false;
    const patch = {
      sourceIds: new Set(),
      classifierIds: new Set(),
    };
    this.onSave.emit({
      sourceIds: Array.from(this.editImageSourceIds || []).sort(),
      classifierIds: Array.from(this.editClassifierIds || []).sort(),
    });
  }


  public stopEdit() {
    this.isEditing = false;
    this.editImageSourceIds = new Set(this.selectedImageSourceIds);
    this.editClassifierIds = new Set(this.selectedClassifierIds);
  }

  public watchData() {
    // this.store.dispatch(PicturePiperActions.addVisibleResourceDoc({
    //   resource: {
    //     path: `imageStreams/${this.imageStream.id}`,
    //   },
    // }));
  }

  public unwatchData() {
    // this.store.dispatch(PicturePiperActions.removeVisibleResourceDoc({
    //   resource: {
    //     path: `imageStreams/${this.imageStream.id}`,
    //   },
    // }));
  }

  public onSelectedImageSourceIdsChange(selectedImageSourceIds: Set<string>) {
    this.editImageSourceIds = selectedImageSourceIds;
  }

  public onSelectedClassifierIdsChange(selectedClassifierIds: Set<string>) {
    this.editClassifierIds = selectedClassifierIds;
  }
}
