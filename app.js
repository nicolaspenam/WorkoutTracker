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

let selectedExercises = [];

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

  selectedExercises.forEach((name, index) => {
    const li = document.createElement("li");
    li.className = "exercise-list-item";

    const left = document.createElement("span");
    left.className = "name";
    left.innerHTML = `<span class="index">${index + 1}.</span>${name}`;

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

  if (selectedExercises.includes(name)) {
    exerciseSelect.value = "";
    return;
  }

  selectedExercises.push(name);
  exerciseSelect.value = "";
  renderExerciseList();
}

function removeExercise(index) {
  selectedExercises.splice(index, 1);
  renderExerciseList();
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

  selectedExercises.forEach((name, exerciseIndex) => {
    const block = document.createElement("div");
    block.className = "exercise-block";
    block.dataset.exerciseIndex = exerciseIndex;

    const title = document.createElement("h3");
    title.textContent = name;
    block.appendChild(title);

    const header = document.createElement("div");
    header.className = "sets-header";
    header.innerHTML = "<span>Set</span><span>Weight (lbs)</span><span>Reps</span>";
    block.appendChild(header);

    for (let setNum = 1; setNum <= SETS_PER_EXERCISE; setNum++) {
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
      weightInput.dataset.field = "weight";
      weightInput.dataset.exercise = exerciseIndex;
      weightInput.dataset.set = setNum - 1;
      weightInput.inputMode = "decimal";

      const repsInput = document.createElement("input");
      repsInput.type = "number";
      repsInput.className = "input";
      repsInput.placeholder = "0";
      repsInput.min = "0";
      repsInput.step = "1";
      repsInput.dataset.field = "reps";
      repsInput.dataset.exercise = exerciseIndex;
      repsInput.dataset.set = setNum - 1;
      repsInput.inputMode = "numeric";

      row.appendChild(setLabel);
      row.appendChild(weightInput);
      row.appendChild(repsInput);
      block.appendChild(row);
    }

    setsContainer.appendChild(block);
  });
}

function collectWorkoutData() {
  return selectedExercises.map((name, exerciseIndex) => {
    const sets = [];

    for (let setNum = 0; setNum < SETS_PER_EXERCISE; setNum++) {
      const weightEl = document.querySelector(
        `[data-field="weight"][data-exercise="${exerciseIndex}"][data-set="${setNum}"]`
      );
      const repsEl = document.querySelector(
        `[data-field="reps"][data-exercise="${exerciseIndex}"][data-set="${setNum}"]`
      );

      sets.push({
        set: setNum + 1,
        weight: weightEl.value !== "" ? Number(weightEl.value) : null,
        reps: repsEl.value !== "" ? Number(repsEl.value) : null,
      });
    }

    return { name, sets };
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
  const data = collectWorkoutData();
  renderSummary(data);
  showPhase("summary");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetWorkout() {
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

populateDropdown();
renderExerciseList();
