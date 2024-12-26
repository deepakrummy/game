const canvas = document.querySelector('canvas'); // Get the canvas element
const c = canvas.getContext('2d'); // Get the context of the canvas

const score = document.querySelector('#score'); // Get the score element

// Define the size of each cell in the map
const cellSize = 40;

// Calculate the canvas size based on the map dimensions
const mapWidth = 19; // Number of columns in the map
const mapHeight = 15; // Number of rows in the map

canvas.width = mapWidth * cellSize; // Set the width of the canvas based on the map width
canvas.height = mapHeight * cellSize; // Set the height of the canvas based on the map height

// Prevent scrollbars
document.body.style.overflow = 'hidden';

// Create a class for the player
class Boundary {
    static width = 40;
    static height = 40;
    constructor({position}) { // The constructor takes an object with a position property so we can destructure it
        this.position = position; // Set the position of the player
        this.width = 40; 
        this.height = 40;
    }
    draw() {
        c.fillStyle = 'blue';
        c.fillRect(this.position.x, this.position.y, this.width, this.height); // Draw the player
    }
}

class Pacman {
    constructor({position, velocity}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.radians = 0.75; // Start with the mouth closed
        this.openRate = 0.05; // How fast the mouth opens and closes
        this.rotation = 0; // Rotation of Pacman starts at 0
    }
    draw() {
        c.save(); // Save the current state of the canvas
        c.translate(this.position.x, this.position.y); // Translate the canvas to the position of Pacman so we can rotate around him
        c.rotate(this.rotation); // Rotation of Pacman so the mouth opens in the right direction
        c.translate(-this.position.x, -this.position.y); // Translate the canvas back to the original position
        c.fillStyle = 'yellow'; // Set the fill color to yellow
        c.beginPath(); // Start a new path
        c.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI * 2 - this.radians); // Draw the mouth of Pacman with the current radians. Math.PI * 2 is a full circle
        c.lineTo(this.position.x, this.position.y); // Draw a line to the center of Pacman to close the mouth
        c.fill(); // Fill the path with the current fill color
        c.closePath(); // Close the path so we can start a new one
        c.restore(); // Restore the canvas to the previous state
    }
    update() {
        this.draw(); // Draw Pacman
        this.position.x += this.velocity.x; // Move Pacman on the x-axis
        this.position.y += this.velocity.y; // Move Pacman on the y-axis

        // Calculate the rotation of Pacman based on his velocity
        if (this.velocity.x !== 0 || this.velocity.y !== 0) { // Check if Pacman is moving
            this.rotation = Math.atan2(this.velocity.y, this.velocity.x); // Rotate Pacman based on his velocity
        }

        // Open and close the mouth of Pacman
        if (this.radians < 0 || this.radians > 0.75) this.openRate = -this.openRate; // Change the open rate if the mouth is fully open or closed
        this.radians += this.openRate; // Change the radians of Pacman
    }
}

class Ghost {
    constructor({position, velocity, color = 'pink'}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.color = color;
        this.startMoving = false;
        this.originalSpeed = Math.hypot(velocity.x, velocity.y); // Bewaar de oorspronkelijke snelheid
    }
    draw() {
        c.fillStyle = this.color;
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fill();
        c.closePath();
    }
    update() {
        this.draw();
        if (this.startMoving) {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }
    }
}

class Pellet {
    constructor({position}) {
        this.position = position;
        this.radius = 3;
    }
    draw() {
        c.fillStyle = 'white';
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fill()
        c.closePath()
    }
}

const pellets = []
const boundaries = []
const ghosts = []

const pacman = new Pacman({
    position: {
        x: Boundary.width + Boundary.width / 2,
        y: Boundary.height + Boundary.height / 2
    },
    velocity: {
        x: 0,
        y: 0
    }
})

const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].reduce((acc, key) => {
    acc[key] = { pressed: false };
    return acc;
}, {});

let lastKey = ''
let scoreValue = 0
let lives = 3;

function updateLives() {
    const livesContainer = document.getElementById('livesContainer');
    livesContainer.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        const life = document.createElement('span');
        life.classList.add('life');
        livesContainer.appendChild(life);
    }
}

// Create an array to store the boundaries
const map = [
    ['-','-','-','-','-','-','-'],
    ['-',' ',' ',' ',' ',' ','-'],
    ['-',' ','-',' ','-',' ','-'],
    ['-',' ',' ',' ',' ',' ','-'],
    ['-',' ','-',' ','-',' ','-'],
    ['-',' ',' ',' ',' ',' ','-'],
    ['-','-','-','-','-','-','-']
]

map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {
            case '-':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        }
                    })
                )
            break
        }
    })
})

