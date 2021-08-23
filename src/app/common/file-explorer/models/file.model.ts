
import { FileType } from '@src/app/common/file-explorer/models/file-type.enum';

export class File {
  public id: string;
  // public parentId: string;
  public childIds: string[];
  public type?: FileType;
  public label = '';
}
