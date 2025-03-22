const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

// Sounds
// Updated Sounds (Soothing Versions)
const paddleHitSound = new Audio("https://www.fesliyanstudios.com/play-mp3/6527");
const scoreSound = new Audio("https://www.fesliyanstudios.com/play-mp3/6264");
const wallBounceSound = new Audio("https://www.fesliyanstudios.com/play-mp3/6348");


// Paddle settings
const paddleWidth = 15, paddleHeight = 80;
let paddle1Y = canvas.height / 2 - paddleHeight / 2;
let paddle2Y = paddle1Y;
const paddleSpeed = 6;
const paddleEase = 0.2; // Smooth movement

// Ball settings
let ballX, ballY, ballSpeedX, ballSpeedY;
const ballSize = 14;
resetBall(true); // Start with animation

// Score tracking
let playerScore = 0, aiScore = 0;
const playerScoreElement = document.getElementById("playerScore");
const aiScoreElement = document.getElementById("aiScore");

// Controls
let upPressed = false, downPressed = false;

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") upPressed = true;
    if (event.key === "ArrowDown") downPressed = true;
});
document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowUp") upPressed = false;
    if (event.key === "ArrowDown") downPressed = false;
});

// Reset ball with animation
function resetBall(animated = false) {
    ballX = canvas.width / 2 - ballSize / 2;
    ballY = canvas.height / 2 - ballSize / 2;
    ballSpeedX = 3 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);

    if (animated) {
        let alpha = 0;
        const fadeIn = setInterval(() => {
            alpha += 0.05;
            if (alpha >= 1) clearInterval(fadeIn);
        }, 30);
    }
}

// Update game state
function update() {
    // Smooth player paddle movement
    if (upPressed && paddle1Y > 0) paddle1Y -= paddleSpeed * paddleEase;
    if (downPressed && paddle1Y < canvas.height - paddleHeight) paddle1Y += paddleSpeed * paddleEase;

    // Improved AI Paddle (adjusts speed dynamically)
    let aiCenter = paddle2Y + paddleHeight / 2;
    let targetSpeed = Math.abs(ballSpeedX) > 4 ? paddleSpeed * 0.7 : paddleSpeed * 0.5;
    if (aiCenter < ballY - 10) paddle2Y += targetSpeed;
    else if (aiCenter > ballY + 10) paddle2Y -= targetSpeed;

    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top and bottom walls
    if (ballY <= 0 || ballY >= canvas.height - ballSize) {
        ballSpeedY *= -1;
        wallBounceSound.play();
    }

    // Ball collision with paddles
    if (
        (ballX <= paddleWidth && ballY > paddle1Y && ballY < paddle1Y + paddleHeight) ||
        (ballX >= canvas.width - paddleWidth - ballSize && ballY > paddle2Y && ballY < paddle2Y + paddleHeight)
    ) {
        ballSpeedX *= -1.1; // Slightly increase speed after bounce
        ballSpeedY *= Math.random() * 0.5 + 0.75; // Add variation to angle
        paddleHitSound.play();
        createParticles(ballX, ballY);
    }

    // Ball goes off-screen (scoring system)
    if (ballX < 0) {
        aiScore++;
        scoreSound.play();
        resetBall(true);
    } else if (ballX > canvas.width) {
        playerScore++;
        scoreSound.play();
        resetBall(true);
    }

    // Update score display
    playerScoreElement.textContent = playerScore;
    aiScoreElement.textContent = aiScore;

    // Speed boost every 3 points
    if ((playerScore + aiScore) % 3 === 0) {
        ballSpeedX *= 1.05;
        ballSpeedY *= 1.05;
    }
}

// Particle effect system
let particles = [];
function createParticles(x, y) {
    for (let i = 0; i < 8; i++) {
        particles.push({
            x: x,
            y: y,
            size: Math.random() * 4 + 2,
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 2 - 1,
            alpha: 1
        });
    }
}

function updateParticles() {
    particles.forEach((p, index) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha -= 0.02;
        if (p.alpha <= 0) particles.splice(index, 1);
    });
}

// Draw function
function draw() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = "#8B4513"; // Brown (wood-like)
    ctx.fillRect(0, paddle1Y, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);

    // Draw ball
    ctx.fillStyle = "#FFD700"; // Gold-like color
    ctx.fillRect(ballX, ballY, ballSize, ballSize);

    // Draw net
    ctx.fillStyle = "white";
    for (let i = 0; i < canvas.height; i += 20) {
        ctx.fillRect(canvas.width / 2 - 1, i, 2, 10);
    }

    // Draw particles
    particles.forEach((p) => {
        ctx.fillStyle = `rgba(255, 255, 0, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Main game loop
function gameLoop() {
    update();
    updateParticles();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
