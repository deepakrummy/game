document.addEventListener('DOMContentLoaded', () => {
    // Get the game board element
    const gameBoard = document.getElementById('gameBoard');

    // Initialize variables
    const grid = []; // Array to hold the grid cells
    const rows = 20; // Number of rows in the grid
    const cols = 20; // Number of columns in the grid
    let score = 0; // Player's score
    let lives = 3; // Player's lives
    let totalPacDots = 0; // Total number of pac-dots in the game
    let gameOver = false; // Flag to track game over state
    let gameLoop; // Variable to hold game loop interval

    // Level layout (0 = empty, 1 = wall, 2 = pac-dot)
    const layout = [
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,
        1,2,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1,1,2,1,
        1,2,2,2,2,2,2,2,1,2,2,2,1,2,1,2,2,2,2,1,
        1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,1,
        1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,1,
        1,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,
        1,1,1,2,1,1,1,1,1,2,1,1,1,1,1,2,1,1,1,1,
        1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,
        1,2,1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1,2,1,
        1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,
        1,2,1,2,1,1,1,1,1,1,1,1,1,2,1,1,1,1,2,1,
        1,2,1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,1,
        1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,1,2,1,
        1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,2,2,2,1,
        1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,1,1,1,
        1,2,2,2,2,2,2,2,1,2,2,2,1,2,2,2,2,2,2,1,
        1,2,1,1,1,1,1,2,1,2,1,2,1,2,1,1,1,1,2,1,
        1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
    ];

    // Create the grid
    layout.forEach((cell, index) => {
        const div = document.createElement('div');
        div.classList.add('cell');

        if (cell === 1) {
            div.classList.add('wall');
        } else if (cell === 2) {
            div.classList.add('pac-dot');
            totalPacDots++;
        }

        gameBoard.appendChild(div);
        grid.push(div);
    });

    let pacmanCurrentIndex = 21;
    grid[pacmanCurrentIndex].classList.add('pacman');

    if (grid[pacmanCurrentIndex].classList.contains('pac-dot')) {
        grid[pacmanCurrentIndex].classList.remove('pac-dot');
        score += 10;
        document.getElementById('scoreValue').textContent = score;
    }

    const movePacman = () => {
        if (!gameOver && direction !== null) {
            let newIndex = pacmanCurrentIndex;

            switch (direction) {
                case 'ArrowUp':
                    if (pacmanCurrentIndex - cols >= 0 && !grid[pacmanCurrentIndex - cols].classList.contains('wall')) {
                        newIndex -= cols;
                    }
                    break;
                case 'ArrowDown':
                    if (pacmanCurrentIndex + cols < cols * rows && !grid[pacmanCurrentIndex + cols].classList.contains('wall')) {
                        newIndex += cols;
                    }
                    break;
                case 'ArrowLeft':
                    if (pacmanCurrentIndex % cols !== 0 && !grid[pacmanCurrentIndex - 1].classList.contains('wall')) {
                        newIndex -= 1;
                    }
                    break;
                case 'ArrowRight':
                    if (pacmanCurrentIndex % cols < cols - 1 && !grid[pacmanCurrentIndex + 1].classList.contains('wall')) {
                        newIndex += 1;
                    }
                    break;
            }

            if (newIndex !== pacmanCurrentIndex) {
                grid[pacmanCurrentIndex].classList.remove('pacman');
                pacmanCurrentIndex = newIndex;
                grid[pacmanCurrentIndex].classList.add('pacman');

                if (grid[pacmanCurrentIndex].classList.contains('pac-dot')) {
                    grid[pacmanCurrentIndex].classList.remove('pac-dot');
                    score += 10;
                    document.getElementById('scoreValue').textContent = score;
                    console.log('Score:', score);

                    checkForWin();
                }

                checkCollision();
            }

            if (lives === 0) {
                gameOver = true;
                endGame();
            }
        }
    };

    const checkForWin = () => {
        if (score === 2030) {
            gameOver = true;
            clearInterval(gameLoop);

            ghost1.stop();
            ghost2.stop();

            setTimeout(() => {
                alert("Congratulations! You won!");
            }, 500);
        }
    };

    let direction = null;
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
            direction = key;
        }
    });

    const endGame = () => {
        clearInterval(gameLoop);

        ghost1.stop();
        ghost2.stop();

        setTimeout(() => {
            alert("Game over! You lost!");
        }, 500);
    };

    gameLoop = setInterval(movePacman, 200);

    class Ghost {
        constructor(startIndex, color) {
            this.currentIndex = startIndex;
            this.color = color;
            this.timerId = null;
        }

        moveGhost() {
            const directions = [-1, +1, -cols, +cols];

            const distanceToPacman = (ghostIndex, pacmanIndex) => {
                const ghostRow = Math.floor(ghostIndex / cols);
                const ghostCol = ghostIndex % cols;
                const pacmanRow = Math.floor(pacmanIndex / cols);
                const pacmanCol = pacmanIndex % cols;
                return Math.abs(ghostRow - pacmanRow) + Math.abs(ghostCol - pacmanCol);
            };

            const chooseDirection = () => {
                const pacmanIndex = grid.findIndex(cell => cell.classList.contains('pacman'));

                const validDirections = directions.filter(direction => {
                    const nextMove = this.currentIndex + direction;
                    return !grid[nextMove].classList.contains('wall') && !grid[nextMove].classList.contains('ghost');
                });

                validDirections.sort((dir1, dir2) => {
                    const nextMove1 = this.currentIndex + dir1;
                    const nextMove2 = this.currentIndex + dir2;
                    return distanceToPacman(nextMove1, pacmanIndex) - distanceToPacman(nextMove2, pacmanIndex);
                });

                return validDirections.length > 0 ? validDirections[0] : null;
            };

            let direction = chooseDirection();

            this.timerId = setInterval(() => {
                if (!gameOver && direction !== null) {
                    const nextMove = this.currentIndex + direction;

                    if (!grid[nextMove].classList.contains('wall') && !grid[nextMove].classList.contains('ghost')) {
                        grid[this.currentIndex].classList.remove('ghost', this.color);
                        this.currentIndex = nextMove;
                        grid[this.currentIndex].classList.add('ghost', this.color);
                    } else {
                        direction = chooseDirection();
                    }

                    if (this.currentIndex === pacmanCurrentIndex) {
                        lives--;
                        updateLivesDisplay();

                        if (lives === 0) {
                            gameOver = true;
                            endGame();
                        } else {
                            grid[pacmanCurrentIndex].classList.remove('pacman');
                            pacmanCurrentIndex = 21;
                            grid[pacmanCurrentIndex].classList.add('pacman');
                        }
                    }
                }
            }, 200);
        }

        stop() {
            clearInterval(this.timerId);
        }
    }

    const ghost1 = new Ghost(209, 'red');
    const ghost2 = new Ghost(229, 'blue');

    ghost1.moveGhost();
    ghost2.moveGhost();

    const lifeIcons = [
        document.getElementById('life1'),
        document.getElementById('life2'),
        document.getElementById('life3')
    ];

    const updateLivesDisplay = () => {
        console.log('Updating lives display. Current lives:', lives);
        for (let i = 0; i < lifeIcons.length; i++) {
            if (i < lives) {
                lifeIcons[i].style.display = 'inline-block'; // Display the life icon
            } else {
                lifeIcons[i].style.display = 'none'; // Hide the life icon
            }
            console.log(`Life icon ${i + 1}: display is ${lifeIcons[i].style.display}`);
        }
    };

    const checkCollision = () => {
        if (grid[pacmanCurrentIndex].classList.contains('ghost')) {
            lives--; // Decrease lives
            updateLivesDisplay(); // Update visual display of lives

            // Reset Pac-Man's position
            grid[pacmanCurrentIndex].classList.remove('pacman');
            pacmanCurrentIndex = 21;
            grid[pacmanCurrentIndex].classList.add('pacman');

            // Check if there are no lives left
            if (lives === 0) {
                gameOver = true;
                endGame(); // Game over
            }
        }
    };

    // Check for collision on Pac-Man movement
    setInterval(checkCollision, 100); // Check collision every 100ms
});