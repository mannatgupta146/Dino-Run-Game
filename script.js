const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");
const scoreDisplay = document.getElementById("score");
const gameOver = document.getElementById("game-over");
const gameContainer = document.querySelector(".game");
const highestScoreDisplay = document.getElementById("highest-score");

let score = 0;
let gameInterval;
let isNight = false;
let gameActive = true; // Track game state
let cactusPassed = false; // Flag to track if cactus has passed
let highestScore = localStorage.getItem("highestScore") || 0; // Retrieve the highest score from localStorage

// Display the highest score on page load
highestScoreDisplay.textContent = `Highest Score: ${highestScore}`;

// Jump function for the dino
function jump() {
    if (!dino.classList.contains("jump")) {
        dino.classList.add("jump");
        setTimeout(function () {
            dino.classList.remove("jump");
        }, 300);
    }
}

// Start the game function
function startGame() {
    score = 0; // Reset score at the start
    cactusPassed = false; // Reset the flag at the start
    gameActive = true;
    gameOver.classList.add("hidden"); // Hide the game over screen
    cactus.style.animationPlayState = "running"; // Restart cactus animation
    dino.style.animationPlayState = "running"; // Restart dino animation

    gameInterval = setInterval(function () {
        const dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue("top"));
        const cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue("left"));

        // Collision detection
        if (cactusLeft > 0 && cactusLeft < 70 && dinoTop >= 143) {
            endGame();
        }

        // Update score only when cactus fully passes
        if (cactusLeft < 0 && !cactusPassed) {
            score++;
            scoreDisplay.textContent = `Score: ${score}`; // Update score display
            cactusPassed = true; // Set the flag to prevent multiple score increments
        }

        // Reset cactus passed flag when cactus re-enters the screen
        if (cactusLeft >= 580) {
            cactusPassed = false;
        }

        // Update highest score
        updateHighestScore();

        // Day-Night cycle logic every 5 points
        if (score > 0 && score % 5 === 0) {
            toggleDayNight();
        }
    }, 10);
}

// End the game function
function endGame() {
    clearInterval(gameInterval); // Stop game logic interval
    cactus.style.animationPlayState = "paused"; // Pause cactus animation
    dino.style.animationPlayState = "paused"; // Pause dino animation
    gameOver.classList.remove("hidden"); // Show game over screen
    gameActive = false; // Set game to inactive
}

// Restart the game function
function restartGame() {
    cactus.style.animationPlayState = "running"; // Restart cactus animation
    dino.style.animationPlayState = "running"; // Restart dino animation
    gameContainer.style.backgroundColor = "#ffffff"; // Reset to day
    isNight = false;
    scoreDisplay.textContent = "Score: 0"; // Reset score
    startGame(); // Start a new game
}

// Update highest score
function updateHighestScore() {
    if (score > highestScore) {
        highestScore = score; // Update highest score
        localStorage.setItem("highestScore", highestScore); // Store new highest score in localStorage
        highestScoreDisplay.textContent = `Highest Score: ${highestScore}`; // Update display
    }
}

// Toggle between day and night
function toggleDayNight() {
    isNight = !isNight; // Toggle the night state
    gameContainer.style.backgroundColor = isNight ? "#2c3e50" : "#ffffff"; // Change background color for night/day
}

// Handle keydown events for jump and restart
document.addEventListener("keydown", function (event) {
    if (gameActive && (event.code === "Space" || event.code === "ArrowUp")) {
        jump(); // Jump when space or arrow up is pressed
    } else if (!gameActive && event.code === "Enter") {
        restartGame(); // Restart the game when Enter is pressed
    }
});

// Start game initially
startGame();
