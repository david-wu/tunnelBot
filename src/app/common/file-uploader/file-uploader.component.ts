import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

// import { FirebaseStorageService } from '@services/firebase-storage.service';

@Component({
  selector: 'dwu-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent {

  @Input() acceptStr = `image/*`;
  @Input() showUploadButton = false;
  @Output() fileChange = new EventEmitter<File>();
  @Output() fileUpload = new EventEmitter<File>();

  public file: File;

  constructor(
    // public fss: FirebaseStorageService,
  ) {
  }

  public onFileChange(fileEvent: any) {
    if (fileEvent.target.files) {
      this.file = fileEvent.target.files[0];
      this.fileChange.emit(this.file);
    }
  }

  public upload() {
    // this.fss.uploadZip(this.file);
    this.fileUpload.emit(this.file);
  }
}
