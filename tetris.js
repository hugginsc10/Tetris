const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);

context.fillStyle = '#000';
context.fillRect(0, 0, canvas.width, canvas.height);

const matrix = [
  [0,0,0],
  [1,1,1],
  [0,1,0],
];

function collides(arena, player) {
  const[m, o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 && arena[y + o.y] && arena[y+o.y][x +o.x]!==0)  {
        return true;
      }
    }
  }
  return false;
}

function createMatrix(width, height) {
  const matrix = [];
  while (height--) {
    matrix.push(new Array(width).fill(0))
  }
  return matrix
}

const arena = createMatrix(12, 20);

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = 'red';
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    })

  })
};
function draw() {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(arena, {x: 0, y: 0})
  drawMatrix(player.matrix, player.pos);
};

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
      })
    })
  }

function playerDrop() {
  player.pos.y++;
  if (collides(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    player.pos.y = 0
  }
  dropCounter = 0;
}

let dropCounter  = 0;
let dropInterval = 1000
let lastTime = 0;

function update(time = 0) { 
  const deltaTime = time - lastTime;
  
  dropCounter += deltaTime;

  if (dropCounter  > dropInterval){ 
    playerDrop();
  }
  lastTime = time;
  draw();
  requestAnimationFrame(update);
}
document.addEventListener('keydown', event => {
  if (event.keyCode === 37) {
    player.pos.x--;
  }  else if (event.keyCode === 39) {
    player.pos.x++;
  } else if (event.keyCode === 40) {
    playerDrop();
  } 
});

const player = {
  pos: {x: 0, y: 0},
  matrix: matrix,
}
update();
