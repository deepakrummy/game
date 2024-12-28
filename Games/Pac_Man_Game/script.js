document.addEventListener('DOMContentLoaded', () => {
    // Get the game board element
    const gameBoard = document.getElementById('gameBoard');
    const startSound = document.getElementById('startSound'); // Start screen audio element
    const eatSound = document.getElementById('eatSound'); // Eat sound element
    const powerUpSound = document.getElementById('powerUpSound'); // Power-up sound element
    const ghostEatenSound = document.getElementById('ghostEatenSound'); // Ghost eaten sound element

    // Initialize variables
    const grid = []; // Array to hold the grid cells
    const rows = 24; // Updated number of rows in the grid
    const cols = 20; // Number of columns in the grid
    let score = 0; // Player's score
    let lives = 3; // Player's lives
    let totalPacDots = 0; // Total number of pac-dots in the game
    let totalPowerPellets = 0; // Total number of power-pellets in the game
    let gameOver = false; // Flag to track game over state
    let gameLoop; // Variable to hold game loop interval
    let powerPelletActive = false; // Flag to track power pellet state
    let powerPelletTimer; // Timer for power pellet effect
    let powerPelletSpawnTimer; // Timer for spawning power pellets

    const initializeGame = () => {

    // Level layout (0 = empty, 1 = wall, 2 = pac-dot, 3 = power-pellet)
    const layout = [
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,
        1,2,1,2,1,1,1,1,2,1,1,2,1,1,1,1,2,1,2,1,
        1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,
        1,2,1,1,1,1,1,2,1,1,1,2,1,2,1,1,1,1,2,1,
        1,2,2,2,2,2,2,2,1,2,2,2,1,2,1,2,2,2,2,1,
        1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,1,
        1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,1,
        1,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,
        1,2,1,2,1,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,
        1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,
        0,2,1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1,2,0,
        1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,
        1,2,1,2,1,1,1,1,1,1,1,1,1,2,1,1,1,1,2,1,
        1,2,1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,1,
        1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,1,2,1,
        1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,2,2,2,1,
        1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,1,2,1,
        1,2,2,2,2,2,2,2,1,2,2,2,1,2,2,2,2,2,2,1,
        1,2,1,1,1,1,1,2,1,2,1,2,1,2,1,1,1,1,2,1,
        1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1,
        1,2,1,1,2,1,1,1,2,1,1,1,2,1,1,2,1,1,2,1,
        1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,
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
        } else if (cell === 3) {
            div.classList.add('power-pellet');
            totalPowerPellets++;
        }

        gameBoard.appendChild(div);
        grid.push(div);
    });

    let pacmanCurrentIndex = 21;
    grid[pacmanCurrentIndex].classList.add('pacman');

    if (grid[pacmanCurrentIndex].classList.contains('pac-dot')) {
        grid[pacmanCurrentIndex].classList.remove('pac-dot');
        score += 10;
        totalPacDots--;
        document.getElementById('scoreValue').textContent = score;
    }

    const spawnFruit = () => {
        const fruitTypes = ['apple', 'orange', 'cherry', 'strawberry'];
    
        // Choose a random fruit type
        const randomFruit = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];
    
        // Choose a random cell that does not contain a wall
        const availableCells = grid.filter(cell => 
            !cell.classList.contains('wall') && 
            !cell.classList.contains('pacman') && 
            !cell.classList.contains('ghost')
        );
    
        if (availableCells.length > 0) {
            const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
            
            // Add fruit to the cell
            const fruitElement = document.createElement('div');
            fruitElement.classList.add('fruit', randomFruit);
            randomCell.appendChild(fruitElement);
    
            // Remove the fruit after 10 seconds if it is not eaten
            setTimeout(() => {
                if (randomCell.contains(fruitElement)) {
                    randomCell.removeChild(fruitElement);
                }
            }, 10000); // 10 seconds
        }
    };
    
    // Start an interval to spawn fruit every 20 seconds
    setInterval(spawnFruit, 20000);
    

    const movePacman = () => {
        if (!gameOver && direction !== null) {
            let newIndex = pacmanCurrentIndex;
            let rotation = 0;

            switch (direction) {
                case 'ArrowUp':
                    if (pacmanCurrentIndex - cols >= 0 && !grid[pacmanCurrentIndex - cols].classList.contains('wall')) {
                        newIndex -= cols;
                        rotation = -90; // Rotate up
                    }
                    break;
                case 'ArrowDown':
                    if (pacmanCurrentIndex + cols < cols * rows && !grid[pacmanCurrentIndex + cols].classList.contains('wall')) {
                        newIndex += cols;
                        rotation = 90; // Rotate down
                    }
                    break;
                case 'ArrowLeft':
                    if (pacmanCurrentIndex % cols !== 0 && !grid[pacmanCurrentIndex - 1].classList.contains('wall')) {
                        newIndex -= 1;
                        rotation = 180; // Rotate left
                    } else if (pacmanCurrentIndex % cols === 0) {
                        newIndex += cols - 1; // Move to the right portal
                        rotation = 180; // Rotate left
                    }
                    break;
                case 'ArrowRight':
                    if (pacmanCurrentIndex % cols < cols - 1 && !grid[pacmanCurrentIndex + 1].classList.contains('wall')) {
                        newIndex += 1;
                        rotation = 0; // Rotate right
                    } else if (pacmanCurrentIndex % cols === cols - 1) {
                        newIndex -= cols - 1; // Move to the left portal
                        rotation = 0; // Rotate right
                    }
                    break;
            }

            if (grid[pacmanCurrentIndex].querySelector('.fruit')) {
                const fruit = grid[pacmanCurrentIndex].querySelector('.fruit');
                let fruitScore = 0;
            
                // Decide the number of points based on the fruit type
                if (fruit.classList.contains('apple')) fruitScore = 100;
                else if (fruit.classList.contains('orange')) fruitScore = 150;
                else if (fruit.classList.contains('cherry')) fruitScore = 200;
                else if (fruit.classList.contains('strawberry')) fruitScore = 250;
            
                score += fruitScore;
                document.getElementById('scoreValue').textContent = score;
            
                // Delete fruit from grid
                fruit.remove();
            }            

            if (newIndex !== pacmanCurrentIndex) {
                grid[pacmanCurrentIndex].classList.remove('pacman');
                pacmanCurrentIndex = newIndex;
                grid[pacmanCurrentIndex].classList.add('pacman');
                grid[pacmanCurrentIndex].style.transform = `rotate(${rotation}deg)`; // Apply rotation
    
                if (grid[pacmanCurrentIndex].classList.contains('pac-dot')) {
                    grid[pacmanCurrentIndex].classList.remove('pac-dot');
                    score += 10;
                    totalPacDots--;
                    document.getElementById('scoreValue').textContent = score;
                    eatSound.play(); // Play the eat sound
                    console.log('Score:', score);
    
                    checkForWin();
                } else if (grid[pacmanCurrentIndex].classList.contains('power-pellet')) {
                    grid[pacmanCurrentIndex].classList.remove('power-pellet');
                    score += 50;
                    totalPowerPellets--;
                    document.getElementById('scoreValue').textContent = score;
                    eatSound.play(); // Play the eat sound
                    powerUpSound.play(); // Play the power-up sound
                    console.log('Score:', score);
    
                    activatePowerPellet();
                }
    
                checkCollision();
            }
    
            if (lives === 0) {
                gameOver = true;
                endGame();
            }
        }
    };

    const activatePowerPellet = () => {
        powerPelletActive = true;
        clearTimeout(powerPelletTimer);
        clearInterval(powerPelletSpawnTimer); // Stop spawning new power-pellets during the effect

        ghosts.forEach(ghost => ghost.scare());

        powerPelletTimer = setTimeout(() => {
            powerPelletActive = false;
            ghosts.forEach(ghost => ghost.unscare());
            // Restart the power-pellet spawn timer
            powerPelletSpawnTimer = setInterval(turnPacDotIntoPowerPellet, 30000);
            powerUpSound.pause(); // Stop the power-up sound
            powerUpSound.currentTime = 0; // Reset the power-up sound
        }, 10000); // Power pellet effect lasts for 10 seconds
    };

    const checkForWin = () => {
        if (totalPacDots === 0 && totalPowerPellets === 0) {
            gameOver = true;
            clearInterval(gameLoop);
    
            ghosts.forEach(ghost => ghost.stop());
    
            // Delete existing overlay
            const existingOverlay = document.getElementById('gameOverOverlay');
            if (existingOverlay) {
                existingOverlay.remove();
            }
    
            // Create new overlay
            const gameOverOverlay = document.createElement('div');
            gameOverOverlay.id = 'gameOverOverlay';
            gameOverOverlay.innerHTML = `
                <div class="game-over-message">
                    <h1>Congratulations! You Won!</h1>
                    <button id="restartGameButton">Restart Game</button>
                </div>
            `;
            document.body.appendChild(gameOverOverlay);
    
            // Event listener for restart button
            document.getElementById('restartGameButton').addEventListener('click', () => {
                console.log('Restart button clicked');
                window.location.reload(); // Reload the page
            });            
        }
    };
    
    const endGame = () => {
        clearInterval(gameLoop);
    
        ghosts.forEach(ghost => ghost.stop());
    
        // Delete existing overlay
        const existingOverlay = document.getElementById('gameOverOverlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
    
        // Create new overlay
        const gameOverOverlay = document.createElement('div');
        gameOverOverlay.id = 'gameOverOverlay';
        gameOverOverlay.innerHTML = `
            <div class="game-over-message">
                <h1>Game Over!</h1>
                <button id="restartGameButton">Restart Game</button>
            </div>
        `;
        document.body.appendChild(gameOverOverlay);
    
        // Event listener for restart button
        document.getElementById('restartGameButton').addEventListener('click', () => {
            console.log('Restart button clicked');
            window.location.reload(); // Reload the page
        });        
    };
    
    let direction = null;
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
            direction = key;
        }
    });
    
      // Start the game when the start button is clicked
      document.getElementById('startGameButton').addEventListener('click', () => {
        document.getElementById('startGameOverlay').style.display = 'none'; // Hide the start overlay
        initializeGame(); // Initialize the game
    });

    class Ghost {
        constructor(startIndex, color) {
            this.startIndex = startIndex;
            this.currentIndex = startIndex;
            this.color = color;
            this.timerId = null;
            this.originalSpeed = 200; // Original speed
            this.currentSpeed = this.originalSpeed; // Current speed
            this.scared = false;
            this.ghostElement = document.createElement('div');
            this.ghostElement.classList.add('ghost', this.color);
            this.ghostElement.style.width = '20px'; // Set the width
            this.ghostElement.style.height = '20px'; // Set the height
            this.ghostElement.style.transform = 'rotate(0deg)'; // Prevent rotation
            grid[this.currentIndex].appendChild(this.ghostElement);
            this.draw(); // Draw the ghost on the grid
        }        
    
        draw() {
            grid[this.currentIndex].appendChild(this.ghostElement);
        }
    
        scare() {
            this.scared = true;
            this.currentSpeed = 400; // Slow down the ghost
            this.ghostElement.classList.add('scared'); // Add scared class
            this.restartMovement();
        }
    
        unscare() {
            this.scared = false;
            this.currentSpeed = this.originalSpeed;
            this.ghostElement.classList.remove('scared'); // Remove scared class
            this.restartMovement();
        }
    
        restartMovement() {
            clearInterval(this.timerId); // Stop the current movement
            this.moveGhost(); // Restart the movement with the new speed
        }

        resetPosition() {
            this.ghostElement.classList.remove('ghost', this.color);
            this.currentIndex = this.startIndex;
            grid[this.currentIndex].appendChild(this.ghostElement);
            this.ghostElement.classList.add('ghost', this.color);
            if (this.scared) {
                this.ghostElement.classList.add('scared'); // Retain scared class if ghost is scared
            }
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
                        grid[this.currentIndex].removeChild(this.ghostElement);
                        this.currentIndex = nextMove;
                        grid[this.currentIndex].appendChild(this.ghostElement);
                    } else {
                        direction = chooseDirection();
                    }
                    if (this.currentIndex === pacmanCurrentIndex) {
                        if (powerPelletActive) {
                            // Pac-Man eats the ghost
                            this.resetPosition(); // Reset ghost position
                            score += 200; // Increase score for eating a ghost
                            document.getElementById('scoreValue').textContent = score;
                            showScoreIndicator('+200', pacmanCurrentIndex); // Show score indicator
                            const ghostEatenSoundInstance = ghostEatenSound.cloneNode(); // Clone the sound element
                            ghostEatenSoundInstance.play(); // Play the cloned sound
                        } else {
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
    
                    // Handle portal logic for ghosts
                    if (this.currentIndex % cols === 0) {
                        this.currentIndex += cols - 1; // Move to the right portal
                    } else if (this.currentIndex % cols === cols - 1) {
                        this.currentIndex -= cols - 1; // Move to the left portal
                    }
                }
            }, this.currentSpeed); // Use the current speed
        }
    
        stop() {
            clearInterval(this.timerId);
        }
    }
    
    // Function to show score indicator
    const showScoreIndicator = (text, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('score-indicator');
        indicator.textContent = text;
        indicator.style.transform = 'rotate(0deg)'; // Prevent rotation
        grid[index].appendChild(indicator);
    
        setTimeout(() => {
            indicator.remove();
        }, 1000); // Remove the indicator after 1 second
    };
    
    const ghost1 = new Ghost(209, 'red');
    const ghost2 = new Ghost(229, 'blue');
    const ghost3 = new Ghost(249, 'pink');
    const ghosts = [ghost1, ghost2, ghost3]; // Add all ghosts to an array
    
    setTimeout(() => {
        ghost1.moveGhost();
    }, 5000); // Start moving after 5 seconds
    
    setTimeout(() => {
        ghost2.moveGhost();
    }, 15000); // Start moving after 15 seconds
    
    setTimeout(() => {
        ghost3.moveGhost();
    }, 30000); // Start moving after 30 seconds
    
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
        ghosts.forEach(ghost => {
            if (ghost.currentIndex === pacmanCurrentIndex) {
                if (powerPelletActive) {
                    // Pac-Man eats the ghost
                    ghost.resetPosition(); // Reset ghost position
                    score += 200; // Increase score for eating a ghost
                    document.getElementById('scoreValue').textContent = score;
                    showScoreIndicator('+200', pacmanCurrentIndex); // Show score indicator
                } else {
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
        });
    };

    // Check for collision on Pac-Man movement
    setInterval(checkCollision, 100); // Check collision every 100ms

    // Function to randomly turn a pac-dot into a power-pellet
    const turnPacDotIntoPowerPellet = () => {
        // Check if there is already a power-pellet on the grid
        const existingPowerPellet = grid.some(cell => cell.classList.contains('power-pellet'));
        if (existingPowerPellet) return; // Exit if there is already a power-pellet

        const pacDotIndices = grid
            .map((cell, index) => cell.classList.contains('pac-dot') ? index : -1)
            .filter(index => index !== -1);

        if (pacDotIndices.length > 0) {
            const randomIndex = pacDotIndices[Math.floor(Math.random() * pacDotIndices.length)];
            grid[randomIndex].classList.remove('pac-dot'); // Delete pac-dot class
            grid[randomIndex].classList.add('power-pellet'); // Add new power-pellet class
            totalPacDots--;
            totalPowerPellets++;
        }
    };

    // Turn a random pac-dot into a power-pellet every 30 seconds
    powerPelletSpawnTimer = setInterval(turnPacDotIntoPowerPellet, 30000);

    // Function to make ghosts dark blue and slow
    const activatePowerPelletEffect = () => {
        powerPelletActive = true;
        clearTimeout(powerPelletTimer);
        clearInterval(powerPelletSpawnTimer); // Stop spawning new power-pellets during the effect

        ghosts.forEach(ghost => ghost.scare());

        powerPelletTimer = setTimeout(() => {
            powerPelletActive = false;
            ghosts.forEach(ghost => ghost.unscare());
            // Restart the power-pellet spawn timer
            powerPelletSpawnTimer = setInterval(turnPacDotIntoPowerPellet, 30000);
        }, 10000); // Power pellet effect lasts for 10 seconds
    };

    // Event listener for Pac-Man eating a power-pellet
    grid.forEach(cell => {
        cell.addEventListener('pacmanEatPowerPellet', () => {
            activatePowerPelletEffect();
        });
    });

    // Start the game loop
    gameLoop = setInterval(movePacman, 200);
};

// Start the game when the start button is clicked
document.getElementById('startGameButton').addEventListener('click', () => {
    document.getElementById('startGameOverlay').style.display = 'none'; // Hide the start overlay
    initializeGame(); // Initialize the game
});
  // Play the start sound when the start overlay is displayed
  startSound.play();
});
