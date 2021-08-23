import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';

@Component({
    selector: 'dwu-zoom-level-picker',
    templateUrl: './zoom-level-picker.component.html',
    styleUrls: ['./zoom-level-picker.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZoomLevelPickerComponent {
  @Input() zoomLevel: number;
  @Output() zoomLevelChange: EventEmitter<number> = new EventEmitter<number>();
  @Input() minZoomLevel = 1;
  @Input() maxZoomLevel = 6;


  public zoomIn() {
    this.zoomLevel = Math.max(this.minZoomLevel, this.zoomLevel - 1);
    this.zoomLevelChange.emit(this.zoomLevel);
  }

  public zoomOut() {
    this.zoomLevel = Math.min(this.maxZoomLevel, this.zoomLevel + 1);
    this.zoomLevelChange.emit(this.zoomLevel);
  }
}
