const canvas = document.getElementById('tetris-canvas');
const ctx = canvas.getContext('2d');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30; // 300px / 10 cols

// Initialize empty grid
let grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

// Tetromino definitions
const TETROMINOES = {
    'I': { shape: [[1,1,1,1]], color: 'cyan' },
    'J': { shape: [[1,0,0],[1,1,1]], color: 'blue' },
    'L': { shape: [[0,0,1],[1,1,1]], color: 'orange' },
    'O': { shape: [[1,1],[1,1]], color: 'yellow' },
    'S': { shape: [[0,1,1],[1,1,0]], color: 'green' },
    'T': { shape: [[0,1,0],[1,1,1]], color: 'purple' },
    'Z': { shape: [[1,1,0],[0,1,1]], color: 'red' }
};

let activePiece = null;
let dropCounter = 0;
let dropInterval = 500;
let lastTime = 0;
let score = 0;

function spawnPiece() {
    const keys = Object.keys(TETROMINOES);
    const randKey = keys[Math.floor(Math.random() * keys.length)];
    const piece = TETROMINOES[randKey];
    activePiece = {
        shape: piece.shape,
        color: piece.color,
        x: Math.floor(COLS / 2) - Math.floor(piece.shape[0].length / 2),
        y: 0
    };
}

function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = '#222';
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw settled cells
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (grid[r][c] !== 0) {
                drawBlock(c, r, grid[r][c]);
            }
        }
    }

    // Draw active piece
    if (activePiece) {
        for (let r = 0; r < activePiece.shape.length; r++) {
            for (let c = 0; c < activePiece.shape[r].length; c++) {
                if (activePiece.shape[r][c]) {
                    drawBlock(activePiece.x + c, activePiece.y + r, activePiece.color);
                }
            }
        }
    }
}

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        if (activePiece) {
            dropPiece();
        }
    }

    drawGrid();
    requestAnimationFrame(update);
}

function collide(offsetX, offsetY, testShape = null) {
    const shape = testShape || activePiece.shape;
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
                const newX = activePiece.x + c + offsetX;
                const newY = activePiece.y + r + offsetY;
                // Boundaries
                if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
                // Settled blocks (ignore top boundary < 0 for spawning)
                if (newY >= 0 && grid[newY][newX] !== 0) return true;
            }
        }
    }
    return false;
}

function rotatePiece() {
    const shape = activePiece.shape;
    const rotated = shape[0].map((val, index) => shape.map(row => row[index]).reverse());
    // Simple wall kick
    const prevX = activePiece.x;
    let offset = 1;
    while (collide(0, 0, rotated)) {
        activePiece.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > shape[0].length) {
            activePiece.x = prevX;
            return; // Can't rotate
        }
    }
    activePiece.shape = rotated;
}

function lockPiece() {
    for (let r = 0; r < activePiece.shape.length; r++) {
        for (let c = 0; c < activePiece.shape[r].length; c++) {
            if (activePiece.shape[r][c]) {
                if (activePiece.y + r < 0) {
                    // Game Over condition handler
                    grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
                    score = 0;
                    updateScoreDisplay();
                    return;
                }
                grid[activePiece.y + r][activePiece.x + c] = activePiece.color;
            }
        }
    }
    clearLines();
    spawnPiece();
}

function clearLines() {
    let linesCleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
        let isFull = true;
        for (let c = 0; c < COLS; c++) {
            if (grid[r][c] === 0) {
                isFull = false;
                break;
            }
        }
        if (isFull) {
            grid.splice(r, 1);
            grid.unshift(Array(COLS).fill(0));
            linesCleared++;
            r++; // Check the new row that fell into this index
        }
    }

    if (linesCleared > 0) {
        const points = [0, 100, 300, 500, 800];
        score += points[linesCleared];
        updateScoreDisplay();
    }
}

function updateScoreDisplay() {
    const scoreElement = document.getElementById('score-display');
    if (scoreElement) {
        scoreElement.textContent = score;
    }
}

function dropPiece() {
    if (!collide(0, 1)) {
        activePiece.y++;
    } else {
        lockPiece();
    }
    dropCounter = 0;
}

document.addEventListener('keydown', event => {
    if (!activePiece) return;
    if (event.key === 'ArrowLeft') {
        if (!collide(-1, 0)) activePiece.x--;
    } else if (event.key === 'ArrowRight') {
        if (!collide(1, 0)) activePiece.x++;
    } else if (event.key === 'ArrowDown') {
        dropPiece();
    } else if (event.key === 'ArrowUp') {
        rotatePiece();
    }
});

// Start game
spawnPiece();
update();
