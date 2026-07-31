const EXERCISES = [
  "Bench Press",
  "Squat",
  "Deadlift",
  "Overhead Press",
  "Barbell Row",
  "Pull-ups",
  "Dumbbell Curl",
  "Tricep Pushdown",
  "Leg Press",
  "Lat Pulldown",
  "Romanian Deadlift",
  "Incline Bench Press",
  "Lateral Raise",
  "Cable Fly",
  "Plank",
];

const SETS_PER_EXERCISE = 3;

const DEFAULT_REST_SECONDS = 90;

const buildPhase = document.getElementById("build-phase");
const trackPhase = document.getElementById("track-phase");
const summaryPhase = document.getElementById("summary-phase");
const phaseLabel = document.getElementById("phase-label");
const exerciseSelect = document.getElementById("exercise-select");
const addExerciseBtn = document.getElementById("add-exercise-btn");
const exerciseList = document.getElementById("exercise-list");
const emptyListMsg = document.getElementById("empty-list-msg");
const startWorkoutBtn = document.getElementById("start-workout-btn");
const setsContainer = document.getElementById("sets-container");
const finishWorkoutBtn = document.getElementById("finish-workout-btn");
const summaryMeta = document.getElementById("summary-meta");
const summaryDetails = document.getElementById("summary-details");
const newWorkoutBtn = document.getElementById("new-workout-btn");

const restTimerBar = document.getElementById("rest-timer-bar");
const timerDisplay = document.getElementById("timer-display");
const dismissTimerBtn = document.getElementById("dismiss-timer-btn");

let selectedExercises = [];
let timerInterval = null;
let timerSecondsLeft = 0;

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function startRestTimer(duration = DEFAULT_REST_SECONDS) {
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  timerSecondsLeft = duration;
  timerDisplay.textContent = formatTime(timerSecondsLeft);
  restTimerBar.classList.remove("hidden");
  restTimerBar.classList.remove("finished");

  timerInterval = setInterval(() => {
    timerSecondsLeft--;

    if (timerSecondsLeft <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerSecondsLeft = 0;
      timerDisplay.textContent = "0:00";
      restTimerBar.classList.add("finished");
    } else {
      timerDisplay.textContent = formatTime(timerSecondsLeft);
    }
  }, 1000);
}

function stopRestTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  restTimerBar.classList.add("hidden");
}

function populateDropdown() {
  EXERCISES.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    exerciseSelect.appendChild(option);
  });
}

function renderExerciseList() {
  exerciseList.innerHTML = "";

  if (selectedExercises.length === 0) {
    const li = document.createElement("li");
    li.className = "empty-state";
    li.textContent = "No exercises added yet.";
    exerciseList.appendChild(li);
    startWorkoutBtn.disabled = true;
    return;
  }

  selectedExercises.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "exercise-list-item";

    const left = document.createElement("span");
    left.className = "name";
    left.innerHTML = `<span class="index">${index + 1}.</span>${item.name}`;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "btn btn-danger";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => removeExercise(index));

    li.appendChild(left);
    li.appendChild(removeBtn);
    exerciseList.appendChild(li);
  });

  startWorkoutBtn.disabled = false;
}

function addExercise() {
  const name = exerciseSelect.value;
  if (!name) return;

  if (selectedExercises.some((item) => item.name === name)) {
    exerciseSelect.value = "";
    return;
  }

  const initialSets = Array.from({ length: SETS_PER_EXERCISE }, () => ({
    weight: "",
    reps: "",
    completed: false,
  }));

  selectedExercises.push({ name, sets: initialSets });
  exerciseSelect.value = "";
  renderExerciseList();
}

function removeExercise(index) {
  selectedExercises.splice(index, 1);
  renderExerciseList();
}

function addSet(exerciseIndex) {
  selectedExercises[exerciseIndex].sets.push({ weight: "", reps: "", completed: false });
  renderSetsForm();
}

function removeSet(exerciseIndex) {
  const exercise = selectedExercises[exerciseIndex];
  if (exercise.sets.length > 1) {
    exercise.sets.pop();
    renderSetsForm();
  }
}

function handleSetInput(setData) {
  const isFilled = setData.weight !== "" && setData.reps !== "";

  if (isFilled && !setData.completed) {
    setData.completed = true;
    startRestTimer(DEFAULT_REST_SECONDS);
  } else if (!isFilled && setData.completed) {
    setData.completed = false;
  }
}

function showPhase(phase) {
  buildPhase.classList.add("hidden");
  trackPhase.classList.add("hidden");
  summaryPhase.classList.add("hidden");

  if (phase === "build") {
    buildPhase.classList.remove("hidden");
    phaseLabel.textContent = "Build your workout";
  } else if (phase === "track") {
    trackPhase.classList.remove("hidden");
    phaseLabel.textContent = "Log your sets";
  } else if (phase === "summary") {
    summaryPhase.classList.remove("hidden");
    phaseLabel.textContent = "Summary";
  }
}

