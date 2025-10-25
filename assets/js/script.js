const nameInput = document.getElementById("username");
const saveBtn = document.getElementById("save-name");
const errorLine = document.getElementById("username-error");
const levelBtns = document.querySelectorAll("[data-level]");
const heroRef = document.querySelector(".hero");
const scoreMessageRef = document.getElementById("score-message");
const leaderboardBoxRef = document.getElementById("leaderboard-box");
const leaderboardListRef = document.getElementById("leaderboard-list");
const leaderboardEmptyRef = document.getElementById("leaderboard-empty");
const toggleLeaderboardBtn = document.getElementById("toggle-leaderboard");
const highScoresRef = JSON.parse(localStorage.getItem("highScores")) || [];

// Quiz refs

const quizRefs = {
  screens: {
    hero: heroRef,
    quiz: document.getElementById("quiz"),
    results: document.getElementById("results"),
  },
  level: document.getElementById("quiz-level"),
  progress: document.getElementById("quiz-progress"),
  question: document.getElementById("question"),
  answers: Array.from(document.querySelectorAll(".answer-btn")),
  finalLine: document.getElementById("final-line"),
  playAgain: document.getElementById("play-again"),
  correctCountEl: document.getElementById("correct-count"),
  wrongCountEl: document.getElementById("wrong-count"),
  timer: document.getElementById("quiz-timer"),
};

// Timer state
const QUESTION_TIME = 20;
let timerId = null;
let timeLeft = QUESTION_TIME;

// // Toggle leaderboard panel

if (toggleLeaderboardBtn) {
  toggleLeaderboardBtn.addEventListener("click", () => {
    leaderboardBoxRef.classList.toggle("hide");
    if (!leaderboardBoxRef.classList.contains("hide")) {
      renderLeaderboard();
    }
  });
}

// In-memory data for the ongoing game

const session = {
  username: "",
  difficulty: null,
};

// API loader

async function loadQuestions(level) {
  const amount = 3;
  const url = `https://opentdb.com/api.php?amount=${amount}&category=22&difficulty=${level}&type=multiple`;
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.response_code !== 0) throw new Error("OpenTDB response_code != 0");

    return data.results.map((item) => ({
      q: item.question,
      correct: item.correct_answer,
      options: [item.correct_answer, ...item.incorrect_answers],
    }));
  } catch (e) {
    console.warn("API failed:", e);
    handleApiError();
    throw e;
  }
}

// quiz functions

let quizState = { list: [], idx: 0, score: 0, level: null };
let correctCount = 0;
let wrongCount = 0;

// Panel visibility controls

function showOrHide(elements, showElement) {
  elements.forEach((element) => {
    if (!showElement) {
      element.classList.remove("hide");
    } else {
      element.classList.add("hide");
    }
  });
}
// API error handler

function handleApiError() {
  showOrHide([quizRefs.screens.quiz], true);

  showOrHide([quizRefs.screens.hero], false);

  alert("Error fetching data. Please try again later.");
  setTimeout(() => {
    location.reload();
  }, 1000);
}

// Timer

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function updateTimerUI() {
  if (quizRefs.timer) {
    quizRefs.timer.textContent = `${timeLeft}s`;
  }
}

function startTimer() {
  stopTimer();
  timeLeft = QUESTION_TIME;
  updateTimerUI();

  timerId = setInterval(() => {
    timeLeft -= 1;
    updateTimerUI();

    if (timeLeft <= 0) {
      stopTimer();
      handleTimeUp();
    }
  }, 1000);
}

// Start the game

async function startQuiz(level) {
  quizState.level = level;
  quizState.idx = 0;
  quizState.score = 0;
  correctCount = 0;
  wrongCount = 0;
  if (quizRefs.correctCountEl) quizRefs.correctCountEl.textContent = 0;
  if (quizRefs.wrongCountEl) quizRefs.wrongCountEl.textContent = 0;

  // Show quiz; hide start and results

  const hero = quizRefs.screens.hero;
  const quiz = quizRefs.screens.quiz;
  const results = quizRefs.screens.results;
  showOrHide([hero, results], true);
  showOrHide([quiz], false);

  // Start of quiz setup

  quizRefs.level.textContent = level.toUpperCase();
  try {
    quizState.list = await loadQuestions(level);
    renderQuestion();
  } catch (e) {}
}

// Display next question and update progress (end if done)

function renderQuestion() {
  const total = quizState.list.length;
  if (quizState.idx >= total) return gameOver();

  const item = quizState.list[quizState.idx];

  quizRefs.progress.textContent = `Q${quizState.idx + 1}/${total}`;
  quizRefs.question.innerHTML = item.q;

  // Shuffle the answer choices

  const opts = [...item.options].sort(() => Math.random() - 0.5);

  // reset + wire answer buttons

  quizRefs.answers.forEach((btn, i) => {
    btn.classList.remove("correct", "wrong", "disabled", "active");
    btn.disabled = false;
    btn.innerHTML = opts[i];
    btn.onclick = () => handleAnswer(btn, item.correct);
  });

  // START TIMER FOR THIS QUESTION

  startTimer();
}
// Handle an answer: lock buttons, mark correct/wrong, update score, advance

