import {
  EXERCISES,
  MUSCLE_GROUPS,
  EQUIPMENT,
  SETS_PER_EXERCISE,
  DEFAULT_REST_SECONDS,
  REST_PRESETS,
  STORAGE_KEY,
  TIMER_ADJUST_SECONDS,
  formatTime,
  createExercise,
  collectWorkoutData,
  summarizeExercises,
  displayWorkoutName,
  formatRelativeDate,
  formatFullDate,
  getPreviousSets,
  attachPreviousSets,
  hasPreviousSet,
  applyPreviousSet,
  updateSetField,
  fieldInputSource,
  addSet as addSetToExercise,
  removeSet as removeSetFromExercise,
  workoutToExercises,
  computePersonalRecords,
  queryPersonalRecords,
  formatLoad,
  parseStoredState,
  serializeState,
  saveCompletedWorkout,
  renameWorkout,
  buildExportPayload,
  parseImportPayload,
  mergeWorkouts,
  exportFilename,
  groupExercisesByMuscle,
  getMuscleForExercise,
  getMuscleLabel,
  filterRecordsByMuscle,
  defaultEquipmentIds,
  defaultSettings,
  filterCatalog,
  toggleEquipmentId,
  hasAllEquipment,
  adjustTimerSeconds,
  suggestWorkouts,
  exercisesFromSuggestion,
  visibleLibraryItems,
  hideWorkoutFromLibrary,
  saveSuggestionTemplate,
  removeTemplate,
} from "./logic.js";

const buildPhase = document.getElementById("build-phase");
const trackPhase = document.getElementById("track-phase");
const summaryPhase = document.getElementById("summary-phase");
const phaseLabel = document.getElementById("phase-label");
const exerciseSelect = document.getElementById("exercise-select");
const addExerciseBtn = document.getElementById("add-exercise-btn");
const exerciseList = document.getElementById("exercise-list");
const startWorkoutBtn = document.getElementById("start-workout-btn");
const setsContainer = document.getElementById("sets-container");
const finishWorkoutBtn = document.getElementById("finish-workout-btn");
const summaryMeta = document.getElementById("summary-meta");
const summaryDetails = document.getElementById("summary-details");
const newWorkoutBtn = document.getElementById("new-workout-btn");
const workoutNameInput = document.getElementById("workout-name");
const summaryNameInput = document.getElementById("summary-name");
const savedWorkoutsList = document.getElementById("saved-workouts-list");
const prSearch = document.getElementById("pr-search");
const prResults = document.getElementById("pr-results");
const exportBtn = document.getElementById("export-btn");
const importBtn = document.getElementById("import-btn");
const importFileInput = document.getElementById("import-file");
const backupStatus = document.getElementById("backup-status");
const importConfirm = document.getElementById("import-confirm");
const importConfirmText = document.getElementById("import-confirm-text");
const importMergeBtn = document.getElementById("import-merge-btn");
const importReplaceBtn = document.getElementById("import-replace-btn");
const importCancelBtn = document.getElementById("import-cancel-btn");
const muscleFilters = document.getElementById("muscle-filters");
const prMuscleFilters = document.getElementById("pr-muscle-filters");
const equipmentFilters = document.getElementById("equipment-filters");
const restPresets = document.getElementById("rest-presets");
const timerRestPresets = document.getElementById("timer-rest-presets");
const suggestionList = document.getElementById("suggestion-list");
const suggestHelp = document.getElementById("suggest-help");
const timerMinusBtn = document.getElementById("timer-minus-btn");
const timerPlusBtn = document.getElementById("timer-plus-btn");

const restTimerBar = document.getElementById("rest-timer-bar");
const timerDisplay = document.getElementById("timer-display");
const dismissTimerBtn = document.getElementById("dismiss-timer-btn");

let selectedExercises = [];
let savedWorkouts = [];
let savedWorkoutId = null;
let timerInterval = null;
let timerSecondsLeft = 0;
let activeTab = "workout";
let pendingImport = null;
let muscleFilter = null;
let prMuscleFilter = null;
let hiddenIds = [];
let templates = [];
let restSeconds = DEFAULT_REST_SECONDS;
let equipmentIds = defaultEquipmentIds();