function renderSetsForm() {
  setsContainer.innerHTML = "";

  selectedExercises.forEach((item, exerciseIndex) => {
    const block = document.createElement("div");
    block.className = "exercise-block";
    block.dataset.exerciseIndex = exerciseIndex;

    const header = document.createElement("div");
    header.className = "exercise-header";

    const title = document.createElement("h3");
    title.textContent = item.name;

    const setControls = document.createElement("div");
    setControls.className = "set-controls";

    const minusBtn = document.createElement("button");
    minusBtn.type = "button";
    minusBtn.className = "btn-set-control";
    minusBtn.textContent = "−";
    minusBtn.setAttribute("aria-label", `Decrease sets for ${item.name}`);
    if (item.sets.length <= 1) {
      minusBtn.disabled = true;
    }
    minusBtn.addEventListener("click", () => removeSet(exerciseIndex));

    const setBadge = document.createElement("span");
    setBadge.className = "set-count-badge";
    setBadge.textContent = `${item.sets.length} set${item.sets.length !== 1 ? "s" : ""}`;

    const plusBtn = document.createElement("button");
    plusBtn.type = "button";
    plusBtn.className = "btn-set-control";
    plusBtn.textContent = "+";
    plusBtn.setAttribute("aria-label", `Increase sets for ${item.name}`);
    plusBtn.addEventListener("click", () => addSet(exerciseIndex));

    setControls.appendChild(minusBtn);
    setControls.appendChild(setBadge);
    setControls.appendChild(plusBtn);

    header.appendChild(title);
    header.appendChild(setControls);
    block.appendChild(header);

    const tableHeader = document.createElement("div");
    tableHeader.className = "sets-header";
    tableHeader.innerHTML = "<span>Set</span><span>Weight (lbs)</span><span>Reps</span>";
    block.appendChild(tableHeader);

    item.sets.forEach((setData, setIdx) => {
      const setNum = setIdx + 1;
      const row = document.createElement("div");
      row.className = "set-row";

      const setLabel = document.createElement("span");
      setLabel.className = "set-number";
      setLabel.textContent = setNum;

      const weightInput = document.createElement("input");
      weightInput.type = "number";
      weightInput.className = "input";
      weightInput.placeholder = "0";
      weightInput.min = "0";
      weightInput.step = "2.5";
      weightInput.value = setData.weight;
      weightInput.inputMode = "decimal";
      weightInput.addEventListener("input", (e) => {
        setData.weight = e.target.value;
        handleSetInput(setData);
      });

      const repsInput = document.createElement("input");
      repsInput.type = "number";
      repsInput.className = "input";
      repsInput.placeholder = "0";
      repsInput.min = "0";
      repsInput.step = "1";
      repsInput.value = setData.reps;
      repsInput.inputMode = "numeric";
      repsInput.addEventListener("input", (e) => {
        setData.reps = e.target.value;
        handleSetInput(setData);
      });

      row.appendChild(setLabel);
      row.appendChild(weightInput);
      row.appendChild(repsInput);
      block.appendChild(row);
    });

    setsContainer.appendChild(block);
  });
}

function collectWorkoutData() {
  return selectedExercises.map((item) => {
    const sets = item.sets.map((s, idx) => ({
      set: idx + 1,
      weight: s.weight !== "" && s.weight !== null ? Number(s.weight) : null,
      reps: s.reps !== "" && s.reps !== null ? Number(s.reps) : null,
    }));

    return { name: item.name, sets };
  });
}

function renderSummary(workoutData) {
  const totalSets = workoutData.reduce((sum, ex) => sum + ex.sets.length, 0);
  const loggedSets = workoutData.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.weight !== null || s.reps !== null).length,
    0
  );

  summaryMeta.textContent = `${workoutData.length} exercise${workoutData.length !== 1 ? "s" : ""} · ${loggedSets} of ${totalSets} sets logged`;

  summaryDetails.innerHTML = "";

  workoutData.forEach((exercise) => {
    const div = document.createElement("div");
    div.className = "summary-exercise";

    const heading = document.createElement("h4");
    heading.textContent = exercise.name;
    div.appendChild(heading);

    exercise.sets.forEach((set) => {
      const p = document.createElement("p");
      p.className = "summary-set";

      const weight = set.weight !== null ? `${set.weight} lbs` : "—";
      const reps = set.reps !== null ? `${set.reps} reps` : "—";
      p.textContent = `Set ${set.set}: ${weight} × ${reps}`;
      div.appendChild(p);
    });

    summaryDetails.appendChild(div);
  });
}

function startWorkout() {
  if (selectedExercises.length === 0) return;
  renderSetsForm();
  showPhase("track");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function finishWorkout() {
  stopRestTimer();
  const data = collectWorkoutData();
  renderSummary(data);
  showPhase("summary");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetWorkout() {
  stopRestTimer();
  selectedExercises = [];
  renderExerciseList();
  showPhase("build");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

addExerciseBtn.addEventListener("click", addExercise);
exerciseSelect.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addExercise();
});
startWorkoutBtn.addEventListener("click", startWorkout);
finishWorkoutBtn.addEventListener("click", finishWorkout);
newWorkoutBtn.addEventListener("click", resetWorkout);
dismissTimerBtn.addEventListener("click", stopRestTimer);

populateDropdown();
renderExerciseList();
