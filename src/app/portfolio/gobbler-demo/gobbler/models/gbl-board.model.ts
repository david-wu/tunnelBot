import { cloneDeep, last } from 'lodash';
import { GblPiece } from './gbl-piece.model';

export class GblBoard {
  public static initial = [
    [[], [], [], []],
    [[], [], [], []],
    [[], [], [], []],
    [[], [], [], []],
  ];
  public static winStates = [
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ];

  public static createBlank() {
    return Object.assign(new GblBoard(), {
      state: cloneDeep(GblBoard.initial),
    })
  }

  public static createFromState(state) {
    return Object.assign(new GblBoard(), {
      state: state,
    })
  }

  public static checkBoardState(state) {
    for(let i = 0; i < GblBoard.winStates.length; i++) {
      const winState = GblBoard.winStates[i];
      const cell = state[winState[0][0]][winState[0][1]];
      const piece = last(cell)

      for(let j = 1; j < winState.length; j++) {
        const nextCell = state[winState[j][0]][winState[j][1]];
        const nextPiece = last(nextCell);
        if (!nextPiece || (nextPiece.player !== nextCell.player)) {
          break;
        }
        if (j === 2) {
          return nextPiece.player;
        }
      }
    }
  }

  public state = [];

  public checkBoardState() {
    for(let i = 0; i < GblBoard.winStates.length; i++) {
      const winState = GblBoard.winStates[i];
      const cell = this.state[winState[0][0]][winState[0][1]];
      const piece = last(cell)

      for(let j = 1; j < winState.length; j++) {
        const nextCell = this.state[winState[j][0]][winState[j][1]];
        const nextPiece = last(nextCell);
        if (!nextPiece || (nextPiece.player !== nextCell.player)) {
          break;
        }
        if (j === 2) {
          return nextPiece.player;
        }
      }
    }
  }

}