function loadWorkouts() {
  try {
    const state = parseStoredState(localStorage.getItem(STORAGE_KEY));
    hiddenIds = state.hiddenIds || [];
    templates = state.templates || [];
    const settings = state.settings || defaultSettings();
    restSeconds = settings.restSeconds;
    equipmentIds = settings.equipmentIds;
    return state.workouts;
  } catch {
    hiddenIds = [];
    templates = [];
    restSeconds = DEFAULT_REST_SECONDS;
    equipmentIds = defaultEquipmentIds();
    return [];
  }
}

function persistWorkouts() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      serializeState({
        workouts: savedWorkouts,
        hiddenIds,
        templates,
        settings: { restSeconds, equipmentIds },
      })
    );
  } catch {
    // Storage may be unavailable (private mode / quota). Keep working in-memory.
  }
}

function setBackupStatus(message, kind) {
  backupStatus.textContent = message || "";
  backupStatus.classList.toggle("error", kind === "error");
  backupStatus.classList.toggle("success", kind === "success");
}

function hideImportConfirm() {
  pendingImport = null;
  importConfirm.classList.add("hidden");
  importFileInput.value = "";
}

function applyImportedWorkouts(workouts, mode, extra = {}) {
  if (mode === "replace") {
    savedWorkouts = workouts;
    hiddenIds = extra.hiddenIds || [];
    templates = extra.templates || [];
    if (extra.settings) {
      restSeconds = extra.settings.restSeconds;
      equipmentIds = extra.settings.equipmentIds;
    }
    setBackupStatus(`Replaced history with ${workouts.length} workout${workouts.length !== 1 ? "s" : ""}.`, "success");
  } else {
    const result = mergeWorkouts(savedWorkouts, workouts);
    savedWorkouts = result.workouts;
    if (Array.isArray(extra.hiddenIds) && extra.hiddenIds.length) {
      hiddenIds = [...new Set([...hiddenIds, ...extra.hiddenIds.filter((id) => typeof id === "string")])];
    }
    if (Array.isArray(extra.templates) && extra.templates.length) {
      const existingIds = new Set(templates.map((t) => t.id));
      templates = [...templates, ...extra.templates.filter((t) => t?.id && !existingIds.has(t.id))];
    }
    const parts = [`Added ${result.added} workout${result.added !== 1 ? "s" : ""}`];
    if (result.skipped) {
      parts.push(`${result.skipped} already present`);
    }
    setBackupStatus(`${parts.join(", ")}.`, "success");
  }
  persistWorkouts();
  renderSavedWorkouts();
  renderPersonalRecords();
  renderEquipmentChips();
  renderRestPresets();
  renderSuggestions();
  hideImportConfirm();
}

function downloadBackupFile(filename, json) {
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function exportBackup() {
  const payload = buildExportPayload(savedWorkouts, new Date().toISOString(), {
    hiddenIds,
    templates,
    settings: { restSeconds, equipmentIds },
  });
  const json = JSON.stringify(payload, null, 2);
  const filename = exportFilename();
  const blob = new Blob([json], { type: "application/json" });
  const file = new File([blob], filename, { type: "application/json" });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: "Workout tracker backup",
        text: "Workout tracker backup",
      });
      setBackupStatus(`Shared ${filename}. Save it somewhere you can find later.`, "success");
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }

  downloadBackupFile(filename, json);
  setBackupStatus(`Downloaded ${filename}. Keep a copy in Drive, iCloud, or email.`, "success");
}

function promptImportChoice(parsed) {
  pendingImport = parsed;
  importConfirmText.textContent =
    `This backup has ${parsed.workouts.length} workout${parsed.workouts.length !== 1 ? "s" : ""}. ` +
    `You already have ${savedWorkouts.length}. Merge keeps both; Replace overwrites this device.`;
  importConfirm.classList.remove("hidden");
}

async function handleImportFile(file) {
  if (!file) return;
  let text;
  try {
    text = await file.text();
  } catch {
    setBackupStatus("Could not read that file.", "error");
    importFileInput.value = "";
    return;
  }

  const parsed = parseImportPayload(text);
  if (!parsed.ok) {
    setBackupStatus(parsed.error, "error");
    importFileInput.value = "";
    return;
  }

  if (savedWorkouts.length === 0 && templates.length === 0) {
    applyImportedWorkouts(parsed.workouts, "replace", parsed);
    return;
  }

  promptImportChoice(parsed);
}

