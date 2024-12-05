// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, set, get, child, update } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA_wbos0yQ5TIS0uG7jjX-4Kdw-W3QXjJ8",
  authDomain: "gquiz-539dd.firebaseapp.com",
  databaseURL: "https://gquiz-539dd-default-rtdb.firebaseio.com",
  projectId: "gquiz-539dd",
  storageBucket: "gquiz-539dd.firebasestorage.app",
  messagingSenderId: "435490691709",
  appId: "1:435490691709:web:745a588169ab0bf7932f14",
  measurementId: "G-531RE26HRD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Function to generate a random username
function generateUsername() {
  const prefix = "user_";
  const randomNum = Math.floor(Math.random() * 10000); // Random number between 0 and 9999
  return prefix + randomNum;
}

// Check if a username exists in localStorage
let username = localStorage.getItem("username");
if (!username) {
  username = generateUsername(); // Generate a new username if not found
  localStorage.setItem("username", username); // Save username to localStorage
}

console.log("Username for this session: " + username); // Log it in the console for testing

// Display the username on the page
const usernameDisplay = document.getElementById("username-display");
usernameDisplay.textContent = `Your Username: ${username}`;

// Quiz Questions
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
let totalTimeLeft = questions.length * 10; // Total time for the quiz (10 seconds per question)
let timerInterval;

const questionBox = document.getElementById("question-box");
const scoreBox = document.getElementById("score-box");
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
  let questionTimeLeft = 10;
  updateTimeDisplay(questionTimeLeft);

  const question = shuffledQuestions[currentQuestionIndex];
  questionBox.innerHTML = `
    <p>${question.question}</p>
    ${question.options.map(option => `<button class="option-btn">${option}</button>`).join("")}
  `;
  document.querySelectorAll(".option-btn").forEach(button => {
    button.addEventListener("click", () => {
      clearInterval(timerInterval);
      if (button.textContent === question.answer) {
        score++; // Increase the score if the answer is correct
        console.log("Correct! Score: " + score); // Debugging line
        button.style.backgroundColor = "#16a34a"; // Green for correct
      } else {
        console.log("Incorrect! Score: " + score); // Debugging line
        button.style.backgroundColor = "#dc2626"; // Red for incorrect
      }
      document.querySelectorAll(".option-btn").forEach(btn => btn.disabled = true);
      setTimeout(nextQuestion, 1000); // Move to next question after 1 second
    });
  });

  startQuestionTimer(questionTimeLeft);
}

// Start question timer
function startQuestionTimer(questionTimeLeft) {
  timerInterval = setInterval(() => {
    questionTimeLeft--;
    totalTimeLeft--;
    updateTimeDisplay(questionTimeLeft);

    if (questionTimeLeft <= 0) {
      clearInterval(timerInterval);
      nextQuestion(); // Move to next question automatically
    }
  }, 1000);
}

// Update time display
function updateTimeDisplay(questionTimeLeft) {
  timeDisplay.textContent = `Time Left (Question): ${questionTimeLeft}s`;
  totalTimeDisplay.textContent = `Total Time Left: ${totalTimeLeft}s`;
}

// Move to next question
function nextQuestion() {
  currentQuestionIndex++;
  loadQuestion();
}

// End the quiz and save the score
function endQuiz() {
  clearInterval(timerInterval);
  const percentageScore = (score / shuffledQuestions.length) * 100;
  scoreBox.innerHTML = `You scored ${percentageScore.toFixed(0)}%!`;
  questionBox.innerHTML = "";

  // Save score to Firebase with username, updating if higher
  saveScoreToFirebase(username, percentageScore);

  // Display leaderboard
  displayLeaderboard();
}

// Save or update score to Firebase (accumulating the score)
function saveScoreToFirebase(username, score) {
    const scoreRef = ref(db, 'leaderboard/' + username);
  
    // Get current score for the user
    get(scoreRef).then((snapshot) => {
      if (snapshot.exists()) {
        // If the user exists, accumulate the score
        const currentScore = snapshot.val().score || 0; // Get current score, default to 0 if none exists
        const newScore = currentScore + score; // Add the new score to the current score
  
        // Update the user's score with the new accumulated score
        update(scoreRef, {
          score: newScore,
          timestamp: Date.now()
        }).then(() => {
          console.log("Score accumulated and updated successfully! New Score: ", newScore); // Debugging line
        }).catch((error) => {
          console.error("Error updating score: ", error);
        });
      } else {
        // If the user doesn't exist, create a new record with the score
        set(scoreRef, {
          username: username,
          score: score,
          timestamp: Date.now()
        }).then(() => {
          console.log("Score saved successfully!"); // Debugging line
        }).catch((error) => {
          console.error("Error saving score: ", error);
        });
      }
    }).catch((error) => {
      console.error("Error checking score: ", error);
    });
  }
  
  

// Fetch and display leaderboard
function displayLeaderboard() {
  const leaderboardRef = ref(db, 'leaderboard');
  get(leaderboardRef).then((snapshot) => {
    const leaderboard = [];
    snapshot.forEach(childSnapshot => {
      leaderboard.push(childSnapshot.val());
    });
    leaderboard.sort((a, b) => b.score - a.score); // Sort by score in descending order
    leaderboard.forEach((entry, index) => {
      console.log(`${index + 1}. ${entry.username}: ${entry.score}`);
    });
  }).catch((error) => {
    console.error("Error fetching leaderboard: ", error);
  });
}

// Start the quiz
loadQuestion();