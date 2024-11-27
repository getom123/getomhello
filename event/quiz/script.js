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
  let timeLeft = 5;
  let timerInterval;
  
  const questionBox = document.getElementById("question-box");
  const nextButton = document.getElementById("next-btn");
  const scoreBox = document.getElementById("score-box");
  const rewardSection = document.getElementById("reward-section");
  const timeDisplay = document.getElementById("time");
  
  // Check if the quiz has already been accessed
  function checkQuizAccess() {
    const lastAccess = localStorage.getItem("quizLastAccess");
    const now = new Date().getTime();
  
    if (lastAccess && now - lastAccess < 24 * 60 * 60 * 1000) {
      questionBox.innerHTML = `<p>Oops! You can only attempt this quiz once per day. Try again tomorrow!</p>`;
      nextButton.style.display = "none";
      return false;
    }
  
    // Store current access time
    localStorage.setItem("quizLastAccess", now);
    return true;
  }
  
  // Shuffle questions
  const shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  
  // Load the first question
  function loadQuestion() {
    clearInterval(timerInterval);
    timeLeft = 5;
    timeDisplay.textContent = timeLeft;
    const question = shuffledQuestions[currentQuestionIndex];
    questionBox.innerHTML = `
      <p>${question.question}</p>
      ${question.options.map(option => `<button class="option-btn">${option}</button>`).join("")}
    `;
    document.querySelectorAll(".option-btn").forEach(button => {
      button.addEventListener("click", () => {
        if (button.textContent === question.answer) {
          score++;
          button.style.backgroundColor = "#16a34a";
        } else {
          button.style.backgroundColor = "#dc2626";
        }
        document.querySelectorAll(".option-btn").forEach(btn => btn.disabled = true);
        nextButton.disabled = false;
      });
    });
    startTimer();
  }
  
  // Start timer
  function startTimer() {
    timerInterval = setInterval(() => {
      timeLeft--;
      timeDisplay.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        nextButton.disabled = false;
        document.querySelectorAll(".option-btn").forEach(btn => btn.disabled = true);
      }
    }, 1000);
  }
  
  // Next question or end quiz
  nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledQuestions.length) {
      nextButton.disabled = true;
      loadQuestion();
    } else {
      endQuiz();
    }
  });
  
 // End quiz
function endQuiz() {
    clearInterval(timerInterval);
    const percentageScore = (score / shuffledQuestions.length) * 100;
    scoreBox.innerHTML = `You scored ${percentageScore.toFixed(0)}%!`;
    questionBox.innerHTML = "";
  
    nextButton.style.display = "none"; // Hide the next button
  
    if (percentageScore >= 90) {
      showReward();
    } else {
      questionBox.innerHTML = "<p>Oops! Try again tomorrow!</p>";
    }
  }
  
  // Show a reward
  function showReward() {
    if (rewardSection.innerHTML !== "") return; // Prevent multiple rewards
  
    rewardSection.style.display = "block";
  
    // Randomly select a reward
    const rewardOptions = [
      `<p>Your Promo Code: <strong>${generatePromoCode()}</strong></p>`,
      `
        <form id="rewardForm">
          <label for="phone">Phone Number:</label>
          <input type="tel" id="phone" name="phone" placeholder="Enter your phone number" required>
          <label for="network">Network Provider:</label>
          <select id="network" name="network" required>
            <option value="">Select Network</option>
            <option value="MTN">MTN</option>
            <option value="Airtel">Airtel</option>
            <option value="Glo">Glo</option>
            <option value="9mobile">9mobile</option>
          </select>
          <button type="submit">Submit</button>
        </form>
      `
    ];
  
    const randomReward = rewardOptions[Math.floor(Math.random() * rewardOptions.length)];
    rewardSection.innerHTML = randomReward;
  
    if (randomReward.includes("form")) {
      document.getElementById("rewardForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const phone = document.getElementById("phone").value;
        const network = document.getElementById("network").value;
  
        // Simulate sending data to email (needs backend for actual functionality)
        alert(`Details submitted! Phone: ${phone}, Network: ${network}`);
        rewardSection.innerHTML = "<p>Thank you! Your reward will be sent soon.</p>";
      });
    }
  }
  
  // Generate a random promo code
  function generatePromoCode() {
    return `GETOM${Math.floor(100000 + Math.random() * 900000)}`;
  }
  
  
  // Start quiz
  if (checkQuizAccess()) {
    loadQuestion();
  }
  