function startRestTimer(duration = restSeconds) {
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  timerSecondsLeft = Math.max(0, duration);
  timerDisplay.textContent = formatTime(timerSecondsLeft);
  restTimerBar.classList.remove("hidden");
  restTimerBar.classList.remove("finished");
  renderTimerRestPresets();

  if (timerSecondsLeft <= 0) {
    timerInterval = null;
    restTimerBar.classList.add("finished");
    return;
  }

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

function nudgeTimer(delta) {
  const current = restTimerBar.classList.contains("hidden")
    ? restSeconds
    : timerSecondsLeft;
  const next = adjustTimerSeconds(current, delta);
  startRestTimer(next);
}

function stopRestTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  restTimerBar.classList.add("hidden");
}

function populateDropdown() {
  const previousValue = exerciseSelect.value;
  exerciseSelect.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = muscleFilter
    ? `Choose a ${(getMuscleLabel(muscleFilter) || "muscle").toLowerCase()} exercise…`
    : "Choose an exercise…";
  exerciseSelect.appendChild(placeholder);

  const filtered = filterCatalog(EXERCISES, muscleFilter, equipmentIds);

  if (muscleFilter) {
    filtered
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((ex) => {
        const option = document.createElement("option");
        option.value = ex.name;
        option.textContent = ex.name;
        exerciseSelect.appendChild(option);
      });
  } else {
    groupExercisesByMuscle(filtered).forEach((group) => {
      const optgroup = document.createElement("optgroup");
      optgroup.label = group.label;
      group.exercises.forEach((ex) => {
        const option = document.createElement("option");
        option.value = ex.name;
        option.textContent = ex.name;
        optgroup.appendChild(option);
      });
      exerciseSelect.appendChild(optgroup);
    });
  }

  if ([...exerciseSelect.options].some((opt) => opt.value === previousValue)) {
    exerciseSelect.value = previousValue;
  }
}

function renderMuscleChips(container, selectedId, onSelect) {
  container.innerHTML = "";

  const chips = [{ id: null, label: "All" }, ...MUSCLE_GROUPS];
  chips.forEach((group) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "muscle-chip" + (selectedId === group.id ? " active" : "");
    btn.textContent = group.label;
    btn.setAttribute("aria-pressed", selectedId === group.id ? "true" : "false");
    btn.addEventListener("click", () => onSelect(group.id));
    container.appendChild(btn);
  });
}

function setMuscleFilter(muscleId) {
  muscleFilter = muscleId;
  renderMuscleChips(muscleFilters, muscleFilter, setMuscleFilter);
  populateDropdown();
}

function setPrMuscleFilter(muscleId) {
  prMuscleFilter = muscleId;
  renderMuscleChips(prMuscleFilters, prMuscleFilter, setPrMuscleFilter);
  renderPersonalRecords();
}

function renderEquipmentChips() {
  equipmentFilters.innerHTML = "";
  const allOn = hasAllEquipment(equipmentIds);
  const allBtn = document.createElement("button");
  allBtn.type = "button";
  allBtn.className = "muscle-chip" + (allOn ? " active" : "");
  allBtn.textContent = "All";
  allBtn.setAttribute("aria-pressed", allOn ? "true" : "false");
  allBtn.addEventListener("click", () => {
    equipmentIds = defaultEquipmentIds();
    persistWorkouts();
    renderEquipmentChips();
    populateDropdown();
    renderSuggestions();
  });
  equipmentFilters.appendChild(allBtn);

  EQUIPMENT.forEach((item) => {
    const on = equipmentIds.includes(item.id);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "muscle-chip" + (on ? " active" : "");
    btn.textContent = item.label;
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.addEventListener("click", () => {
      equipmentIds = toggleEquipmentId(equipmentIds, item.id);
      persistWorkouts();
      renderEquipmentChips();
      populateDropdown();
      renderSuggestions();
    });
    equipmentFilters.appendChild(btn);
  });
}

function renderRestPresetButtons(container) {
  container.innerHTML = "";
  REST_PRESETS.forEach((seconds) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "rest-chip" + (restSeconds === seconds ? " active" : "");
    btn.textContent = formatTime(seconds);
    btn.addEventListener("click", () => {
      restSeconds = seconds;
      persistWorkouts();
      renderRestPresets();
      if (!restTimerBar.classList.contains("hidden")) {
        startRestTimer(seconds);
      }
    });
    container.appendChild(btn);
  });
}

function renderRestPresets() {
  renderRestPresetButtons(restPresets);
  renderTimerRestPresets();
}

