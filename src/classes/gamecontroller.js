export class GameController {
  constructor({
    player,
    computer,
    pgRenderer,
    cgRenderer,
    mainRenderer,
    observer,
  }) {
    this.player = player;
    this.computer = computer;
    this.pgRenderer = pgRenderer;
    this.cgRenderer = cgRenderer;
    this.mainRenderer = mainRenderer;
    this.observer = observer;
  }

  runGame() {
    let boardRenderInterval;
    let infoRenderInterval;

    this.#renderAll();

    boardRenderInterval = setInterval(() => {
      this.#checkWin([boardRenderInterval, infoRenderInterval]);
      if (!this.#gameOver && !this.observer.playerTurn) {
        this.computer.takeTurn();
        this.#renderAll();
      }
    }, 1500);

    infoRenderInterval = setInterval(() => {
      this.mainRenderer.renderTurnPrompt();
      this.pgRenderer.renderScore();
      this.cgRenderer.renderScore();
    }, 50);
  }

  #checkWin(intervals) {
    if (this.#gameOver) {
      intervals.forEach((int) => clearInterval(int));
      this.#renderAll();
      return this.mainRenderer.renderGameOver(this.#winner);
    }
  }

  #renderAll() {
    this.pgRenderer.renderBoard(this.#computerGrid, 'playerGrid');
    this.cgRenderer.renderBoard(this.#playerGrid, 'computerGrid');
  }

  get #gameOver() {
    const player_win = this.computer.gameboard.allSunk();
    const ai_win = this.player.gameboard.allSunk();
    return player_win || ai_win || false;
  }

  get #winner() {
    if (this.player.gameboard.allSunk) {
      return this.player;
    } else {
      return this.computer;
    }
  }

  get #playerGrid() {
    return this.player.gameboard.grid;
  }

  get #computerGrid() {
    return this.computer.gameboard.grid;
  }
}
