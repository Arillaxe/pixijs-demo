import { FIELD_COLS, FIELD_ROWS } from "./consts";

class Game {
  private field: Array<Array<boolean>> = [];
  private score = 0;
  private cursorPosition = { x: 0, y: 0 };

  private onCursorMoveCallback: (x: number, y: number) => void | null = null;

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

  reset() {
    for (let i = 0; i < FIELD_COLS; i++) {
      for (let j = 0; j < FIELD_ROWS; j++) {
        this.field[i][j] = true;
      }
    }

    this.score = 0;
    this.cursorPosition.x = 0;
    this.cursorPosition.y = 0;
  }

  moveUp() {
    this.cursorPosition.y--;

    if (this.cursorPosition.y < 0) {
      this.cursorPosition.y = FIELD_ROWS - 1;
    }
  }

  moveDown() {
    this.cursorPosition.y++;

    if (this.cursorPosition.y > FIELD_ROWS - 1) {
      this.cursorPosition.y = 0;
    }
  }

  moveLeft() {
    this.cursorPosition.x--;

    if (this.cursorPosition.x < 0) {
      this.cursorPosition.x = FIELD_COLS - 1;
    }
  }

  moveRight() {
    this.cursorPosition.x++;

    if (this.cursorPosition.x > FIELD_COLS - 1) {
      this.cursorPosition.x = 0;
    }
  }
}

export default new Game();
