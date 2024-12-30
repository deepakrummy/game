document.addEventListener('DOMContentLoaded', () => {
    // Get the game board element
    const gameBoard = document.getElementById('gameBoard'); // Game board element
    const startSound = document.getElementById('startSound'); // Start screen audio element
    const eatSound = document.getElementById('eatSound'); // Eat sound element
    const eatFruitSound = document.getElementById('eatFruitSound'); // Eat fruit sound element
    const powerUpSound = document.getElementById('powerUpSound'); // Power-up sound element
    const ghostEatenSound = document.getElementById('ghostEatenSound'); // Ghost eaten sound element
    const gameOverSound = document.getElementById('gameOverSound'); // Game over sound element

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

    // Start game after startscreen
    const initializeGame = () => {

    // Level layout (0 = empty, 1 = wall, 2 = pac-dot)
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
    layout.forEach((cell, index) => { // Loop through each cell in the layout
        const div = document.createElement('div'); // Create a new div element
        div.classList.add('cell'); // Add the cell class to the div

        if (cell === 1) { // If the cell is a wall
            div.classList.add('wall'); // Add the wall class to the div
        } else if (cell === 2) { // If the cell is a pac-dot
            div.classList.add('pac-dot'); // Add the pac-dot class to the div
            totalPacDots++; // Add to the total number of pac-dots
        }
        gameBoard.appendChild(div); // Append the div to the game board
        grid.push(div); // Add the div to the grid array
    });

    let pacmanCurrentIndex = 21; // Starting position
    grid[pacmanCurrentIndex].classList.add('pacman'); // Add the pacman class to the starting position

    // Kept this here so that the firs pac-dot is eaten and the backgriund of the pacman doesn't turn white
    if (grid[pacmanCurrentIndex].classList.contains('pac-dot')) { // If the pacman is on a pac-dot
        grid[pacmanCurrentIndex].classList.remove('pac-dot'); // Remove the pac-dot class
        score += 10; // Add 10 to the score
        totalPacDots--; // Subtract 1 from the total number of pac-dots
        document.getElementById('scoreValue').textContent = score; // Update the score display
        grid[pacmanCurrentIndex].style.backgroundColor = '#000'; // Set the background color to match the game board
    }

    // Function to spawn fruit
    const spawnFruit = () => {
        const fruitTypes = ['apple', 'orange', 'cherry', 'strawberry']; // Array of fruit types
    
        // Choose a random fruit type (math.floor rounds down to the nearest integer and math.random generates a random number between 0 and 1)
        // Math.random() * fruitTypes.length generates a random number between 0 and 3
        const randomFruit = fruitTypes[Math.floor(Math.random() * fruitTypes.length)]; // Choose a random fruit type
    
        // Choose a random cell that does not contain a wall
        const availableCells = grid.filter(cell => 
            !cell.classList.contains('wall') && // Filter out walls
            !cell.classList.contains('pacman') && // Filter out pacman
            !cell.classList.contains('ghost') // Filter out ghosts
        );
    
        if (availableCells.length > 0) { // If there are available cells
            // Choose a random cell (math.floor rounds down to the nearest integer and math.random generates a random number between 0 and 1)
            // Math.random() * availableCells.length generates a random number between 0 and the number of available cells
            const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)]; // Choose a random cell
            
            // Add fruit to the cell
            const fruitElement = document.createElement('div'); // Create a new div element
            fruitElement.classList.add('fruit', randomFruit); // Add the fruit and fruit type classes to the div
            randomCell.appendChild(fruitElement); // Append the div to the random cell
    
            // Remove the fruit after 10 seconds if it is not eaten
            setTimeout(() => {
                if (randomCell.contains(fruitElement)) { // If the random cell contains the fruit element
                    randomCell.removeChild(fruitElement); // Remove the fruit element
                }
            }, 10000); // 10 seconds
        }
    };
    
    // Start an interval to spawn fruit every 20 seconds
    setInterval(spawnFruit, 20000);
    
    // Function to move Pac-Man
    const movePacman = () => {
        if (!gameOver && direction !== null) { // If the game is not over and there is a direction
            let newIndex = pacmanCurrentIndex; // Set the new index to the current index
            let rotation = 0; // Set the rotation to 0 so that the pacman faces right at the start

            switch (direction) { // Switch statement to handle the direction
                case 'ArrowUp': // If the direction is up
                    if (pacmanCurrentIndex - cols >= 0 && !grid[pacmanCurrentIndex - cols].classList.contains('wall')) { // If the new index is within the grid and does not contain a wall
                        newIndex -= cols; // Subtract the number of columns from the new index so that it moves up
                        rotation = -90; // Rotate up
                    }
                    break; // Break out of the switch statement so that the pacman does not move in multiple directions
                case 'ArrowDown': // If the direction is down
                    if (pacmanCurrentIndex + cols < cols * rows && !grid[pacmanCurrentIndex + cols].classList.contains('wall')) {
                        newIndex += cols; // Add the number of columns to the new index so that it moves down
                        rotation = 90; // Rotate down
                    }
                    break;
                case 'ArrowLeft': // If the direction is left
                    if (pacmanCurrentIndex % cols !== 0 && !grid[pacmanCurrentIndex - 1].classList.contains('wall')) {
                        newIndex -= 1; // Subtract 1 from the new index so that it moves left
                        rotation = 180; // Rotate left
                    } else if (pacmanCurrentIndex % cols === 0) { // If the pacman is at the left portal
                        newIndex += cols - 1; // Move to the right portal
                        rotation = 180; // Rotate left
                    }
                    break;
                case 'ArrowRight': // If the direction is right
                    if (pacmanCurrentIndex % cols < cols - 1 && !grid[pacmanCurrentIndex + 1].classList.contains('wall')) {
                        newIndex += 1; // Add 1 to the new index so that it moves right
                        rotation = 0; // Rotate right
                    } else if (pacmanCurrentIndex % cols === cols - 1) {
                        newIndex -= cols - 1; // Move to the left portal
                        rotation = 0; // Rotate right
                    }
                    break;
            }

            if (grid[pacmanCurrentIndex].querySelector('.fruit')) { // If the current cell contains a fruit
                const fruit = grid[pacmanCurrentIndex].querySelector('.fruit'); // Get the fruit element
                let fruitScore = 0; // Initialize the fruit score so that it can be updated later
            
                // Decide the number of points based on the fruit type
                if (fruit.classList.contains('apple')) fruitScore = 100;
                else if (fruit.classList.contains('orange')) fruitScore = 150;
                else if (fruit.classList.contains('cherry')) fruitScore = 200;
                else if (fruit.classList.contains('strawberry')) fruitScore = 250;
            
                score += fruitScore; // Add the fruit score to the total score
                document.getElementById('scoreValue').textContent = score; // Update the score display

                // Show score indicator at the fruit position
                showScoreIndicator(`+${fruitScore}`, pacmanCurrentIndex);

                // Play the eat fruit sound
                eatFruitSound.play();
            
                // Delete fruit from grid
                fruit.remove();
            }            

            if (newIndex !== pacmanCurrentIndex) { // If the new index is different from the current index
                grid[pacmanCurrentIndex].classList.remove('pacman'); // Remove the pacman class from the current cell
                pacmanCurrentIndex = newIndex; // Update the current index to the new index
                grid[pacmanCurrentIndex].classList.add('pacman'); // Add the pacman class to the new cell
                grid[pacmanCurrentIndex].style.transform = `rotate(${rotation}deg)`; // Apply rotation when moving
    
                if (grid[pacmanCurrentIndex].classList.contains('pac-dot')) { // If the new cell contains a pac-dot
                    grid[pacmanCurrentIndex].classList.remove('pac-dot'); // Remove the pac-dot class
                    score += 10; // Add 10 to the score
                    totalPacDots--; // Subtract 1 from the total number of pac-dots
                    document.getElementById('scoreValue').textContent = score; // Update the score display
                    eatSound.play(); // Play the eat sound
                    console.log('Score:', score);
    
                    checkForWin(); // Check for win condition
                } else if (grid[pacmanCurrentIndex].classList.contains('power-pellet')) { // If the new cell contains a power-pellet
                    grid[pacmanCurrentIndex].classList.remove('power-pellet'); // Remove the power-pellet class
                    score += 50; // Add 50 to the score
                    totalPowerPellets--; // Subtract 1 from the total number of power-pellets
                    document.getElementById('scoreValue').textContent = score; // Update the score display
                    eatSound.play(); // Play the eat sound
                    powerUpSound.play(); // Play the power-up sound
                    console.log('Score:', score);
    
                    activatePowerPelletEffect(); // Activate the power-pellet effect
                }
    
                checkCollision(); // Check for collision
            }
    
            if (lives === 0) { // If the player has no lives left
                gameOver = true; // Set the game over flag to true
                endGame(); // End the game
            }
        }
    };

    const addRestartButtonListener = () => { // Function to add an event listener to the restart button
        // Event listener to the restart button
        document.getElementById('restartGameButton').addEventListener('click', () => { // When the restart button is clicked
            console.log('Restart button clicked');
            window.location.reload(); // Reload the page to restart the game
        });
    };

    const checkForWin = () => { // Function to check for the win condition
        if (totalPacDots === 0 && totalPowerPellets === 0) { // If there are no pac-dots and power-pellets left
            gameOver = true; // Set the game over flag to true
            clearInterval(gameLoop); // Clear the game loop
    
            ghosts.forEach(ghost => ghost.stop()); // Stop the ghosts
    
            // Delete existing overlay
            const existingOverlay = document.getElementById('gameOverOverlay'); // Get the existing overlay
            if (existingOverlay) { // If the overlay exists
                existingOverlay.remove(); // Remove the overlay
            }
    
            // Create new overlay
            const gameOverOverlay = document.createElement('div'); // Create a new div element
            gameOverOverlay.id = 'gameOverOverlay'; // Set the id of the div
            // Add the game over message to the div
            gameOverOverlay.innerHTML = `
                <div class="game-over-message">
                    <h1>Congratulations! You Won!</h1>
                    <button id="restartGameButton">Restart Game</button>
                </div>
            `;
            document.body.appendChild(gameOverOverlay); // Append the div to the body
    
            addRestartButtonListener(); // Add an event listener to the restart button
        }
    };
    
    const endGame = () => { // Function to end the game
        clearInterval(gameLoop); // Clear the game loop
    
        ghosts.forEach(ghost => ghost.stop()); // Stop the ghosts
    
        // Delete existing overlay
        const existingOverlay = document.getElementById('gameOverOverlay'); // Get the existing overlay
        if (existingOverlay) { // If the overlay exists
            existingOverlay.remove(); // Remove the overlay
        }
    
        // Create new overlay
        const gameOverOverlay = document.createElement('div'); // Create a new div element
        gameOverOverlay.id = 'gameOverOverlay'; // Set the id of the div
        // Add the game over message to the div
        gameOverOverlay.innerHTML = `
            <div class="game-over-message">
                <h1>Game Over!</h1>
                <button id="restartGameButton">Restart Game</button>
            </div>
        `;
        document.body.appendChild(gameOverOverlay); // Append the div to the body

        gameOverSound.play(); // Play the game over sound
    
        addRestartButtonListener();   // Add an event listener to the restart button  
    };
    
    let direction = null; // Direction variable to store the current direction
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
            direction = key;
        }
    });
    
      // Start the game when the start button is clicked (startscreen)
      document.getElementById('startGameButton').addEventListener('click', () => { // When the start button is clicked
        document.getElementById('startGameOverlay').style.display = 'none'; // Hide the start overlay
        initializeGame(); // Initialize the game
    });

    class Ghost {
        constructor(startIndex, color) { // Constructor to initialize the ghost
            this.startIndex = startIndex; // Set the start index
            this.currentIndex = startIndex; // Set the current index
            this.color = color;
            this.timerId = null; // Timer ID
            this.originalSpeed = 200; // Original speed
            this.currentSpeed = this.originalSpeed; // Current speed
            this.scared = false; // Initial scared state
            this.ghostElement = document.createElement('div'); // Create a new div element
            this.ghostElement.classList.add('ghost', this.color); // Add the ghost and color classes
            this.ghostElement.style.width = '20px'; // Set the width
            this.ghostElement.style.height = '20px'; // Set the height
            this.ghostElement.style.transform = 'rotate(0deg)'; // Prevent rotation
            grid[this.currentIndex].appendChild(this.ghostElement); // Append the div to the grid
            this.draw(); // Draw the ghost on the grid
        }        
    
        draw() { // Function to draw the ghost on the grid
            grid[this.currentIndex].appendChild(this.ghostElement);
        }
    
        scare() { // Function to scare the ghost
            this.scared = true; // Set the scared state to true
            this.currentSpeed = 400; // Slow down the ghost
            this.ghostElement.classList.add('scared'); // Add scared class
            this.restartMovement(); // Restart the movement
        }
    
        unscare() { // Function to unscare the ghost
            this.scared = false; // Set the scared state to false
            this.currentSpeed = this.originalSpeed; // Reset the speed
            this.ghostElement.classList.remove('scared'); // Remove scared class
            this.restartMovement(); // Restart the movement
        }
    
        restartMovement() { // Function to restart the movement
            clearInterval(this.timerId); // Stop the current movement
            this.moveGhost(); // Restart the movement with the new speed
        }

        resetPosition() { // Function to reset the ghost position
            this.ghostElement.classList.remove('ghost', this.color); // Remove the ghost and color classes
            this.currentIndex = this.startIndex; // Reset the current index
            grid[this.currentIndex].appendChild(this.ghostElement); // Append the ghost element to the grid
            this.ghostElement.classList.add('ghost', this.color); // Add the ghost and color classes
            if (this.scared) { // If the ghost is scared
                this.ghostElement.classList.add('scared'); // Retain scared class if ghost is scared
            }
        }
    
        moveGhost() { // Function to move the ghost
            const directions = [-1, +1, -cols, +cols]; // Array of directions
            const distanceToPacman = (ghostIndex, pacmanIndex) => { // Function to calculate the distance
                const ghostRow = Math.floor(ghostIndex / cols); // Calculate the row (ghost position divided by number of columns)
                const ghostCol = ghostIndex % cols; // Calculate the column by getting the remainder of the ghost position divided by number of columns
                const pacmanRow = Math.floor(pacmanIndex / cols); // Calculate the row (pacman position divided by number of columns)
                const pacmanCol = pacmanIndex % cols; // Calculate the column by getting the remainder of the pacman position divided by number of columns
                return Math.abs(ghostRow - pacmanRow) + Math.abs(ghostCol - pacmanCol); // Return the absolute difference between the rows and columns
            };
    
            const chooseDirection = () => { // Function to choose the direction
                const pacmanIndex = grid.findIndex(cell => cell.classList.contains('pacman')); // Find the index of the pacman
                const validDirections = directions.filter(direction => { // Filter the directions
                    const nextMove = this.currentIndex + direction; // Calculate the next move by adding the direction to the current index
                    return !grid[nextMove].classList.contains('wall') && !grid[nextMove].classList.contains('ghost'); // Return true if the next move is not a wall or ghost
                });
    
                validDirections.sort((dir1, dir2) => { // Sort the valid directions
                    const nextMove1 = this.currentIndex + dir1; // Calculate the next move for direction 1
                    const nextMove2 = this.currentIndex + dir2; // Calculate the next move for direction 2
                    return distanceToPacman(nextMove1, pacmanIndex) - distanceToPacman(nextMove2, pacmanIndex); // Return the difference in distance
                });
    
                return validDirections.length > 0 ? validDirections[0] : null; // Return the first valid direction or null
            };
    
            let direction = chooseDirection(); // Choose the direction
    
            this.timerId = setInterval(() => { // Set an interval to move the ghost
                if (!gameOver && direction !== null) { // If the game is not over and there is a direction
                    const nextMove = this.currentIndex + direction; // Calculate the next move by adding the direction to the current index
    
                    if (!grid[nextMove].classList.contains('wall') && !grid[nextMove].classList.contains('ghost')) { // If the next move is not a wall or ghost
                        grid[this.currentIndex].removeChild(this.ghostElement); // Remove the ghost element from the grid
                        this.currentIndex = nextMove; // Update the current index to the next move
                        grid[this.currentIndex].appendChild(this.ghostElement); // Append the ghost element to the grid
                    } else { // If the next move is a wall or ghost
                        direction = chooseDirection(); // Choose a new direction
                    }
                    if (this.currentIndex === pacmanCurrentIndex) { // If the ghost reaches the pacman
                        if (powerPelletActive) { // If the power-pellet is active
                            // Pac-Man eats the ghost
                            this.resetPosition(); // Reset ghost position
                            score += 200; // Increase score for eating a ghost
                            document.getElementById('scoreValue').textContent = score; // Update the score display
                            showScoreIndicator('+200', pacmanCurrentIndex); // Show score indicator
                            const ghostEatenSoundInstance = ghostEatenSound.cloneNode(); // Clone the sound element
                            ghostEatenSoundInstance.play(); // Play the cloned sound
                        } else { // If the power-pellet is not active
                            lives--; // Decrease the number of lives by 1
                            updateLivesDisplay(); // Update the lives display

                            if (lives === 0) { // If the player has no lives left
                                gameOver = true; // Set the game over flag to true
                                endGame(); // End the game
                            } else { // if the player has lives left
                                grid[pacmanCurrentIndex].classList.remove('pacman'); // Remove the pacman class
                                pacmanCurrentIndex = 21; // Reset the pacman position
                                grid[pacmanCurrentIndex].classList.add('pacman'); // Add the pacman class
                            }
                        }
                    }
    
                    // Handle portal logic for ghosts
                    if (this.currentIndex % cols === 0) { // If the ghost is at the left portal
                        this.currentIndex += cols - 1; // Move to the right portal
                    } else if (this.currentIndex % cols === cols - 1) { // If the ghost is at the right portal
                        this.currentIndex -= cols - 1; // Move to the left portal
                    }
                }
            }, this.currentSpeed); // Use the current speed
        }
    
        stop() {
            clearInterval(this.timerId); // Stop the ghost movement when the game is over
        }
    }
    
    // Function to show score indicator
    const showScoreIndicator = (text, index) => { // Function to show the score indicator
        const indicator = document.createElement('div'); // Create a new div element
        indicator.classList.add('score-indicator'); // Add the score indicator class
        indicator.textContent = text; // Set the text content of the indicator
        indicator.style.transform = 'rotate(0deg)'; // Prevent rotation
        grid[index].appendChild(indicator); // Append the indicator to the grid
    
        setTimeout(() => { // Set a timeout to remove the indicator
            indicator.remove();
        }, 1000); // Remove the indicator after 1 second
    };
    
    // Create the ghosts
    const ghost1 = new Ghost(209, 'red'); // Set the start index and color for the ghost
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
    
    const lifeIcons = [ // Array of life icons
        document.getElementById('life1'),
        document.getElementById('life2'),
        document.getElementById('life3')
    ];

    const updateLivesDisplay = () => { // Function to update the lives display
        console.log('Updating lives display. Current lives:', lives);
        for (let i = 0; i < lifeIcons.length; i++) { // Loop through each life icon
            if (i < lives) { // If the index is less than the number of lives 
                lifeIcons[i].style.display = 'inline-block'; // Display the life icon
            } else { // If the index is greater than or equal to the number of lives
                lifeIcons[i].style.display = 'none'; // Hide the life icon
            }
            console.log(`Life icon ${i + 1}: display is ${lifeIcons[i].style.display}`);
        }
    };

    const checkCollision = () => { // Function to check for collision
        ghosts.forEach(ghost => { // Loop through each ghost
            if (ghost.currentIndex === pacmanCurrentIndex) { // If the ghost index is the same as the pacman index
                if (powerPelletActive) { // If the power-pellet is active
                    // Pac-Man eats the ghost
                    ghost.resetPosition(); // Reset ghost position
                    score += 200; // Increase score for eating a ghost
                    document.getElementById('scoreValue').textContent = score;
                    showScoreIndicator('+200', pacmanCurrentIndex); // Show score indicator
                } else { // If the power-pellet is not active
                    lives--; // Decrease the number of lives by 1
                    updateLivesDisplay(); // Update the lives display
    
                    if (lives === 0) { // If the player has no lives left
                        gameOver = true; // Set the game over flag to true
                        endGame(); // End the game
                    } else { // If the player has lives left
                        grid[pacmanCurrentIndex].classList.remove('pacman'); // Remove the pacman class
                        pacmanCurrentIndex = 21; // Reset the pacman position
                        grid[pacmanCurrentIndex].classList.add('pacman'); // Add the pacman class
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

        const pacDotIndices = grid // Get the indices (positions) of all pac-dots
            .map((cell, index) => cell.classList.contains('pac-dot') ? index : -1) // Map the indices to -1 if they are not pac-dots
            .filter(index => index !== -1); // Filter out the -1 values

        if (pacDotIndices.length > 0) { // If there are pac-dots
            const randomIndex = pacDotIndices[Math.floor(Math.random() * pacDotIndices.length)]; // Choose a random pac-dot index
            grid[randomIndex].classList.remove('pac-dot'); // Delete pac-dot class
            grid[randomIndex].classList.add('power-pellet'); // Add new power-pellet class
            totalPacDots--; // Subtract 1 from the total number of pac-dots
            totalPowerPellets++; // Add 1 to the total number of power-pellets
        }
    };

    // Turn a random pac-dot into a power-pellet every 30 seconds
    powerPelletSpawnTimer = setInterval(turnPacDotIntoPowerPellet, 30000);

    // Function to make ghosts dark blue and slow
    const activatePowerPelletEffect = () => { // Function to activate the power-pellet effect
        powerPelletActive = true; // Set the power-pellet flag to true
        clearTimeout(powerPelletTimer); // Stop the previous power-pellet timer
        clearInterval(powerPelletSpawnTimer); // Stop spawning power-pellets
    
        // Scare the ghosts
        ghosts.forEach(ghost => ghost.scare());

        // Loop the power-up sound
        powerUpSound.loop = true
        powerUpSound.play();
    
        // After 10 seconds, deactivate the power-pellet effect
        powerPelletTimer = setTimeout(() => { // Set a timeout to deactivate the power-pellet effect
            powerPelletActive = false; // Set the power-pellet flag to false
            ghosts.forEach(ghost => ghost.unscare()); // Go through each ghost and unscare them
            
            // Restart the power-pellet spawn timer after 30 seconds
            powerPelletSpawnTimer = setInterval(turnPacDotIntoPowerPellet, 30000);
    
            // Stop the power-up sound
            powerUpSound.pause();
            powerUpSound.currentTime = 0; // Reset the sound to the beginning
        }, 10000); // Power pellet effect lasts for 10 seconds
    };
    

    // Event listener for Pac-Man eating a power-pellet
    grid.forEach(cell => { // Loop through each cell in the grid
        cell.addEventListener('pacmanEatPowerPellet', () => { // When Pac-Man eats a power-pellet
            activatePowerPelletEffect(); // Activate the power-pellet effect function
        });
    });

    // Start the game loop interval
    gameLoop = setInterval(movePacman, 200); // Move Pac-Man every 200ms
};

// Start the game when the start button is clicked
document.getElementById('startGameButton').addEventListener('click', () => { // When the start button is clicked
    document.getElementById('startGameOverlay').style.display = 'none'; // Hide the start overlay
    initializeGame(); // Initialize the game
});
  // Play the start sound when the start overlay is displayed
  startSound.play();
});
