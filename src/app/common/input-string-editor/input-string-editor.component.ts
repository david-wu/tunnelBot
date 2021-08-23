import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from '@angular/core';

@Component({
  selector: 'dwu-input-string-editor',
  templateUrl: './input-string-editor.component.html',
  styleUrls: ['./input-string-editor.component.scss'],
})
export class InputStringEditorComponent {

    @Input() str = '';
    @Output() strChange: EventEmitter<string> = new EventEmitter<string>();
    @Input() placeholder = 'Enter Text..';
    @ViewChild('stringInput', { static: true }) stringInput: ElementRef<any>;
    @ViewChild('editEl', { static: true }) editEl: ElementRef<any>;

    public isEditing = false;
    public editStr = '';

    public ngOnInit() {
      this.stringInput.nativeElement.addEventListener('keydown', (e) => {
        if (e && e.keyCode === 13) {
          this.onSaveEdit();
        }
      });
      this.stringInput.nativeElement.addEventListener('blur', () => {
        if (this.str === this.editStr) {
          this.onCancelEdit();
        }
      });
    }

    public onEdit() {
      this.editStr = this.str || '';
      this.isEditing = true;
      setTimeout(() => this.stringInput.nativeElement.select());
    }

    public onCancelEdit() {
      this.isEditing = false;
    }

    public onSaveEdit() {
      if (this.str !== this.editStr) {
        this.str = this.editStr;
        this.strChange.emit(this.editStr);
      }
      this.isEditing = false;
    }

    public onStrChange(nextStr) {
      this.editStr = nextStr;
    }

    public preventBlur(e) {
      e.preventDefault();
    }
}