function handleAnswer(btn, correctText) {
  stopTimer();
  quizRefs.answers.forEach((b) => {
    b.disabled = true;
    b.classList.add("disabled");
  });

  const isRight = btn.innerHTML === correctText;

  if (isRight) {
    btn.classList.add("correct");
    quizState.score += 1;
    correctCount += 1;
    if (quizRefs.correctCountEl)
      quizRefs.correctCountEl.textContent = correctCount;
  } else {
    btn.classList.add("wrong");
    wrongCount += 1;
    if (quizRefs.wrongCountEl) quizRefs.wrongCountEl.textContent = wrongCount;
    const c = quizRefs.answers.find((b) => b.innerHTML === correctText);
    if (c) c.classList.add("correct");
  }

  // move to next after brief pause
  setTimeout(() => {
    quizState.idx += 1;
    renderQuestion();
  }, 900);
}

// Highlights the correct answer

function handleTimeUp() {
  quizRefs.answers.forEach((b) => {
    b.disabled = true;
    b.classList.add("disabled");
  });

  // Highlight the correct answer so it’s clear what it was

  const currentItem = quizState.list[quizState.idx];
  const correctBtn = quizRefs.answers.find(
    (b) => b.innerHTML === currentItem.correct
  );
  if (correctBtn) correctBtn.classList.add("correct");

  // Move on without changing score (unanswered)

  setTimeout(() => {
    quizState.idx += 1;
    renderQuestion();
  }, 900);
}
// game over

function gameOver() {
  stopTimer();
  showOrHide([quizRefs.screens.quiz], true);
  showOrHide([quizRefs.screens.results], false);

  displayFinalScore();
}

function displayFinalScore() {
  const username = session.username || "Player";
  const score = quizState.score;
  const total = quizState.list.length;

  // store top 5 high scores
  try {
    highScoresRef.unshift({ name: username, score });
    highScoresRef.sort((a, b) => b.score - a.score);
    highScoresRef.splice(5);
    localStorage.setItem("highScores", JSON.stringify(highScoresRef));
  } catch {}

  renderLeaderboard();

  const msg =
    score < Math.ceil(total / 2) ? `${username} can do better! Keep trying.` :
  `Congratulations, ${username}! You've done a great job!`;

  if (typeof scoreMessageRef !== "undefined" && scoreMessageRef) {
    scoreMessageRef.textContent = msg;
  }

  quizRefs.finalLine.textContent = `${username}, you scored ${score} / ${total}.`;
}

function renderLeaderboard() {
  let arr;
  try {
    arr = JSON.parse(localStorage.getItem("highScores")) || [];
  } catch {
    arr = [];
  }

  // If there are no saved scores, display the empty state and exit

  if (!arr.length) {
    leaderboardEmptyRef.classList.remove("hide");
    leaderboardListRef.innerHTML = "";
    return;
  }
  leaderboardEmptyRef.classList.add("hide");

  leaderboardListRef.innerHTML = arr
    .map((item) => `<li>${item.name || "Player"} — ${item.score}</li>`)
    .join("");
}

// Play again → full reset
if (quizRefs.playAgain) {
  quizRefs.playAgain.addEventListener("click", () => {
    location.reload();
  });
}

// Error display + simple validators

function setError(msg = "") {
  if (!errorLine) return;
  errorLine.textContent = msg;
}

function isNameValid(value) {
  const v = (value || "").trim();

  return v.length >= 2;
}

// Enable/disable difficulty buttons based on name validity

function updateLevelButtonsState() {
  const valid = isNameValid(nameInput.value);
  levelBtns.forEach((btn) => {
    btn.disabled = !valid;
  });
}

// Visual feedback for selected difficulty

function markActiveDifficulty(activeBtn) {
  levelBtns.forEach((b) => b.classList.remove("active"));
  activeBtn.classList.add("active");
}

// Live username validation

if (nameInput) {
  nameInput.addEventListener("input", () => {
    if (isNameValid(nameInput.value)) {
      setError("");
    } else {
      setError("Please enter at least 2 characters.");
    }
    updateLevelButtonsState();
  });
}

// Save button: validate and store name

if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    if (!isNameValid(nameInput.value)) {
      setError("Please enter at least 2 characters.");
      nameInput.focus();
      return;
    }
    session.username = nameInput.value.trim();
    localStorage.setItem("gg_username", session.username);
    setError("Saved ✓");
    updateLevelButtonsState();
  });
}
const savedName = localStorage.getItem("gg_username");
if (savedName) {
  nameInput.value = savedName;
  setError("");
  updateLevelButtonsState();
}
// Start handlers

levelBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const level = btn.dataset.level;

    // Username validation

    if (!isNameValid(nameInput.value)) {
      setError("Please enter your username before starting.");
      nameInput.focus();
      return;
    }

    // Set session state

    session.username = nameInput.value.trim();
    session.difficulty = level;

    // Highlight the chosen difficulty

    markActiveDifficulty(btn);

    startQuiz(level);
  });
});

// Clear saved username when going Home
document.querySelectorAll('a[href="index.html"]').forEach((a) => {
  a.addEventListener("click", () => {
    localStorage.removeItem("gg_username");
  });
});

updateLevelButtonsState();
