// DOM Elements
const colorBox = document.querySelector('[data-testid="colorBox"]');
const colorOptions = document.querySelectorAll('[data-testid="colorOption"]');
const gameStatus = document.querySelector('[data-testid="gameStatus"]');
const scoreElement = document.querySelector('[data-testid="score"]');
const newGameButton = document.querySelector('[data-testid="newGameButton"]');
const congratsOverlay = document.getElementById("congratsOverlay");
const gameOverOverlay = document.getElementById("gameOverOverlay");
const playAgainButton = document.getElementById("playAgainButton");
const tryAgainButton = document.getElementById("tryAgainButton");

let targetColor;
let score = 0;
let incorrectGuesses = 0;
let isGameOver = false; 

// Function to generate colors with the same shade but different hue and saturation
function generateSimilarColors(_baseColor, count) {
    const colors = [];
    const baseHue = Math.floor(Math.random() * 360); // Random base hue (0-359)
    const baseSaturation = Math.floor(Math.random() * 50) + 50; // Base saturation (50-100%)
    const baseLightness = Math.floor(Math.random() * 20) + 40; // Base lightness (40-60%)
  
    for (let i = 0; i < count; i++) {
      const hue = baseHue + Math.floor(Math.random() * 30) - 15; // Vary hue by ±15
      const saturation = baseSaturation + Math.floor(Math.random() * 20) - 10; // Vary saturation by ±10
      const lightness = baseLightness + Math.floor(Math.random() * 10) - 5; // Vary lightness by ±5
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
  }
  
  
  
  // Play the game
  function playGame() {
    // Generate a base color and similar colors
    const baseColor = `hsl(${Math.floor(Math.random() * 360)}, ${Math.floor(Math.random() * 50) + 50}%, ${Math.floor(Math.random() * 20) + 40}%)`;
    const similarColors = generateSimilarColors(baseColor, 6);
  
    // Randomly select the target color from the similar colors
    targetColor = similarColors[Math.floor(Math.random() * similarColors.length)];
    colorBox.style.backgroundColor = targetColor;
    newGameButton.style.backgroundColor = targetColor;
  
    // Assign colors to the buttons
    colorOptions.forEach((button, index) => {
      button.style.backgroundColor = similarColors[index];
    });
  
    gameStatus.textContent = "";
  }
  
  // Check if the selected color matches the target color
  function checkGuess(event) {
    if (isGameOver) return; // Prevent further guesses if the game is over
  
    const selectedColor = event.target.style.backgroundColor;
  
    // Convert both colors to HSL format for accurate comparison
    const targetColorHSL = colorToHsl(colorBox.style.backgroundColor);
    const selectedColorHSL = colorToHsl(selectedColor);
  
    // Compare HSL values
    if (selectedColorHSL === targetColorHSL) {
      gameStatus.textContent = "Correct!";
      gameStatus.style.color = "green";
      score++;
      scoreElement.textContent = `Score: ${score}`;
      
  
      // Check if the player has won
      if (score >= 10) {
        showCongratsOverlay();
        return;
      }
    } else {
      gameStatus.textContent = "Wrong! Try again.";
      gameStatus.style.color = "red";
      incorrectGuesses++; // Increment incorrect guesses
      if (incorrectGuesses >= 3) {
        showGameOverOverlay(); // End the game if the player loses three times
        return;
      }
    }
  
    // Refresh the game after each guess
    setTimeout(playGame, 1000); // Refresh after 1 second
  }
  
  // Function to convert any color format to HSL
  function colorToHsl(color) {
    // Create a temporary element to parse the color
    const tempElement = document.createElement("div");
    tempElement.style.backgroundColor = color;
    document.body.appendChild(tempElement);
  
    // Get the computed color in RGB format
    const computedColor = getComputedStyle(tempElement).backgroundColor;
  
    // Remove the temporary element
    document.body.removeChild(tempElement);
  
    // Convert RGB to HSL
    const rgbValues = computedColor.match(/\d+/g).map(Number);
    const [r, g, b] = rgbValues;
  
    // Normalize RGB values to [0, 1]
    const rNormalized = r / 255;
    const gNormalized = g / 255;
    const bNormalized = b / 255;
  
    // Find min and max values
    const max = Math.max(rNormalized, gNormalized, bNormalized);
    const min = Math.min(rNormalized, gNormalized, bNormalized);
  
    // Calculate lightness
    let lightness = (max + min) / 2;
  
    // Calculate saturation
    let saturation = 0;
    if (max !== min) {
      saturation = lightness > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
    }
  
    // Calculate hue
    let hue = 0;
    if (max !== min) {
      switch (max) {
        case rNormalized:
          hue = (gNormalized - bNormalized) / (max - min) + (gNormalized < bNormalized ? 6 : 0);
          break;
        case gNormalized:
          hue = (bNormalized - rNormalized) / (max - min) + 2;
          break;
        case bNormalized:
          hue = (rNormalized - gNormalized) / (max - min) + 4;
          break;
      }
      hue /= 6;
    }
  
    // Convert hue to degrees, saturation and lightness to percentages
    hue = Math.round(hue * 360);
    saturation = Math.round(saturation * 100);
    lightness = Math.round(lightness * 100);
  
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
  
  // Function to show the congratulatory overlay
  function showCongratsOverlay() {
    isGameOver = true;
    congratsOverlay.style.display = "flex";
  }
  
  // Function to show the game over overlay
  function showGameOverOverlay() {
    isGameOver = true;
    gameOverOverlay.style.display = "flex";
  }
  
  // Function to reset the game
  function resetGame() {
    score = 0;
    incorrectGuesses = 0;
    isGameOver = false;
    scoreElement.textContent = `Score: ${score}`;
    congratsOverlay.style.display = "none";
    gameOverOverlay.style.display = "none";
    playGame();
  }
  
  // Event Listeners
  colorOptions.forEach(button => {
    button.addEventListener("click", checkGuess);
  });
  
  newGameButton.addEventListener("click", resetGame);
  playAgainButton.addEventListener("click", resetGame);
  tryAgainButton.addEventListener("click", resetGame);
  
 
  playGame();