function renderTimerRestPresets() {
  if (timerRestPresets) renderRestPresetButtons(timerRestPresets);
}

function applySuggestion(suggestion) {
  selectedExercises = exercisesFromSuggestion(suggestion, savedWorkouts);
  workoutNameInput.value = suggestion.name || "";
  renderExerciseList();
  setActiveTab("workout");
  phaseLabel.textContent = `Loaded ${suggestion.name}`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function saveSuggestion(suggestion) {
  templates = saveSuggestionTemplate(templates, suggestion);
  persistWorkouts();
  renderSavedWorkouts();
  setActiveTab("history");
}

function renderSuggestions() {
  const suggestions = suggestWorkouts(savedWorkouts, { equipmentIds });
  suggestionList.innerHTML = "";
  if (suggestions.length === 0) {
    suggestHelp.textContent = "No matching exercises for that equipment mix.";
    return;
  }
  suggestHelp.textContent =
    suggestions.length > 1
      ? "No sessions in the last week — pick a hypertrophy split. Equipment filters apply."
      : "Built from recent volume and 48-hour recovery, using only the equipment you have.";

  suggestions.forEach((suggestion) => {
    const card = document.createElement("div");
    card.className = "suggestion-card";
    const title = document.createElement("h3");
    title.textContent = suggestion.name;
    const reason = document.createElement("p");
    reason.className = "suggestion-reason";
    reason.textContent = suggestion.reason;
    const summary = document.createElement("p");
    summary.className = "suggestion-summary";
    summary.textContent = suggestion.exercises.map((ex) => `${ex.name} · ${ex.setCount} sets`).join(" · ");
    const actions = document.createElement("div");
    actions.className = "suggestion-actions";
    const useBtn = document.createElement("button");
    useBtn.type = "button";
    useBtn.className = "btn btn-primary";
    useBtn.textContent = "Use workout";
    useBtn.addEventListener("click", () => applySuggestion(suggestion));
    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "btn btn-secondary";
    saveBtn.textContent = "Save to list";
    saveBtn.addEventListener("click", () => saveSuggestion(suggestion));
    actions.appendChild(useBtn);
    actions.appendChild(saveBtn);
    card.appendChild(title);
    card.appendChild(reason);
    card.appendChild(summary);
    card.appendChild(actions);
    suggestionList.appendChild(card);
  });
}

function personalRecords() {
  return computePersonalRecords(savedWorkouts);
}

function renderExerciseList() {
  exerciseList.innerHTML = "";

  if (selectedExercises.length === 0) {
    const li = document.createElement("li");
    li.className = "empty-state";
    li.textContent = "No exercises added yet. Add one above or reuse a workout from History.";
    exerciseList.appendChild(li);
    startWorkoutBtn.disabled = true;
    return;
  }

  selectedExercises.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "exercise-list-item";

    const left = document.createElement("span");
    left.className = "name";
    const muscleId = getMuscleForExercise(item.name);
    const muscleName = muscleId ? getMuscleLabel(muscleId) : "";
    left.innerHTML = `<span class="index">${index + 1}.</span>${item.name}${
      muscleName ? `<span class="muscle">${muscleName}</span>` : ""
    }`;

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

  const previousSets = getPreviousSets(savedWorkouts, name);
  selectedExercises.push(createExercise(name, SETS_PER_EXERCISE, previousSets));
  exerciseSelect.value = "";
  renderExerciseList();
}

function removeExercise(index) {
  selectedExercises.splice(index, 1);
  renderExerciseList();
}

function addSet(exerciseIndex) {
  addSetToExercise(selectedExercises[exerciseIndex]);
  renderSetsForm();
}

function removeSet(exerciseIndex) {
  removeSetFromExercise(selectedExercises[exerciseIndex]);
  renderSetsForm();
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

function setActiveTab(tab) {
  activeTab = tab;
  document.querySelectorAll(".tab").forEach((btn) => {
    const on = btn.dataset.tab === tab;
    btn.classList.toggle("active", on);
    btn.setAttribute("aria-selected", on ? "true" : "false");
  });
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    const on = panel.id === `panel-${tab}`;
    panel.classList.toggle("hidden", !on);
    panel.hidden = !on;
  });
}

