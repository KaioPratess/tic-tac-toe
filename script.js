// PubSub Module
const events = {
  events: {},
subscribe: function (eventName, object, callback) {
this.events[eventName] = this.events[eventName] || [];
this.events[eventName].push({object: object, callback: callback});
},
unsubscribe: function(eventName, object, callback) {
if (this.events[eventName]) {
for (var i = 0; i < this.events[eventName].length; i++) {
if (this.events[eventName][i].object === object) {
this.events[eventName].splice(i, 1);
break;
}
};
}
},
publish: function (eventName, data) {
if (this.events[eventName]) {
this.events[eventName].forEach(function(instance) {
instance.callback(data);
});
}
}
};

// Game Board Module
const gameBoard = (function() {  
    const board = document.querySelector('.game-board');
    let position = 1;
    let index = 0;
    const array = new Array(3).fill(0).map(() => new Array(3).fill(0));

    function createCells() {
        for(row of array) {
          for(column of row) {
            const div = document.createElement('div');
            div.classList.add('block');
            div.classList.add(`row:${array.indexOf(row)}`);
            div.classList.add(`cell${position}`);
            div.classList.add(`index:${index}`);
            div.addEventListener('click', (event) => {
              events.publish("move", event);
            });
            
            board.appendChild(div);
            position++;
            if(index< 2) {
              index++;
            } else {
              index = 0;
            }
          }
        }
    }

    function changeArray(row, index, value) {
      array[row].splice(index, 1, value);
    }

    function checkForWinner() {
      const row0 = array[0].join('');
      const row1 = array[1].join('');
      const row2 = array[2].join('');

      const col1 = row0.charAt(0) + row1.charAt(0) + row2.charAt(0);
      const col2 = row0.charAt(1) + row1.charAt(1) + row2.charAt(1);
      const col3 = row0.charAt(2) + row1.charAt(2) + row2.charAt(2);

      const diag1 = row0.charAt(0) + row1.charAt(1) + row2.charAt(2);
      const diag2 = row0.charAt(2) + row1.charAt(1) + row2.charAt(0);

      if(row0 === 'xxx' || row1 === 'xxx' || row2 ===  'xxx' || col1 === 'xxx' || col2 === 'xxx' || col3 === 'xxx' || diag1 === 'xxx' || diag2 === 'xxx') {
        alert('Player 1 is the winner');
      } else if(row0 === 'ooo' || row1 === 'ooo' || row2 ===  'ooo' || col1 === 'xxx' || col2 === 'xxx' || col3 === 'xxx' || diag1 === 'ooo' || diag2 === 'ooo') {
        alert('Player 2 is the winner');
      }
    }

    createCells();
    checkForWinner();

    return {changeArray}
})();

// Menu Module
const getGameMode = (function () {
  const gameModeDiv = document.querySelector('.game-mode');
  const multiplayerBtn = document.querySelector('.multiplayer');
  const soloBtn = document.querySelector('.solo');
  const multiplayerModeDiv = document.querySelector('.multiplayer-mode');
  const soloModeDiv = document.querySelector('.solo-mode');
  const returnArrows = document.querySelectorAll('.arrow');

  function selectMultiplayer() {
    gameModeDiv.style.display = 'none';
    multiplayerModeDiv.style.display = 'grid';
  }

  function selectSolo() {
    gameModeDiv.style.display = 'none';
    soloModeDiv.style.display = 'grid';
  }

  function backToStart() {
    gameModeDiv.style.display = 'grid';
    multiplayerModeDiv.style.display = 'none';
    soloModeDiv.style.display = 'none';
  }

  multiplayerBtn.addEventListener('click', selectMultiplayer);

  soloBtn.addEventListener('click', selectSolo);

  returnArrows.forEach((item) => {
    item.addEventListener('click', backToStart);
});

})()

// Multiplayer Module
const multiplayerMode = (function () {
  const menuBg = document.querySelector('.menu-bg');
  const multiplayerModeDiv = document.querySelector('.multiplayer-mode');
  const playerInput = document.querySelectorAll('.multiplayer-mode input[type="text"]');
  const nameDisplay = document.querySelectorAll('.name-display');
  const startGameBtn = document.querySelector('.multiplayer-mode .btn');

  let player1;
  let player2;

  function createPlayer() {
    const player1Name = playerInput[0].value.charAt(0).toUpperCase() + playerInput[0].value.slice(1,playerInput[0].value.length);
    const player2Name = playerInput[1].value.charAt(0).toUpperCase() + playerInput[1].value.slice(1,playerInput[1].value.length);

    player1 = Player(player1Name);
    player2 = Player(player2Name);

    nameDisplay[0].textContent = player1.name;
    nameDisplay[1].textContent = player2.name;
  } 

  function startGame(event) {
    if(playerInput[0].value === '' || playerInput[1].value === '') {
      event.preventDefault();
      window.alert('Write your names!')
    } else {
        createPlayer()
        controlGame();
        multiplayerModeDiv.style.display = 'none';
        menuBg.style.display = 'none';
      }
  }

  function controlGame() {
    let move = 1;
    events.subscribe("move", events.events, (event) => {
      const cell = event.target.getAttribute('class');
      if(move % 2 !== 0) {
        if(event.target.textContent === '') {
          const position = cell.charAt(16);
          const index = cell.charAt(cell.length -1);
          const row = cell.charAt(10);
          const symbol = 'x';
          event.target.textContent = symbol;
          move++;
          gameBoard.changeArray(row, index, symbol);
        }
        
      } else {
        if(event.target.textContent === '') {
          const position = cell.charAt(16);
          const index = cell.charAt(cell.length -1);
          const row = cell.charAt(10);
          const symbol = 'o';
          event.target.textContent = symbol;
          move++;
          gameBoard.changeArray(row, index, symbol);
        }
      }
    })
  }

  startGameBtn.addEventListener('click', startGame);
})();

// Solo Module
const soloMode = (function() {
    const menuBg = document.querySelector('.menu-bg');
    const soloModeDiv = document.querySelector('.solo-mode');
    const playerInput = document.querySelector('.solo-mode #player1-name');
    const levelSelect = document.querySelector('#level');
    const nameDisplay = document.querySelectorAll('.name-display');
    const startGameBtn = document.querySelector('.solo-mode .btn');

    function createPlayer() {
      const playerName = playerInput.value.charAt(0).toUpperCase() + playerInput.value.slice(1,playerInput.value.length);
  
      const player1 = Player(playerName);
      const player2 = Player('Machine', levelSelect.value);
      
      console.log(player1, player2)
      nameDisplay[0].textContent = player1.name;
      nameDisplay[1].textContent = `${player2.name} - ${player2.difficulty}`;
    }  

    function startGame(event) {
      if(playerInput.value === '') {
        event.preventDefault();
        window.alert('Write your name!')
      } else {
          createPlayer();
          soloModeDiv.style.display = 'none';
          menuBg.style.display = 'none';
      }
    }

    startGameBtn.addEventListener('click', startGame);

})();

// Player Factory
const Player = function(name, difficulty) {
  let points;
  return { name, points, difficulty }
}
