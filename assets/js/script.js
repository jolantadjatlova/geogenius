const nameInput = document.getElementById("username");
const saveBtn = document.getElementById("save-name");
const errorLine = document.getElementById("username-error");
const levelBtns = document.querySelectorAll("[data-level]");
const heroRef = document.querySelector(".hero");
const highScoresRef = JSON.parse(localStorage.getItem("highScores")) || [];
const SAMPLE_QUESTIONS = {
  easy: [
    {
      q: "Which continent is France in?",
      correct: "Europe",
      options: ["Europe", "Asia", "Africa", "South America"],
    },
    {
      q: "The capital of Spain is…",
      correct: "Madrid",
      options: ["Barcelona", "Madrid", "Seville", "Valencia"],
    },
    {
      q: "The UK is an island in the…",
      correct: "Atlantic Ocean",
      options: [
        "Indian Ocean",
        "Pacific Ocean",
        "Atlantic Ocean",
        "Arctic Ocean",
      ],
    },
  ],
  medium: [
    {
      q: "Mount Kilimanjaro is in which country?",
      correct: "Tanzania",
      options: ["Kenya", "Tanzania", "Uganda", "Ethiopia"],
    },
    {
      q: "The Danube flows into which sea?",
      correct: "Black Sea",
      options: ["North Sea", "Mediterranean", "Black Sea", "Baltic Sea"],
    },
    {
      q: "Which desert is in northern China?",
      correct: "Gobi",
      options: ["Sahara", "Atacama", "Gobi", "Kalahari"],
    },
  ],
  hard: [
    {
      q: "The capital of Kazakhstan is…",
      correct: "Astana",
      options: ["Almaty", "Astana", "Bishkek", "Tashkent"],
    },
    {
      q: "Lake Baikal is located in…",
      correct: "Russia",
      options: ["Mongolia", "China", "Kazakhstan", "Russia"],
    },
    {
      q: "The Strait of Malacca links…",
      correct: "Indian & Pacific",
      options: [
        "Arctic & Atlantic",
        "Indian & Pacific",
        "Atlantic & Indian",
        "Pacific & Arctic",
      ],
    },
  ],
};

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
};

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
    console.warn("API failed, using samples:", e);
    return [...SAMPLE_QUESTIONS[level]];
  }
}

// quiz functions

let quizState = { list: [], idx: 0, score: 0, level: null };

function show(element) {
  if (element) element.classList.remove("hide");
}

function hide(element) {
  if (element) element.classList.add("hide");
}

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
// Start the game

async function startQuiz(level) {
  quizState.level = level;
  quizState.idx = 0;
  quizState.score = 0;

  // Show quiz; hide start and results

  const hero = quizRefs.screens.hero;
  const quiz = quizRefs.screens.quiz;
  const results = quizRefs.screens.results;
  showOrHide([hero, results], true);
  showOrHide([quiz], false);

  // Start of quiz setup

  quizRefs.level.textContent = level.toUpperCase();
  quizState.list = await loadQuestions(level);
  renderQuestion();
}

// Display next question and update progress (end if done)

function renderQuestion() {
  const total = quizState.list.length;
  if (quizState.idx >= total) return endQuiz();

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
}

// Handle an answer: lock buttons, mark correct/wrong, update score, advance

function handleAnswer(btn, correctText) {
  quizRefs.answers.forEach((b) => {
    b.disabled = true;
    b.classList.add("disabled");
  });

  const isRight = btn.innerHTML === correctText;

  if (isRight) {
    btn.classList.add("correct");
    quizState.score += 1;
  } else {
    btn.classList.add("wrong");

    const c = quizRefs.answers.find((b) => b.innerHTML === correctText);
    if (c) c.classList.add("correct");
  }

  // move to next

  setTimeout(() => {
    quizState.idx += 1;
    renderQuestion();
  }, 900);
}
// finish quiz: switch to results screen

function endQuiz() {
  showOrHide([quizRefs.screens.quiz], true);
  showOrHide([quizRefs.screens.results], false);

  // Update and save top-5 high scores

  try {
    const entry = { name: session.username, score: quizState.score };
    highScoresRef.unshift(entry);
    highScoresRef.sort((a, b) => b.score - a.score);
    highScoresRef.splice(5);
    localStorage.setItem("highScores", JSON.stringify(highScoresRef));
  } catch {}

  // Show final message

  quizRefs.finalLine.textContent = `${session.username}, you scored ${quizState.score} / ${quizState.list.length}.`;
}

// Play again -> back to hero

if (quizRefs.playAgain) {
  quizRefs.playAgain.addEventListener("click", () => {
    showOrHide([quizRefs.screens.hero], false);
    showOrHide([quizRefs.screens.quiz], true);
    showOrHide([quizRefs.screens.results], true);
    quizState = { list: [], idx: 0, score: 0, level: null };
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

// Save button: validate and store name (in memory)

if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    if (!isNameValid(nameInput.value)) {
      setError("Please enter at least 2 characters.");
      nameInput.focus();
      return;
    }
    session.username = nameInput.value.trim();
    setError("Saved ✓");
    updateLevelButtonsState();
  });
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

    console.log("Starting quiz →", {
      user: session.username,
      level: session.difficulty,
    });
    startQuiz(level);
  });
});

updateLevelButtonsState();
