
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);


DROP_INTERVAL_SLOW = 1000
DROP_INTERVAL_FAST = 50
createMatrix = (width, height) => {
  const matrix = [];
  while (height--) {
    matrix.push(new Array(width).fill(0))
  }
  return matrix
};

 createTetris = () => {
   let rowCount = 1;
    outer: for (let y = arena.length -1; y > 0; y--)  {
    for (let x = 0; x < arena[y].length; x++) {
      if (arena[y][x] === 0) {
        continue outer;
      }
    }
   const row = arena.splice(y, 1)[0].fill(0);
   arena.unshift(row);
   y++;
   player.score += rowCount * 10;
   rowCount *= 2;

  }
}
 updateScore = () =>{
  document.getElementById('score').innerText = `Score ${player.score}`;
}

 createTetromino = (type) => {
  if (type === "T") {
    return [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ]
  } else if (type === "L") {
    return [
      [2, 0, 0],
      [2, 0, 0],
      [2, 2, 0],
    ]
  } else if (type === "I") {
    return [
      [0, 0, 3, 0],
      [0, 0, 3, 0],
      [0, 0, 3, 0],
      [0, 0, 3, 0],
    ]
  } else if (type === "Z") {
    return [
      [4, 4, 0],
      [0, 4, 4],
      [0, 0, 0],
    ]
  } else if (type === "S") {
    return [
      [0, 5, 5],
      [5, 5, 0],
      [0, 0, 0],
    ]
  } else if (type === "O") {
    return [
      [6, 6],
      [6, 6],
    ]
  } else if (type === "J") {
    return [
      [0, 0, 7],
      [0, 0, 7],
      [0, 7, 7],
    ]
  } else if (type === "C") {
    return [
      [8, 8, 0],
      [8, 0, 0],
      [8, 8, 0],
    ]
  }
}
// const collide = (arena, player) => {
//   const [m, o] = [player.matrix, player.pos];
//   for (let y = 0; y < m.length; ++y) {
//     for (let x = 0; x < m[y].length; ++x) {
//       const outOfBounds = y + o.y >= arenaRows || x + o.x >= arenaCols;
//       if (m[y][x] === 0) {
//         continue;
//       }
//       else if (outOfBounds || arena[y + o.y][x + o.x] !== 0) {
//         return true;
//       }
//       else {
//         continue;
//       }
//     }
//   }
//   return false;
// };

 collide = (arena, player) => {
  const m = player.matrix;
  const o = player.pos;
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 &&
        (arena[y + o.y] &&
          arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}


const arenaCols = 12;
const arenaRows = 20;
const arena = createMatrix(arenaCols, arenaRows);


 drawMatrix = (matrix, offset) => {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.strokeStyle = "black"
        context.fillStyle = colors[value]
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    })

  })
};

 draw = () => {
  context.fillStyle = "#000";
  context.strokeStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(arena, { x: 0, y: 0 })
  drawMatrix(player.matrix, player.pos);
};
 merge = (arena, player) => {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
      })
    })
  }

 playerDrop = () => {
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
    createTetris();
    updateScore();
  }
  dropCounter = 0;
}
 rotate = ( matrix, dir ) => {
  for  (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < y; x++) {
      [
        matrix[x][y],
        matrix[y][x],

      ] = [
        matrix[y][x],
        matrix[x][y]
      ];
    }
  }
  if (dir > 0) {
    matrix.forEach(row => row.reverse());

  } else {
    matrix.reverse();
  }
}
const colors = [
  null,
  "red",
  "teal",
  "yellow",
  "blue",
  "orange",
  "lightgreen",
  "white",
  "lightblue"
]
 playerRotate = (dir) => {
  const pos = player.pos.x;
  let offset = 1;

  rotate(player.matrix, dir);
  while (collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset = (offset > 0 ? 1 : -1))
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir);
      player.pos.x = pos
      return;
    }
  }
}
  playerMove = (dir) => { 
  player.pos.x += dir;
  if (collide(arena, player)) {
    player.pos.x -= dir;
  }
}
 playerReset = () => {
  const pieces = "ILJOTSZC"
  player.matrix = createTetromino(pieces[pieces.length * Math.random() | 0])
  player.pos.y = 0;
  player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
  if (collide(arena, player)) {
    arena.forEach(row => row.fill(0));
    player.score = 0;
    updateScore();
  }
}

let dropCounter  = 0;
let dropInterval = DROP_INTERVAL_SLOW;
let lastTime = 0;

 update = (time = 0) => { 
  const delta = time - lastTime;
  
  dropCounter += delta;

  if (dropCounter  > dropInterval){ 
    playerDrop();
  }
  lastTime = time;
  draw();
  requestAnimationFrame(update);
}
document.addEventListener('keydown', event => {
  if (event.keyCode === 37) {
    playerMove(-1);
  }  else if (event.keyCode === 39) {
    playerMove(1);
  } else if (event.keyCode === 40) {
    playerDrop();
  } else if (event.keyCode === 81) {
    playerRotate(-1);
  } else  if (event.keyCode === 38) {
    playerRotate(1);
  }
});

sound = (src) => {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function () {
    this.sound.play();
  }
  this.stop = function () {
    this.sound.pause();
  }
}


const player = {
  pos: { x: 0, y: 0 },
  matrix: null,
  score: 0
}

const startGame = () => {
  playerReset();
  updateScore();
  update();
}

