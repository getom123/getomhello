
const questions = [
    { question: "What is the goal of Getom?", options: ["Next-gen tech solutions", "Fashion", "Banking", "Sports"], answer: "Next-gen tech solutions" },
    { question: "Which is a Getom subsidiary?", options: ["Hi-Dev", "Tech-Bank", "NeoHub", "CodeSphere"], answer: "Hi-Dev" },
    { question: "Nigeria's capital is?", options: ["Abuja", "Lagos", "Port Harcourt", "Kano"], answer: "Abuja" },
    { question: "Which year did Nigeria gain independence?", options: ["1960", "1970", "1950", "1963"], answer: "1960" },
    { question: "What does GetRecharged offer?", options: ["Airtime and data resale", "Graphics", "Cryptocurrency", "Gaming"], answer: "Airtime and data resale" },
    { question: "Nigeria's currency is?", options: ["Naira", "Dollar", "Euro", "Pound"], answer: "Naira" },
    { question: "What is Getom's focus?", options: ["Digital solutions", "Real estate", "Cooking", "Cars"], answer: "Digital solutions" },
    { question: "Which continent is Nigeria in?", options: ["Africa", "Asia", "Europe", "Australia"], answer: "Africa" },
    { question: "Getom's graphics design arm is?", options: ["Hi-Design", "PicWorks", "ArtHub", "DesignPro"], answer: "Hi-Design" },
    { question: "Who is Nigeria's first president?", options: ["Nnamdi Azikiwe", "Olusegun Obasanjo", "Goodluck Jonathan", "Muhammadu Buhari"], answer: "Nnamdi Azikiwe" },
    
  ];
  
  let currentQuestionIndex = 0;
  let score = 0;
  let questionTimeLeft = 10; // Time per question in seconds
  let totalTimeLeft = questions.length * questionTimeLeft; // Total time for the quiz
  let timerInterval;
  
  const questionBox = document.getElementById("question-box");
  const scoreBox = document.getElementById("score-box");
  const rewardSection = document.getElementById("reward-section");
  const timeDisplay = document.getElementById("time");
  const totalTimeDisplay = document.getElementById("total-time");
  
  const shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  
  // Load the first question
  function loadQuestion() {
    if (currentQuestionIndex >= shuffledQuestions.length || totalTimeLeft <= 0) {
      endQuiz();
      return;
    }
  
    clearInterval(timerInterval);
    questionTimeLeft = 10; // Reset question timer
    updateTimeDisplay();
  
    const question = shuffledQuestions[currentQuestionIndex];
    questionBox.innerHTML = `
      <p>${question.question}</p>
      ${question.options.map(option => `<button class="option-btn">${option}</button>`).join("")}
    `;
    document.querySelectorAll(".option-btn").forEach(button => {
      button.addEventListener("click", () => {
        clearInterval(timerInterval);
        if (button.textContent === question.answer) {
          score++;
          button.style.backgroundColor = "#16a34a";
        } else {
          button.style.backgroundColor = "#dc2626";
        }
        document.querySelectorAll(".option-btn").forEach(btn => btn.disabled = true);
        setTimeout(nextQuestion, 1000); // Move to the next question after 1 second
      });
    });
  
    startQuestionTimer();
  }
  
  // Start the question timer
  function startQuestionTimer() {
    timerInterval = setInterval(() => {
      questionTimeLeft--;
      totalTimeLeft--;
      updateTimeDisplay();
  
      if (questionTimeLeft <= 0) {
        clearInterval(timerInterval);
        nextQuestion(); // Automatically move to the next question
      }
    }, 1000);
  }
  
  // Update the timer display
  function updateTimeDisplay() {
    timeDisplay.textContent = `Time Left (Question): ${questionTimeLeft}s`;
    totalTimeDisplay.textContent = `Total Time Left: ${totalTimeLeft}s`;
  }
  
  // Move to the next question
  function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
  }
  
  // End the quiz
  function endQuiz() {
    clearInterval(timerInterval);
    const percentageScore = (score / shuffledQuestions.length) * 100;
    scoreBox.innerHTML = `You scored ${percentageScore.toFixed(0)}%!`;
    questionBox.innerHTML = "";
  
    if (percentageScore >= 80) {
      showReward();
    } else {
      questionBox.innerHTML = "<p>Oops! Try again tomorrow!</p>";
    }
  }
  
  // Predefined winning numbers with one slot favoring the user's number
  const winningNumbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 100) + 1);

  function showReward() {
      const luckyNumber = Math.floor(Math.random() * 100) + 1;
      const varies = "getom29";

      // Add the user's lucky number with a 50% chance to the winning pool
      if (Math.random() < 0.5) {
          winningNumbers.push(luckyNumber);
      }

      // Check if the user's lucky number is in the winning numbers
      const isWinner = winningNumbers.includes(luckyNumber);

      rewardSection.style.display = "block";
      rewardSection.innerHTML = `
          <p>Your Lucky Number is: <strong>${luckyNumber}</strong></p>
          <p>Today's Winning Numbers: <strong>${winningNumbers.join(", ")}</strong></p>
          <p>${isWinner ? "🎉 Congratulations! You won!" : "Oops! Better luck next time!"}</p>
          ${isWinner ? `
              <p>Submit your lucky number and screenshot of this page for verification on WhatsApp:</p>
              <a href="https://wa.me/09161438315?text=Hello!%20${varies}%20My%20Lucky%20Number%20is%20${luckyNumber}" 
                  target="_blank" 
                  class="claim-link">Submit My Lucky Number</a>` : ""}
      `;
  }
  
  // Start the quiz
  loadQuestion();
  