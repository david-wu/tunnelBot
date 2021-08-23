import { last } from 'lodash';
import { GblBoard } from './gbl-board.model';
import { GblPiece } from './gbl-piece.model';

export class GblGame {

  public board: GblBoard;
  public p1Pieces: GblPiece[];
  public p2Pieces: GblPiece[];
  public isP1Turn: boolean = true;

  constructor() {
    this.resetGame();
  }

  public resetGame() {
    const pieceValues = [3, 3, 2, 2, 2, 1, 1, 1];
    this.board = GblBoard.createBlank();
    this.p1Pieces = this.getPlayerPieces('p1', pieceValues);
    this.p2Pieces = this.getPlayerPieces('p2', pieceValues);
    this.isP1Turn = true;
  }

  public makeMove(rowIndex, cellIndex, piece) {
    this.removePiece(piece);
    this.board.state[rowIndex][cellIndex].push(piece);
    this.isP1Turn = !this.isP1Turn;
  }

  public removePiece(piece) {
    for(let i = 0; i < this.p1Pieces.length; i++) {
      if (this.p1Pieces[i] === piece) {
        this.p1Pieces = this.p1Pieces.filter((p1Piece) => p1Piece !== piece);
        return;
      }
    }
    for(let i = 0; i < this.p2Pieces.length; i++) {
      if (this.p2Pieces[i] === piece) {
        this.p2Pieces = this.p2Pieces.filter((p2Piece) => p2Piece !== piece);
        return;
      }
    }
  }

//(9*3)^4 = 531441
  public checkNextMove(boardState, isP1Turn, p1Pieces, p2Pieces, turn = 0) {
    const winner = GblBoard.checkBoardState(boardState);
    if (winner === 'p1') {
      return [{}];
    }
    if (winner === 'p2') {
      return [];
    }
    if (turn > 3) {
      return [];
    }

    const pieces = isP1Turn ? p1Pieces : p2Pieces;
    const goodMoves = [];
    for(let i = 0; i < boardState.length; i++) {
      const row = boardState[i];
      for(let j = 0; j < row.length; j++) {
        const cell = row[j];
        const cellPiece = last(cell)
        for(let k = 0; k < pieces.length; k++) {
          const piece = pieces[k];

          if (!cellPiece || piece.value > cellPiece.value) {
            const nextPieces = [
              ...pieces.slice(0, k),
              ...pieces.slice(k + 1),
            ];
            const nextBoardState = [...boardState];
            nextBoardState[i] = [...boardState[i]];
            nextBoardState[i][j] = piece;

            if(isP1Turn) {
              const res = this.checkNextMove(nextBoardState, false, nextPieces, p2Pieces, turn + 1);
              if (res.length) {
                goodMoves.push([i, j, piece])
              }
              // Every possible next move most still be winnable
            } else {
              this.checkNextMove(nextBoardState, true, p1Pieces, nextPieces, turn + 1);
            }
          }

        }
      }
    }
    return goodMoves;
  }

  public getPlayerPieces(player: string, pieceValues: number[]): GblPiece[] {
    return pieceValues.map((pieceValue: number) => {
      return Object.assign(new GblPiece(), {
        player: player,
        value: pieceValue,
      });
    });
  }

  public getValidMoves(piece: GblPiece) {
    const validMoves = {};
    for(let i = 0; i < this.board.state.length; i++) {
      const row = this.board.state[i];
      for(let j = 0; j < row.length; j++) {
        const cell = row[j];
        const cellPiece = last(cell)
        if (!cellPiece || piece.value > cellPiece.value) {
          validMoves[i] = validMoves[i] || [];
          validMoves[i][j] = true
        }
      }
    }
    return validMoves;
  }

}