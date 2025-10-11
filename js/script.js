const nameInput = document.getElementById('username');
const saveBtn    = document.getElementById('save-name');
const errorLine  = document.getElementById('username-error');
const levelBtns  = document.querySelectorAll('[data-level]');

// --- Quiz sample data (temp until API) ------------------------------------
const SAMPLE_QUESTIONS = {
  easy: [
    { q: "Which continent is France in?", correct: "Europe", options: ["Europe","Asia","Africa","South America"] },
    { q: "The capital of Spain is…",      correct: "Madrid", options: ["Barcelona","Madrid","Seville","Valencia"] },
    { q: "The UK is an island in the…",   correct: "Atlantic Ocean", options: ["Indian Ocean","Pacific Ocean","Atlantic Ocean","Arctic Ocean"] },
  ],
  medium: [
    { q: "Mount Kilimanjaro is in which country?", correct: "Tanzania", options: ["Kenya","Tanzania","Uganda","Ethiopia"] },
    { q: "The Danube flows into which sea?",       correct: "Black Sea", options: ["North Sea","Mediterranean","Black Sea","Baltic Sea"] },
    { q: "Which desert is in northern China?",     correct: "Gobi", options: ["Sahara","Atacama","Gobi","Kalahari"] },
  ],
  hard: [
    { q: "The capital of Kazakhstan is…", correct: "Astana", options: ["Almaty","Astana","Bishkek","Tashkent"] },
    { q: "Lake Baikal is located in…",    correct: "Russia", options: ["Mongolia","China","Kazakhstan","Russia"] },
    { q: "The Strait of Malacca links…",  correct: "Indian & Pacific", options: ["Arctic & Atlantic","Indian & Pacific","Atlantic & Indian","Pacific & Arctic"] },
  ],
};

// --- Quiz UI refs ----------------------------------------------------------
const UI2 = {
  screens: {
    hero: document.querySelector('.hero'),
    quiz: document.getElementById('quiz'),
    results: document.getElementById('results'),
  },
  level: document.getElementById('quiz-level'),
  progress: document.getElementById('quiz-progress'),
  question: document.getElementById('question'),
  answers: Array.from(document.querySelectorAll('.answer-btn')),
  finalLine: document.getElementById('final-line'),
  playAgain: document.getElementById('play-again'),
};

// Simple in-memory model (current session)
const session = {
  username: '',
  difficulty: null,
};

// LocalStorage keys
const LS_PROFILE_KEY = 'geogenius/profile';
const LS_LAST_SESSION_KEY = 'geogenius/lastSession';

// --- API loader
async function loadQuestions(level){
  const amount = 3; // same as your sample length
  const url = `https://opentdb.com/api.php?amount=${amount}&category=22&difficulty=${level}&type=multiple`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.response_code !== 0) throw new Error('OpenTDB response_code != 0');
    // map into your shape
    return data.results.map(item => ({
      q: item.question,                          // raw (may contain &quot; etc.)
      correct: item.correct_answer,              // raw
      options: [item.correct_answer, ...item.incorrect_answers], // raw
    }));
  } catch (e){
    console.warn('API failed, using samples:', e);
    return [...SAMPLE_QUESTIONS[level]];
  }
}

// --- CORE QUIZ FUNCTIONS ---------------------------------------------------

// simple quiz state
let quizState = { list: [], idx: 0, score: 0, level: null };

// screen helpers (reuse your .hide CSS)
function show(el){ el.classList.remove('hide'); }
function hide(el){ el.classList.add('hide'); }

async function startQuiz(level){
  quizState.level = level;
  quizState.idx = 0;
  quizState.score = 0;


  // swap screens
  const hero = UI2.screens.hero;
  const quiz = UI2.screens.quiz;
  const results = UI2.screens.results;
  hide(results);
  hide(hero);
  show(quiz);

  // header labels
  UI2.level.textContent = level.toUpperCase();
  quizState.list = await loadQuestions(level);
  renderQuestion();
}

function renderQuestion(){
  const total = quizState.list.length;
  if (quizState.idx >= total) return endQuiz();

  const item = quizState.list[quizState.idx];

  UI2.progress.textContent = `Q${quizState.idx + 1}/${total}`;
  UI2.question.textContent = item.q;

  // shuffled options
  const opts = [...item.options].sort(() => Math.random() - 0.5);

  // reset + wire answer buttons
  UI2.answers.forEach((btn, i) => {
    btn.classList.remove('correct','wrong','disabled','active');
    btn.disabled = false;
    btn.textContent = opts[i];
    btn.onclick = () => handleAnswer(btn, item.correct);
  });
}