function renderSavedWorkouts() {
  savedWorkoutsList.innerHTML = "";
  const items = visibleLibraryItems(savedWorkouts, hiddenIds, templates);

  if (items.length === 0) {
    const li = document.createElement("li");
    li.className = "empty-state";
    li.textContent = "No saved workouts yet. Finish a session or save a suggestion.";
    savedWorkoutsList.appendChild(li);
    return;
  }

  items.forEach((workout) => {
    const li = document.createElement("li");
    li.className = "saved-item";

    const header = document.createElement("div");
    header.className = "saved-item-header";

    const text = document.createElement("div");
    const title = document.createElement("div");
    title.className = "saved-item-title";
    title.textContent = displayWorkoutName(workout);

    const date = document.createElement("div");
    date.className = "saved-item-date";
    const stats = summarizeExercises(workout.exercises);
    const when = workout.kind === "template"
      ? "Saved suggestion"
      : formatFullDate(workout.completedAt);
    date.textContent = `${when} · ${stats.exerciseCount} exercise${stats.exerciseCount !== 1 ? "s" : ""}`;

    text.appendChild(title);
    text.appendChild(date);

    const actions = document.createElement("div");
    actions.className = "saved-item-actions";

    const useBtn = document.createElement("button");
    useBtn.type = "button";
    useBtn.className = "btn btn-secondary";
    useBtn.textContent = "Use workout";
    useBtn.addEventListener("click", () => useSavedWorkout(workout));

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "btn btn-danger";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      if (workout.kind === "template") {
        templates = removeTemplate(templates, workout.id);
      } else {
        hiddenIds = hideWorkoutFromLibrary(hiddenIds, workout.id);
      }
      persistWorkouts();
      renderSavedWorkouts();
    });

    actions.appendChild(useBtn);
    actions.appendChild(removeBtn);

    header.appendChild(text);
    header.appendChild(actions);

    const summary = document.createElement("p");
    summary.className = "saved-item-summary";
    summary.textContent = stats.summary || "No exercises";

    li.appendChild(header);
    li.appendChild(summary);
    savedWorkoutsList.appendChild(li);
  });
}

function renderPersonalRecords() {
  const records = filterRecordsByMuscle(
    queryPersonalRecords(personalRecords(), prSearch.value),
    prMuscleFilter
  );
  prResults.innerHTML = "";

  if (records.length === 0) {
    const li = document.createElement("li");
    li.className = "empty-state";
    li.textContent = savedWorkouts.length === 0
      ? "Finish a workout to start tracking PRs."
      : "No exercises match that search.";
    prResults.appendChild(li);
    return;
  }

  records.forEach((pr) => {
    const li = document.createElement("li");
    li.className = "pr-item";

    const left = document.createElement("div");
    const name = document.createElement("div");
    name.className = "pr-name";
    name.textContent = pr.name;

    const meta = document.createElement("div");
    meta.className = "pr-meta";
    const when = pr.date ? formatRelativeDate(pr.date) : "";
    meta.textContent = [pr.workoutName, when].filter(Boolean).join(" · ");

    left.appendChild(name);
    left.appendChild(meta);

    const load = document.createElement("div");
    load.className = "pr-load";
    load.textContent = formatLoad(pr.weight, pr.reps);

    li.appendChild(left);
    li.appendChild(load);
    prResults.appendChild(li);
  });
}

