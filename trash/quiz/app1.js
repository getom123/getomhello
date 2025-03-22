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
