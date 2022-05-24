const gameBoard = (function() {  
  const board = document.querySelector('.game-board');
  let cellNumber = 1;

  function createCell() {
    const div = document.createElement('div');
    div.classList.add('block');
    div.classList.add(`cell${cellNumber}`);
    board.appendChild(div);
    cellNumber++;
  }

  function createMatrix() {
    const matrix = new Array(3).fill(0).map(() => new Array(3).fill(0));
    for(row of matrix) {
      for(column of row) {
        createCell();
      }
    }
  }

  createMatrix();
})();

const Players = function() {
  const playerName = playerName;
}