function useSavedWorkout(workout) {
  selectedExercises = workoutToExercises(workout, savedWorkouts);
  if (workout.name) {
    workoutNameInput.value = workout.name;
  }
  renderExerciseList();
  setActiveTab("workout");
  phaseLabel.textContent = `Loaded ${displayWorkoutName(workout)}`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function inputClassFor(setData, field) {
  const source = fieldInputSource(setData, field);
  if (source === "previous") return "input from-previous";
  if (source === "typed") return "input from-typed";
  return "input";
}

function renderSetsForm() {
  setsContainer.innerHTML = "";

  const legend = document.createElement("p");
  legend.className = "legend";
  legend.innerHTML = `
    <span><span class="legend-swatch previous"></span>Previous (tap ✓ to copy)</span>
    <span><span class="legend-swatch typed"></span>Typed / confirmed</span>
  `;
  setsContainer.appendChild(legend);

  const prs = personalRecords();

  selectedExercises.forEach((item, exerciseIndex) => {
    const block = document.createElement("div");
    block.className = "exercise-block";
    block.dataset.exerciseIndex = exerciseIndex;

    const header = document.createElement("div");
    header.className = "exercise-header";

    const titleWrap = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = item.name;
    titleWrap.appendChild(title);

    const pr = prs[item.name];
    if (pr) {
      const prLine = document.createElement("div");
      prLine.className = "exercise-pr";
      prLine.textContent = `PR ${formatLoad(pr.weight, pr.reps)}`;
      titleWrap.appendChild(prLine);
    }

    const setControls = document.createElement("div");
    setControls.className = "set-controls";

    const minusBtn = document.createElement("button");
    minusBtn.type = "button";
    minusBtn.className = "btn-set-control";
    minusBtn.textContent = "−";
    minusBtn.setAttribute("aria-label", `Remove a set from ${item.name}`);
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
    plusBtn.setAttribute("aria-label", `Add a set to ${item.name}`);
    plusBtn.addEventListener("click", () => addSet(exerciseIndex));

    setControls.appendChild(minusBtn);
    setControls.appendChild(setBadge);
    setControls.appendChild(plusBtn);

    header.appendChild(titleWrap);
    header.appendChild(setControls);
    block.appendChild(header);

    const tableHeader = document.createElement("div");
    tableHeader.className = "sets-header";
    tableHeader.innerHTML = "<span>Set</span><span>Weight</span><span>Reps</span><span></span>";
    block.appendChild(tableHeader);

    item.sets.forEach((setData, setIdx) => {
      const setNum = setIdx + 1;
      const group = document.createElement("div");
      group.className = "set-group";

      const row = document.createElement("div");
      row.className = "set-row";

      const setLabel = document.createElement("span");
      setLabel.className = "set-number";
      setLabel.textContent = setNum;

      const weightInput = document.createElement("input");
      weightInput.type = "number";
      weightInput.className = inputClassFor(setData, "weight");
      weightInput.placeholder = "lbs";
      weightInput.min = "0";
      weightInput.step = "2.5";
      weightInput.value = setData.weight;
      weightInput.inputMode = "decimal";
      weightInput.setAttribute("aria-label", `${item.name} set ${setNum} weight`);

      const repsInput = document.createElement("input");
      repsInput.type = "number";
      repsInput.className = inputClassFor(setData, "reps");
      repsInput.placeholder = "reps";
      repsInput.min = "0";
      repsInput.step = "1";
      repsInput.value = setData.reps;
      repsInput.inputMode = "numeric";
      repsInput.setAttribute("aria-label", `${item.name} set ${setNum} reps`);

      const autoBtn = document.createElement("button");
      autoBtn.type = "button";
      autoBtn.className = "btn-autofill";
      autoBtn.textContent = "✓";
      syncAutofillButton(autoBtn, setData, item.name, setNum);

      const refreshSetUi = () => {
        weightInput.className = inputClassFor(setData, "weight");
        repsInput.className = inputClassFor(setData, "reps");
        syncAutofillButton(autoBtn, setData, item.name, setNum);
      };

      weightInput.addEventListener("input", (e) => {
        const shouldStartTimer = updateSetField(setData, "weight", e.target.value);
        refreshSetUi();
        if (shouldStartTimer) startRestTimer(restSeconds);
      });

      repsInput.addEventListener("input", (e) => {
        const shouldStartTimer = updateSetField(setData, "reps", e.target.value);
        refreshSetUi();
        if (shouldStartTimer) startRestTimer(restSeconds);
      });

      autoBtn.addEventListener("click", () => {
        const shouldStartTimer = applyPreviousSet(setData);
        weightInput.value = setData.weight;
        repsInput.value = setData.reps;
        refreshSetUi();
        if (shouldStartTimer) startRestTimer(restSeconds);
      });

      row.appendChild(setLabel);
      row.appendChild(weightInput);
      row.appendChild(repsInput);
      row.appendChild(autoBtn);

      const prevRow = document.createElement("div");
      prevRow.className = "set-prev-row";
      const spacer = document.createElement("span");
      const prevWeight = document.createElement("span");
      prevWeight.className = hasPreviousSet(setData) ? "prev-hint" : "prev-hint empty";
      prevWeight.textContent = hasPreviousSet(setData)
        ? `prev ${setData.previousWeight ?? "—"}`
        : "";
      const prevReps = document.createElement("span");
      prevReps.className = hasPreviousSet(setData) ? "prev-hint" : "prev-hint empty";
      prevReps.textContent = hasPreviousSet(setData)
        ? `prev ${setData.previousReps ?? "—"}`
        : "";
      const prevSpacer = document.createElement("span");
      prevRow.appendChild(spacer);
      prevRow.appendChild(prevWeight);
      prevRow.appendChild(prevReps);
      prevRow.appendChild(prevSpacer);

      group.appendChild(row);
      group.appendChild(prevRow);
      block.appendChild(group);
    });

    setsContainer.appendChild(block);
  });
}

function syncAutofillButton(btn, setData, exerciseName, setNum) {
  const available = hasPreviousSet(setData);
  btn.disabled = !available;
  btn.classList.toggle("applied", setData.source === "previous");
  const label = available
    ? `Use previous ${formatLoad(setData.previousWeight, setData.previousReps)} for ${exerciseName || "exercise"} set ${setNum || ""}`.trim()
    : "No previous set to copy";
  btn.setAttribute("aria-label", label);
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
      p.textContent = `Set ${set.set}: ${formatLoad(set.weight, set.reps)}`;
      div.appendChild(p);
    });

    summaryDetails.appendChild(div);
  });
}

