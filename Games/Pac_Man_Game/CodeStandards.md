# Code Standards

## 1. File Structure
- Keep HTML, CSS, and JavaScript in separate files.
- Use clear and descriptive names for files and folders.

## 2. HTML
- Use meaningful HTML tags.
- Link CSS and JavaScript files in the `<head>` or at the end of the `<body>`.
- Use meaningful `id` and `class` names.

## 3. CSS
- Use consistent class names (e.g., `kebab-case`).
- Group related styles together.
- Use comments to separate sections.
- Use relative units (e.g., `em`, `rem`) for sizes.
- Use `z-index` sparingly.
- Use CSS animations for effects.

## 4. JavaScript
- Use `const` and `let` instead of `var`.
- Use `const` for variables that don't change.
- Use `let` for variables that can change.
- Use clear names for variables and functions.
- Use camelCase for variables and functions.
- Use PascalCase for class names.
- Group related functions together.
- Add comments above and/or next to code to explain it.
- Use template literals for strings.
- Use event listeners for user interactions.
- Use `setInterval` and `setTimeout` for timed actions.
- Use `querySelector` and `querySelectorAll` to select elements.
- Use `classList` to add, remove, and toggle classes.
- Use `appendChild` and `removeChild` for DOM changes.
- Use `addEventListener` for events.

### Example

```javascript
// Use const for variables that do not change
const gameBoard = document.getElementById('gameBoard');

// Use let for variables that may change
let score = 0;

// Use descriptive names for functions
const initializeGame = () => {
    // Function logic here
};

// Use event listeners to handle user interactions
document.addEventListener('DOMContentLoaded', initializeGame);

// Use template literals for string concatenation
const updateScore = (points) => {
    score += points;
    document.getElementById('scoreValue').textContent = `Score: ${score}`;
};

// Use arrow functions for anonymous functions
document.getElementById('startGameButton').addEventListener('click', () => {
    // Start game logic here
});