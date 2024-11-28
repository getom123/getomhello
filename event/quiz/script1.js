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
  let questionTimeLeft = 5; // Time per question in seconds
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
    questionTimeLeft = 5; // Reset question timer
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
  
    if (percentageScore >= 90) {
      showReward();
    } else {
      questionBox.innerHTML = "<p>Oops! Try again tomorrow!</p>";
    }
  }
  
  
  // Show a reward
  function showReward() {
    if (rewardSection.innerHTML !== "") return;
    const varies1 = "getom29";
  
    rewardSection.style.display = "block";
    const rewardOptions = [
      `<p>Get 25% Off Your Data Purchase Using Your Promo Code: <strong>${generatePromoCode()}</strong></p>
       <p><a href="https://wa.me/08156213617?text=Hello!%20${varies1}%20My%20Promo%20Code%20is%20${generatePromoCode()}" target="_blank" class="claim-link">Claim Reward</a></p>`,
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
  
        const message = `Hello! ${varies1} I am submitting my details for the reward.%0APhone Number: ${phone}%0ANetwork: ${network}`;
        const whatsappLink = `https://wa.me/08156213617?text=${message}`;
  
        window.open(whatsappLink, "_blank");
        rewardSection.innerHTML = "<p>Thank you! Your details have been submitted via WhatsApp.</p>";
      });
    }
  }
  
  // Generate a random promo code
  function generatePromoCode() {
    return `GETOM${Math.floor(100000 + Math.random() * 900000)}`;
  }
  
  // Start the quiz
  loadQuestion();
  