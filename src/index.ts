import * as PIXI from "pixi.js";
import { sound } from "@pixi/sound";
import { FIELD_COLS, FIELD_ROWS, HEIGHT, TOP_PADDING, WIDTH } from "./consts";
import Game from "./Game";

(async () => {
  const app = new PIXI.Application();
  await app.init({ width: WIDTH, height: HEIGHT });
  document.body.appendChild(app.canvas);

  const assetsPromises = [
    PIXI.Assets.load("assets/bg_game.png"),
    PIXI.Assets.load("assets/board.png"),
    PIXI.Assets.load("assets/crystal_yellow.png"),
    PIXI.Assets.load("assets/score_bar.png"),
  ];

  await Promise.all(assetsPromises);

  sound.add("pickup", "assets/pickup.mp3");
  sound.add("start", "assets/start.mp3");
  sound.add("win", "assets/win.mp3");

  let background = PIXI.Sprite.from("assets/bg_game.png");
  background.width = WIDTH;
  background.height = HEIGHT;
  app.stage.addChild(background);

  let board = PIXI.Sprite.from("assets/board.png");
  board.height = HEIGHT - TOP_PADDING * 2;
  const boardRatio = board.texture.height / board.texture.width;
  board.width = board.height / boardRatio;
  board.anchor = 0.5;
  const boardContainer = new PIXI.Container();
  boardContainer.x = WIDTH / 2;
  boardContainer.y = HEIGHT / 2;
  boardContainer.addChild(board);
  app.stage.addChild(boardContainer);

  const cellSize = board.width / 9;

  const gems: PIXI.Sprite[][] = [];

  for (let i = 0; i < FIELD_COLS; i++) {
    for (let j = 0; j < FIELD_ROWS; j++) {
      const gem = PIXI.Sprite.from("assets/crystal_yellow.png");
      gem.scale = 0.6;
      gem.anchor = 0.5;

      gem.x = -board.width / 2 + i * cellSize + cellSize / 2;
      gem.y = -board.height / 2 + j * cellSize + cellSize / 2;

      boardContainer.addChild(gem);

      if (!gems[i]) {
        gems[i] = [];
      }

      gems[i][j] = gem;
    }
  }

  let currentCell = new PIXI.Graphics().rect(0, 0, cellSize, cellSize);
  currentCell.strokeStyle = { width: 5, color: 0xffffff, alignment: 1 };
  currentCell.stroke();

  boardContainer.addChild(currentCell);

  let scoreBar = PIXI.Sprite.from("assets/score_bar.png");
  let scoreBarContainer = new PIXI.Container();
  scoreBarContainer.addChild(scoreBar);
  scoreBarContainer.x = TOP_PADDING;
  scoreBarContainer.y = TOP_PADDING;

  const scoreText = new PIXI.Text({
    text: "0",
    style: {
      fontFamily: "sans-serif",
      fontWeight: "bold",
      fontSize: 84,
      align: "right",
      fill: 0xffffff,
    },
  });
  scoreText.anchor = { x: 1, y: 0.5 };
  scoreText.y = scoreBar.height / 2;
  scoreText.x = scoreBar.width - 20;
  scoreBarContainer.addChild(scoreBar);
  scoreBarContainer.addChild(scoreText);
  app.stage.addChild(scoreBarContainer);

  const onCursorMove = (x: number, y: number) => {
    currentCell.x = -board.width / 2 + x * cellSize;
    currentCell.y = -board.height / 2 + y * cellSize;
  };

  const onDestroy = (x: number, y: number) => {
    gems[x][y].visible = false;
    sound.play("pickup");
    scoreText.text = Game.getScore();
  };

  const onStart = () => {
    sound.play("start");
  };

  const onWin = () => {
    sound.play("win");
  };

  Game.onCursorMove(onCursorMove);
  Game.onDestroy(onDestroy);
  Game.onStart(onStart);
  Game.onWin(onWin);

  const { x, y } = Game.getCursorPosition();

  currentCell.x = -board.width / 2 + x * cellSize;
  currentCell.y = -board.height / 2 + y * cellSize;

  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowUp":
        Game.moveUp();
        break;
      case "ArrowDown":
        Game.moveDown();
        break;
      case "ArrowLeft":
        Game.moveLeft();
        break;
      case "ArrowRight":
        Game.moveRight();
        break;
      case " ":
        Game.destroyAtCursorPosition();
        break;
    }
  });

  Game.start();
})();
