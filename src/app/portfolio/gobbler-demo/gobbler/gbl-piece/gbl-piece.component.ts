import {
  Component,
  Input,
} from '@angular/core';

import {
  GblGame,
  GblPiece,
} from '../models/index';

@Component({
  selector: 'dwu-gbl-piece',
  templateUrl: './gbl-piece.component.html',
  styleUrls: ['./gbl-piece.component.scss'],
})
export class GblPieceComponent {

  @Input() piece: GblPiece;
  @Input() heldPiece: GblPiece;

}