// 游戏常量
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const GRID_SIZE = 20;
const GRID_WIDTH = CANVAS_WIDTH / GRID_SIZE;
const GRID_HEIGHT = CANVAS_HEIGHT / GRID_SIZE;

// 游戏变量
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let gameInterval;
let gameSpeed = 150;
let gameRunning = false;

// 获取DOM元素
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

// 初始化游戏
function initGame() {
    // 重置蛇的位置
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    
    // 重置方向
    direction = 'right';
    nextDirection = 'right';
    
    // 重置得分
    score = 0;
    scoreElement.textContent = score;
    
    // 生成初始食物
    generateFood();
    
    // 绘制游戏
    drawGame();
}

// 生成食物
function generateFood() {
    food = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT)
    };
    
    // 确保食物不会生成在蛇身上
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
            return;
        }
    }
}

// 绘制游戏
function drawGame() {
    // 清空画布
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // 绘制蛇
    ctx.fillStyle = '#4CAF50';
    for (let segment of snake) {
        ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 1, GRID_SIZE - 1);
    }
    
    // 绘制食物
    ctx.fillStyle = '#FF5722';
    ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 1, GRID_SIZE - 1);
}

// 更新游戏状态
function updateGame() {
    // 更新方向
    direction = nextDirection;
    
    // 计算新的头部位置
    const head = { ...snake[0] };
    
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    
    // 检查碰撞
    // 检查边界碰撞
    if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
        endGame();
        return;
    }
    
    // 检查自身碰撞
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
            return;
        }
    }
    
    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        // 增加得分
        score++;
        scoreElement.textContent = score;
        
        // 生成新食物
        generateFood();
        
        // 增加蛇的长度
        snake.unshift(head);
    } else {
        // 移动蛇
        snake.unshift(head);
        snake.pop();
    }
    
    // 绘制游戏
    drawGame();
}

// 结束游戏
function endGame() {
    clearInterval(gameInterval);
    gameRunning = false;
    startBtn.textContent = '重新开始';
    alert('游戏结束！得分：' + score);
}

// 开始游戏
function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        gameInterval = setInterval(updateGame, gameSpeed);
        startBtn.textContent = '开始游戏';
    }
}

// 暂停游戏
function pauseGame() {
    if (gameRunning) {
        clearInterval(gameInterval);
        gameRunning = false;
        startBtn.textContent = '继续游戏';
    }
}

// 重置游戏
function resetGame() {
    pauseGame();
    initGame();
}

// 处理键盘输入
function handleKeyPress(e) {
    switch (e.key) {
        case 'ArrowUp':
            if (direction !== 'down') {
                nextDirection = 'up';
            }
            break;
        case 'ArrowDown':
            if (direction !== 'up') {
                nextDirection = 'down';
            }
            break;
        case 'ArrowLeft':
            if (direction !== 'right') {
                nextDirection = 'left';
            }
            break;
        case 'ArrowRight':
            if (direction !== 'left') {
                nextDirection = 'right';
            }
            break;
    }
}

// 事件监听器
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
resetBtn.addEventListener('click', resetGame);
document.addEventListener('keydown', handleKeyPress);

// 初始化游戏
initGame();