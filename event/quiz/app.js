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
    { question: "What is the goal of Getom?", options: ["Digital solutions", "Next-gen digital tech solutions", "Digital solution", "Next-gen tech solutions"], answer: "Next-gen digital tech solutions" },
    { question: "Which is a Getom subsidiary?", options: ["gethome", "Hi-dv", "Hi-Dev", "getomhello"], answer: "Hi-Dev" },
    { question: "What is Getom's theme color?", options: ["Peach-orange", "Orange-light green", "Green-black", "black-Orange-light green"], answer: "black-Orange-light green" },
    { question: "Which year did Nigeria gain independence?", options: ["1970", "1960", "1950", "1963"], answer: "1960" },
    { question: "What does GetRecharged offer?", options: ["Airtime and data desale", "Airtime and data for mobile", "Airtime and data resale", "battery increase"], answer: "Airtime and data resale" },
    { question: "Which is not a Getom subsidiary?", options: ["Hi-dev", "Hi-design", "Getconnected", "Getomhello"], answer: "Getomhello" },
    { question: "What is Getom's focus?", options: ["Digital de-solutions", "Digital solutions", "Digital Solution", "Solutions for all"], answer: "Digital solutions" },
    { question: "Which continent is Getom in?", options: ["Korea", "Asia", "Africa", "Australia"], answer: "Africa" },
    { question: "Getom's graphics design arm is?", options: ["Hi-deign", "Hi-designbygetom", "Hi-Design", "Hi-degin"], answer: "Hi-Design" },
    { question: "Who founded Getom?", options: ["you", "Oladosu Goodness Emmnuel", "Goodness Oladosu", "Goodness Emmanel Oladosu"], answer: "Goodness Oladosu" },
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
  const percentageScore = (score / shuffledQuestions.length) * 100; // Calculate percentage score
  questionBox.innerHTML = ""; // Clear question box

  // Save score to Firebase with username, updating if higher
  saveScoreToFirebase(username, percentageScore, (totalScore) => {
    // Once the score is saved, fetch the updated total score
    const level = calculateLevel(totalScore); // Calculate user's current level
    scoreBox.innerHTML = `
      <p>You scored ${percentageScore.toFixed(0)}% in this game!</p>
      <p>Total Accumulated Points: ${totalScore}</p>
      <p>Your Current Level: ${level}</p>
    `;

    // Display leaderboard (optional)
    displayLeaderboard();
  });
}

// Save or update score to Firebase (accumulating the score)
function saveScoreToFirebase(username, score, callback) {
  const scoreRef = ref(db, 'leaderboard/' + username);

  // Get current score for the user
  get(scoreRef).then((snapshot) => {
    let totalScore = score; // Initialize with the current game score
    if (snapshot.exists()) {
      // If the user exists, accumulate the score
      const currentScore = snapshot.val().score || 0; // Get current score
      totalScore += currentScore; // Add the new score to the current score
    }

    // Update the user's score with the new accumulated score
    set(scoreRef, {
      username: username,
      score: totalScore,
      timestamp: Date.now()
    }).then(() => {
      console.log("Score saved successfully! Total Score: ", totalScore);
      if (callback) callback(totalScore); // Execute callback with the total score
    }).catch((error) => {
      console.error("Error saving score: ", error);
    });
  }).catch((error) => {
    console.error("Error fetching score: ", error);
  });
}

// Function to calculate level based on score
function calculateLevel(score) {
  if (score <= 100) return '1 - Rookie';
  if (score <= 200) return '2 - Scout';
  if (score <= 350) return '3 - Ace';
  if (score <= 450) return '4 - Virtuoso';
  if (score <= 600) return '5 - Overlord';
  return '6 - Monarch'; // Level 6 for scores above 600
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
// Function to check if the quiz is accessible based on time and date
function canAccessQuiz() {
    const now = new Date();
    const startTime = new Date();
    const endTime = new Date();
  
    // Set allowed time range (9:00 AM to 10:30 AM)
    startTime.setHours(9, 0, 0); // 9:00 AM
    endTime.setHours(10, 30, 0); // 10:30 AM
  
    // Check if the current time is within the range
    if (now < startTime || now > endTime) {
      return { status: false, message: "The quiz is only accessible from 9:00 AM to 10:30 AM daily." };
    }
  
    // Check if the user has already accessed the quiz today
    const lastAccessDate = localStorage.getItem("lastAccessDate");
    const today = now.toISOString().split("T")[0]; // Get the current date (YYYY-MM-DD format)
  
    if (lastAccessDate === today) {
      return { status: false, message: "You can only access the quiz once per day. <br> <a href='leaderboard.html'>Check Leaderboard</a>" };
    }
  
    // Update the last access date
    localStorage.setItem("lastAccessDate", today);
  
    return { status: true, message: "Access granted!" };
  }
  
  // Start the quiz if allowed
  function startQuiz() {
    const accessCheck = canAccessQuiz();
    if (!accessCheck.status) {
      questionBox.innerHTML = `<p>${accessCheck.message}</p>`;
      return;
    }
  
    // Proceed to load the first question
    loadQuestion();
    
  }
  
  // Initialize and check access
  startQuiz();

  
  