import { Component } from '@angular/core';

import {
  GblGame,
  GblPiece,
} from './models/index';
// import { cloneDeep } from 'lodash';

@Component({
  selector: 'dwu-gobbler',
  templateUrl: './gobbler.component.html',
  styleUrls: ['./gobbler.component.scss'],
})
export class GobblerComponent {

  public gblGame: GblGame;
  public heldPiece: GblPiece;
  public validMoves: any = {};

  constructor() {
    this.gblGame = new GblGame();
  }

  public resetGame() {
    this.holdPiece(undefined);
    this.gblGame.resetGame();
  }

  public makeMove(rowIndex, cellIndex) {
    if (!this.heldPiece) {
      return;
    }
    const isValidMove = this.validMoves[rowIndex] && this.validMoves[rowIndex][cellIndex];
    if (!isValidMove) {
      this.holdPiece(undefined);
      return;
    }
    this.gblGame.makeMove(rowIndex, cellIndex, this.heldPiece)
    this.holdPiece(undefined);
  }

  public holdPiece(piece: GblPiece) {
    const player = this.gblGame.isP1Turn ? 'p1' : 'p2';
    if (piece && (piece.player !== player)) {
      return
    }

    this.heldPiece = (piece === this.heldPiece) ? undefined : piece;

    if (this.heldPiece) {
      this.validMoves = this.gblGame.getValidMoves(piece);
    } else {
      this.validMoves = {}
    }
  }

}