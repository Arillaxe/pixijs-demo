import { FIELD_COLS, FIELD_ROWS } from "./consts";

type CursorMoveCallback = (x: number, y: number) => void;
type DestroyCallback = (x: number, y: number) => void;
type StartCallback = () => void;
type WinCallback = () => void;

class Game {
  private field: Array<Array<boolean>> = [];
  private score = 0;
  private cursorPosition = { x: 0, y: 0 };

  private onCursorMoveCallback: CursorMoveCallback | null = null;
  private onDestroyCallback: DestroyCallback | null = null;
  private onStartCallback: StartCallback | null = null;
  private onWinCallback: WinCallback | null = null;

  constructor() {
    for (let i = 0; i < FIELD_COLS; i++) {
      for (let j = 0; j < FIELD_ROWS; j++) {
        if (!this.field[i]) {
          this.field[i] = [];
        }

        this.field[i][j] = true;
      }
    }
  }

  destroyAtCursorPosition() {
    const { x, y } = this.cursorPosition;

    if (!this.field[x][y]) {
      return;
    }

    this.field[x][y] = false;
    this.score++;

    this.onDestroyCallback?.(this.cursorPosition.x, this.cursorPosition.y);

    if (this.score === FIELD_COLS * FIELD_ROWS) {
      this.onWinCallback?.();
    }
  }

  getField() {
    return this.field;
  }

  getScore() {
    return this.score;
  }

  getCursorPosition() {
    return this.cursorPosition;
  }

  start() {
    this.onStartCallback?.();
  }

  reset() {
    this.start();

    for (let i = 0; i < FIELD_COLS; i++) {
      for (let j = 0; j < FIELD_ROWS; j++) {
        this.field[i][j] = true;
      }
    }

    this.score = 0;
    this.cursorPosition.x = 0;
    this.cursorPosition.y = 0;

    this.onCursorMoveCallback?.(this.cursorPosition.x, this.cursorPosition.y);
  }

  moveUp() {
    this.cursorPosition.y--;

    if (this.cursorPosition.y < 0) {
      this.cursorPosition.y = FIELD_ROWS - 1;
    }

    this.onCursorMoveCallback?.(this.cursorPosition.x, this.cursorPosition.y);
  }

  moveDown() {
    this.cursorPosition.y++;

    if (this.cursorPosition.y > FIELD_ROWS - 1) {
      this.cursorPosition.y = 0;
    }

    this.onCursorMoveCallback?.(this.cursorPosition.x, this.cursorPosition.y);
  }

  moveLeft() {
    this.cursorPosition.x--;

    if (this.cursorPosition.x < 0) {
      this.cursorPosition.x = FIELD_COLS - 1;
    }

    this.onCursorMoveCallback?.(this.cursorPosition.x, this.cursorPosition.y);
  }

  moveRight() {
    this.cursorPosition.x++;

    if (this.cursorPosition.x > FIELD_COLS - 1) {
      this.cursorPosition.x = 0;
    }

    this.onCursorMoveCallback?.(this.cursorPosition.x, this.cursorPosition.y);
  }

  onCursorMove(callback: CursorMoveCallback) {
    this.onCursorMoveCallback = callback;
  }

  onDestroy(callback: DestroyCallback) {
    this.onDestroyCallback = callback;
  }

  onStart(callback: StartCallback) {
    this.onStartCallback = callback;
  }

  onWin(callback: WinCallback) {
    this.onWinCallback = callback;
  }
}

export default new Game();