function startWorkout() {
  if (selectedExercises.length === 0) return;
  selectedExercises = attachPreviousSets(selectedExercises, savedWorkouts);
  renderSetsForm();
  showPhase("track");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function finishWorkout() {
  stopRestTimer();
  const data = collectWorkoutData(selectedExercises);
  const name = workoutNameInput.value.trim() || summaryNameInput.value.trim();
  savedWorkouts = saveCompletedWorkout(savedWorkouts, {
    name,
    exercises: data,
  });
  savedWorkoutId = savedWorkouts[0].id;
  persistWorkouts();
  summaryNameInput.value = name;
  renderSummary(data);
  renderSavedWorkouts();
  renderPersonalRecords();
  renderSuggestions();
  showPhase("summary");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetWorkout() {
  stopRestTimer();
  selectedExercises = [];
  savedWorkoutId = null;
  workoutNameInput.value = "";
  summaryNameInput.value = "";
  renderExerciseList();
  setActiveTab("workout");
  showPhase("build");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function bindEvents() {
  addExerciseBtn.addEventListener("click", addExercise);
  exerciseSelect.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addExercise();
  });
  startWorkoutBtn.addEventListener("click", startWorkout);
  finishWorkoutBtn.addEventListener("click", finishWorkout);
  newWorkoutBtn.addEventListener("click", resetWorkout);
  dismissTimerBtn.addEventListener("click", stopRestTimer);
  timerMinusBtn.addEventListener("click", () => nudgeTimer(-TIMER_ADJUST_SECONDS));
  timerPlusBtn.addEventListener("click", () => nudgeTimer(TIMER_ADJUST_SECONDS));

  workoutNameInput.addEventListener("input", () => {
    summaryNameInput.value = workoutNameInput.value;
  });

  summaryNameInput.addEventListener("input", () => {
    if (!savedWorkoutId) return;
    savedWorkouts = renameWorkout(savedWorkouts, savedWorkoutId, summaryNameInput.value);
    persistWorkouts();
    renderSavedWorkouts();
    renderPersonalRecords();
  });

  prSearch.addEventListener("input", renderPersonalRecords);

  document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => setActiveTab(btn.dataset.tab));
  });

  exportBtn.addEventListener("click", () => {
    exportBackup();
  });
  importBtn.addEventListener("click", () => {
    hideImportConfirm();
    setBackupStatus("");
    importFileInput.click();
  });
  importFileInput.addEventListener("change", () => {
    const file = importFileInput.files?.[0];
    handleImportFile(file);
  });
  importMergeBtn.addEventListener("click", () => {
    if (pendingImport) applyImportedWorkouts(pendingImport.workouts, "merge", pendingImport);
  });
  importReplaceBtn.addEventListener("click", () => {
    if (pendingImport) applyImportedWorkouts(pendingImport.workouts, "replace", pendingImport);
  });
  importCancelBtn.addEventListener("click", () => {
    hideImportConfirm();
    setBackupStatus("Import cancelled.");
  });
}

savedWorkouts = loadWorkouts();
renderMuscleChips(muscleFilters, muscleFilter, setMuscleFilter);
renderMuscleChips(prMuscleFilters, prMuscleFilter, setPrMuscleFilter);
renderEquipmentChips();
renderRestPresets();
populateDropdown();
renderExerciseList();
renderSuggestions();
renderSavedWorkouts();
renderPersonalRecords();
bindEvents();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
