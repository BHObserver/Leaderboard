import './style.css';

const baseUrl = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/';
let gameId = ''; // Store the game ID here

// Function to refresh scores
const refreshScores = async () => {
  try {
    const response = await fetch(`${baseUrl}games/${gameId}/scores/`);
    const data = await response.json();
    const scoresContainer = document.getElementById('scoresContainer');
    scoresContainer.innerHTML = ''; // Clear previous scores

    // Sort scores in descending order based on the score value
    data.result.sort((a, b) => b.score - a.score);

    data.result.forEach((score) => {
      const scoreElement = document.createElement('h4');
      scoreElement.textContent = `${score.user}: ${score.score}`;
      scoresContainer.appendChild(scoreElement);
    });
  } catch (error) {
    console.error('Error refreshing scores:', error);
  }
};

// Function to submit a new score
const submitScore = async () => {
  const userNameInput = document.getElementById('userNameInput');
  const scoreInput = document.getElementById('scoreInput');
  const userName = userNameInput.value.trim();
  const score = parseInt(scoreInput.value, 10);

  if (userName && !Number.isNaN(score)) {
    try {
      const response = await fetch(`${baseUrl}games/${gameId}/scores/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: userName,
          score,
        }),
      });
      await response.json();
      // Clear input fields
      userNameInput.value = '';
      scoreInput.value = '';
      // Refresh the scores
      refreshScores();
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  }
};

// Event listener for the Refresh button
const refreshButton = document.getElementById('refreshButton');
refreshButton.addEventListener('click', refreshScores);

// Event listener for the Submit button
const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', submitScore);

// Create a new game and store the game ID
const createGame = async () => {
  try {
    const response = await fetch(`${baseUrl}games/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Your Game Name', // Replace with your game name
      }),
    });
    const data = await response.json();
    gameId = data.result.split(': ').pop(); // Extract and store the game ID
  } catch (error) {
    console.error('Error creating game:', error);
  }
};

// Call the function to create a new game when the page loads
createGame();