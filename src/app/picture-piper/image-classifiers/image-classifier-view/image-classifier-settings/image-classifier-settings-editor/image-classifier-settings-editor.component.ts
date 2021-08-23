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
  selector: 'dwu-image-classifier-settings-editor',
  templateUrl: './image-classifier-settings-editor.component.html',
  styleUrls: ['./image-classifier-settings-editor.component.scss']
})
export class ImageClassifierSettingsEditorComponent {
  @Input() imageClassifier: any;
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
    if (changes.imageClassifier) {
      this.stopEdit();
      if (!changes.imageClassifier.firstChange) {
        this.unwatchData();
      }
      this.watchData();
      this.selectedImageSourceIds = new Set(this.imageClassifier.sourceIds || []);
      this.selectedClassifierIds = new Set(this.imageClassifier.classifierIds || []);
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
    //     path: `imageClassifiers/${this.imageClassifier.id}`,
    //   },
    // }));
  }

  public unwatchData() {
    // this.store.dispatch(PicturePiperActions.removeVisibleResourceDoc({
    //   resource: {
    //     path: `imageClassifiers/${this.imageClassifier.id}`,
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
