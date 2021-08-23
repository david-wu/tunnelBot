import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    Output,
} from '@angular/core';

@Component({
  selector: 'dwu-decorated-image',
  templateUrl: './decorated-image.component.html',
  styleUrls: ['./decorated-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DecoratedImageComponent {
  @Input() src: string;
  @HostBinding('tabindex') tabindex = 0;
  @Output() select = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() download = new EventEmitter();
  @Output() zoomIn = new EventEmitter();

  public isFocused = false;
  public hideOverlay = false;

  constructor(
    public hostEl: ElementRef,
  ) {}

  @HostListener('focus') onFocus() {
    this.isFocused = true;
  }

  @HostListener('blur') onBlur() {
    this.isFocused = false;
    this.hideOverlay = false;
  }

  @HostListener('mouseleave') onMouseleave() {
    this.isFocused = false;
    this.hideOverlay = false;
  }

  @HostListener('mousedown') onMousedown() {
    if (this.isFocused) {
      this.hideOverlay = !this.hideOverlay;
    }
  }

  public onSelect(event) {
    event.stopPropagation();
    this.select.emit();
  }

  public onDelete(event) {
    event.stopPropagation();
    this.delete.emit();
  }

  public onDownload(event) {
    event.stopPropagation();
    this.download.emit();
  }

  public onZoomIn(event) {
    event.stopPropagation();
    this.zoomIn.emit();
  }

}
