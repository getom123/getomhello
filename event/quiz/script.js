// Countdown and start quiz
window.onload = function () {
  const countdownOverlay = document.getElementById("countdown-overlay");
  const countdownNumber = document.getElementById("countdown-number");
  const quizContent = document.getElementById("quiz-content");

  let countdown = 3;
  countdownNumber.textContent = countdown;

  const timer = setInterval(() => {
      countdown--;
      if (countdown > 0) {
          countdownNumber.textContent = countdown;
      } else if (countdown === 0) {
          countdownNumber.textContent = "Start!";
      } else {
          clearInterval(timer);

          // Hide the countdown and show the quiz content
          countdownOverlay.style.display = "none";
          quizContent.style.display = "block";

          // Start the quiz
          loadQuestion();
      }
  }, 1000); // Countdown interval of 1 second
};


// Snowflake settings
const snowflakeCount = 50; // Number of snowflakes
const container = document.getElementById('snowflakes-container');

for (let i = 0; i < snowflakeCount; i++) {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    
    // Randomize snowflake properties
    snowflake.style.left = `${Math.random() * 100}vw`; // Horizontal position
    snowflake.style.animationDuration = `${2 + Math.random() * 4}s`; // Fall speed
    snowflake.style.animationDelay = `${Math.random() * 2}s`; // Stagger effect
    snowflake.style.width = snowflake.style.height = `${5 + Math.random() * 10}px`; // Size
    
    container.appendChild(snowflake);
}


// to fix the game to 9am to 10:30am
document.addEventListener("DOMContentLoaded", function () {
  const startTime = new Date();
  startTime.setHours(9, 0, 0); // Set start time to 9:00 AM
  const endTime = new Date();
  endTime.setHours(21, 30, 0); // Set end time to 10:30 AM

  const currentTime = new Date();
  const gameContainer = document.getElementById("game-container");
  const messageContainer = document.getElementById("message-container");

  if (currentTime >= startTime && currentTime <= endTime) {
      // Game is active
      gameContainer.style.display = "block";
      messageContainer.style.display = "none";
  } else {
      // Game is inactive
      gameContainer.style.display = "none";
      messageContainer.style.display = "block";
      if (currentTime < startTime) {
          // Before start time
          messageContainer.innerHTML = `
              <h2>The game hasn't started yet!</h2>
              <p>Come back at 9:00 AM to start playing.</p>
          `;
      } else {
          // After end time
          messageContainer.innerHTML = `
              <h2>The game is over for today!</h2>
              <p>Please come back tomorrow between 9:00 AM and 10:30 AM to play again.</p>
          `;
      }
  }
});