
export class GblPiece {

  public static createEmpty() {
    return Object.assign(new GblPiece(), {
      player: undefined,
      value: 0,
    });
  }

  public player = undefined;
  public value = 0;
}