function circleCollidesWithRectangle({circle, rectangle}) {
    const padding = Boundary.width / 2 - circle.radius - 1
    return (
        circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding &&
        circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding &&
        circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding &&
        circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding
    )
}

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    
    if (keys.ArrowUp.pressed && lastKey === 'ArrowUp') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle: {...pacman, velocity: {
                    x: 0, 
                    y: -1.5 // Adjusted speed
                }},
                rectangle: boundary
                })
            ) {
                pacman.velocity.y = 0
                break
            } else {
                pacman.velocity.y = -1.5 // Adjusted speed
            }
        }
    } else if (keys.ArrowLeft.pressed && lastKey === 'ArrowLeft') {
          for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle: {...pacman, velocity: {
                    x: -1.5, // Adjusted speed
                    y: 0
                }},
                rectangle: boundary
                })
            ) {
                pacman.velocity.x = 0
                break
            } else {
                pacman.velocity.x = -1.5 // Adjusted speed
            }
        }
    } else if (keys.ArrowDown.pressed && lastKey === 'ArrowDown') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle: {...pacman, velocity: {
                    x: 0, 
                    y: 1.5 // Adjusted speed
                }},
                rectangle: boundary
                })
            ) {
                pacman.velocity.y = 0
                break
            } else {
                pacman.velocity.y = 1.5 // Adjusted speed
            }
        }
    } else if (keys.ArrowRight.pressed && lastKey === 'ArrowRight') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle: {...pacman, velocity: {
                    x: 1.5, // Adjusted speed
                    y: 0
                }},
                rectangle: boundary
                })
            ) {
                pacman.velocity.x = 0
                break
            } else {
                pacman.velocity.x = 1.5 // Adjusted speed
            }
        }
    }

    // Check for portal collisions
    if (pacman.position.x < 0) {
        pacman.position.x = canvas.width - pacman.radius;
    } else if (pacman.position.x > canvas.width) {
        pacman.position.x = pacman.radius;
    }

    // Check for pellet collisions	
    pellets.forEach((pellet, i) => { // Loop through the pellets
        pellet.draw() // Draw the pellet

        // Check if the pellet collides with the player
        if (Math.hypot(pellet.position.x - pacman.position.x, // Calculate the x and y distance between the pellet and the pacman
            pellet.position.y - pacman.position.y
        ) < pellet.radius + pacman.radius // Check if the distance is less than what it would be if the two circles were colliding
    ) {
            pellets.splice(i, 1) // Remove the pellet from the array when it collides with the pacman
            scoreValue += 10 // Increase the score by 10
            score.innerHTML = scoreValue // Update the score element

            // Check if all pellets are collected
            if (pellets.length === 0) {
                setTimeout(() => {
                    alert('Congratulations! You have won!');
                    window.location.reload(); // Refresh the page instead of initializing the game
                }, 100);
            }
        }
    })
    boundaries.forEach((boundary) => {
        boundary.draw()
    
    if (
        circleCollidesWithRectangle({
            circle: pacman,
            rectangle: boundary
        })
    ) {
        pacman.velocity.x = 0
        pacman.velocity.y = 0
    }
})
pacman.update()

ghosts.forEach((ghost) => {
    ghost.update();

    // Check for portal collisions for ghosts
    if (ghost.position.x < 0) {
        ghost.position.x = canvas.width - ghost.radius;
    } else if (ghost.position.x > canvas.width) {
        ghost.position.x = ghost.radius;
    }

    let collision = false;
    boundaries.forEach(boundary => {
        if (circleCollidesWithRectangle({
            circle: {...ghost, velocity: {
                x: ghost.velocity.x,
                y: ghost.velocity.y
            }},
            rectangle: boundary
        })) {
            collision = true;
        }
    });

    if (collision) {
        // Stop the ghost and set a random new direction, but use original speed
        ghost.velocity.x = 0;
        ghost.velocity.y = 0;

        // Possible directions to move
        const directions = [
            { direction: 'right', x: ghost.originalSpeed, y: 0 },
            { direction: 'left', x: -ghost.originalSpeed, y: 0 },
            { direction: 'up', x: 0, y: -ghost.originalSpeed },
            { direction: 'down', x: 0, y: ghost.originalSpeed }
        ];

        // Function to check if a move is valid (not blocked by a boundary)
        const isMoveValid = (newX, newY) => {
            let valid = true;
            boundaries.forEach(boundary => {
                if (circleCollidesWithRectangle({
                    circle: { ...ghost, velocity: { x: newX, y: newY } },
                    rectangle: boundary
                })) {
                    valid = false;
                }
            });
            return valid;
        };

        // Filter out invalid moves
        const validDirections = directions.filter(({x, y}) => isMoveValid(x, y));

        // If there are valid directions, pick one
        if (validDirections.length > 0) {
            const randomDirection = validDirections[Math.floor(Math.random() * validDirections.length)];
            ghost.velocity = { x: randomDirection.x, y: randomDirection.y };
        }
    }

    // Check for collision with Pac-Man
    if (Math.hypot(ghost.position.x - pacman.position.x, ghost.position.y - pacman.position.y) < ghost.radius + pacman.radius) {
        lives -= 1;
        updateLives();
        if (lives === 0) {
            alert('Game Over!');
            window.location.reload(); // Refresh the page instead of initializing the game
        } else {
            // Reset Pac-Man position
            pacman.position = {
                x: Boundary.width + Boundary.width / 2,
                y: Boundary.height + Boundary.height / 2
            };
            pacman.velocity = {
                x: 0,
                y: 0
            };
        }
    }
})
}

initializeGame();
animate()

window.addEventListener('keydown', ({key}) => keys[key] && (keys[key].pressed = true, lastKey = key));
window.addEventListener('keyup', ({key}) => keys[key] && (keys[key].pressed = false));
