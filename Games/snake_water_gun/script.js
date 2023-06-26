var choices = ["snake", "water", "gun"];
var userScore = 0;
var computerScore = 0;

var resultText = document.getElementById("resultText");
var scoreText = document.getElementById("scoreText");
var computerEmoji = document.getElementById("computerEmoji");

function getComputerChoice() {
    var randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

function determineWinner(userChoice, computerChoice) {
    if (userChoice === computerChoice) {
        return "It's a tie!";
    } else if (
        (userChoice === "snake" && computerChoice === "water") ||
        (userChoice === "water" && computerChoice === "gun") ||
        (userChoice === "gun" && computerChoice === "snake")
    ) {
        return "You win!";
    } else {
        return "Computer wins!";
    }
}

function updateScore(result) {
    if (result === "You win!") {
        userScore++;
    } else if (result === "Computer wins!") {
        computerScore++;
    }
    scoreText.textContent = "Score: You - " + userScore + " | Computer - " + computerScore;
}

function play(userChoice) {
    var computerChoice = getComputerChoice();

    computerEmoji.textContent = getEmoji(computerChoice);

    var result = determineWinner(userChoice, computerChoice);
    resultText.textContent = result;

    updateScore(result);
}

function getEmoji(choice) {
    switch (choice) {
        case "snake":
            return "🐍";
        case "water":
            return "🌊";
        case "gun":
            return "🔫";
        default:
            return "";
    }
}