function handleAnswer(btn, correctText){
  // lock all
  UI2.answers.forEach(b => { b.disabled = true; b.classList.add('disabled'); });

  const chosen = btn.textContent;
  const isRight = (chosen === correctText);

  if (isRight) {
    btn.classList.add('correct');
    quizState.score += 1;
  } else {
    btn.classList.add('wrong');
    // highlight the correct one
    const c = UI2.answers.find(b => b.textContent === correctText);
    if (c) c.classList.add('correct');
  }

  // move to next
  setTimeout(() => {
    quizState.idx += 1;
    renderQuestion();
  }, 900);
}

function endQuiz(){
  hide(UI2.screens.quiz);
  show(UI2.screens.results);

  // store score in lastSession you already persist
  try {
    const raw = localStorage.getItem(LS_LAST_SESSION_KEY);
    const last = raw ? JSON.parse(raw) : {};
    last.score = quizState.score;
    last.finishedAt = new Date().toISOString();
    localStorage.setItem(LS_LAST_SESSION_KEY, JSON.stringify(last));
  } catch {}

  UI2.finalLine.textContent =
    `${session.username}, you scored ${quizState.score} / ${quizState.list.length}.`;
}

// Play again -> back to hero
if (UI2.playAgain){
  UI2.playAgain.addEventListener('click', () => {
    show(UI2.screens.hero);
    hide(UI2.screens.quiz);
    hide(UI2.screens.results);
    quizState = { list: [], idx: 0, score: 0, level: null };
  });
}

// --- helpers ---------------------------------------------------------------

function setError(msg = '') {
  if (!errorLine) return;
  errorLine.textContent = msg;
}

function isNameValid(value) {
  const v = (value || '').trim();
  // Adjust min length if you want; 2 works well for real names
  return v.length >= 2;
}

function persistProfile(username) {
  const profile = { username: username.trim(), createdAt: new Date().toISOString() };
  localStorage.setItem(LS_PROFILE_KEY, JSON.stringify(profile));
}

function persistLastSession(username, difficulty) {
  const last = {
    username: username.trim(),
    difficulty,
    startedAt: new Date().toISOString(),
    // score will be added later after quiz: last.score = X
  };
  localStorage.setItem(LS_LAST_SESSION_KEY, JSON.stringify(last));
}

// Enable/disable difficulty buttons based on name validity
function updateLevelButtonsState() {
  const valid = isNameValid(nameInput.value);
  levelBtns.forEach(btn => {
    btn.disabled = !valid;
  });
}

// Visual feedback for selected difficulty (optional)
function markActiveDifficulty(activeBtn) {
  levelBtns.forEach(b => b.classList.remove('active'));
  activeBtn.classList.add('active');
}

// --- events ----------------------------------------------------------------

// Live validation as user types
if (nameInput) {
  nameInput.addEventListener('input', () => {
    if (isNameValid(nameInput.value)) {
      setError('');
    } else {
      setError('Please enter at least 2 characters.');
    }
    updateLevelButtonsState();
  });
}

// Save button (optional UX: lets the user “lock in” the name)
if (saveBtn) {
  saveBtn.addEventListener('click', () => {
    if (!isNameValid(nameInput.value)) {
      setError('Please enter at least 2 characters.');
      nameInput.focus();
      return;
    }
    session.username = nameInput.value.trim();
    persistProfile(session.username);
    setError('Saved ✓');
    updateLevelButtonsState();
  });
}

// Start handlers (one per difficulty)
levelBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const level = btn.dataset.level;

    // Validate username first
    if (!isNameValid(nameInput.value)) {
      setError('Please enter your username before starting.');
      nameInput.focus();
      return;
    }

    // Set session state
    session.username = nameInput.value.trim();
    session.difficulty = level;

    // Persist
    persistProfile(session.username);
    persistLastSession(session.username, session.difficulty);

    // Optional: show selected state
    markActiveDifficulty(btn);

    // TODO: hand over to your quiz flow here
    // For now: replace this with routing or showing the quiz screen
    // e.g., window.location.href = 'quiz.html?level=' + encodeURIComponent(level);
    console.log('Starting quiz →', { user: session.username, level: session.difficulty });
    startQuiz(level);
});
});


// Initialize disabled state on load
updateLevelButtonsState(); 
