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
  exerciseStructure,
  structuresEqual,
  swapExerciseAt,
  updateSavedWorkoutRoutine,
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
  groupedWorkoutItems,
  togglePairWithNext,
  moveWorkoutBlock,
  swapSupersetPartners,
  dropWorkoutBlock,
  dropPlaceFromOffset,
  canPairWithNext,
  normalizeSupersetAdjacency,
  shouldStartRestTimer,
  restNotificationPayload,
  notificationPermissionAction,
  visibleLibraryItems,
  hideWorkoutFromLibrary,
  saveSuggestionTemplate,
  removeTemplate,
  normalizeWeightUnit,
  unitLabel,
  displayWeightFromLb,
  convertLiveExerciseWeights,
  suggestProgression,
  formatProgressionHint,
  weeklyVolumeRows,
  remainingSeconds,
  restEndClockLabel,
  restStartNotificationPayload,
} from "./logic.js";
import { getExerciseGuide } from "./guides.js";

const buildPhase = document.getElementById("build-phase");
const trackPhase = document.getElementById("track-phase");
const summaryPhase = document.getElementById("summary-phase");
const guidePhase = document.getElementById("guide-phase");
const guideBackBtn = document.getElementById("guide-back-btn");
const guideMeta = document.getElementById("guide-meta");
const guideTitle = document.getElementById("guide-title");
const guideSummary = document.getElementById("guide-summary");
const guideSteps = document.getElementById("guide-steps");
const guideMistakes = document.getElementById("guide-mistakes");
const phaseLabel = document.getElementById("phase-label");
const exerciseSelect = document.getElementById("exercise-select");
const addExerciseBtn = document.getElementById("add-exercise-btn");
const exerciseList = document.getElementById("exercise-list");
const startWorkoutBtn = document.getElementById("start-workout-btn");
const setsContainer = document.getElementById("sets-container");
const finishWorkoutBtn = document.getElementById("finish-workout-btn");
const trackAddExerciseBtn = document.getElementById("track-add-exercise-btn");
const swapModal = document.getElementById("swap-modal");
const swapTitle = document.getElementById("swap-title");
const swapHelp = document.getElementById("swap-help");
const swapMuscleFilters = document.getElementById("swap-muscle-filters");
const swapSelect = document.getElementById("swap-select");
const swapConfirmBtn = document.getElementById("swap-confirm-btn");
const swapCancelBtn = document.getElementById("swap-cancel-btn");
const updateRoutinePrompt = document.getElementById("update-routine-prompt");
const updateRoutineText = document.getElementById("update-routine-text");
const updateRoutineYes = document.getElementById("update-routine-yes");
const updateRoutineNo = document.getElementById("update-routine-no");
const updateRoutineStatus = document.getElementById("update-routine-status");
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
const unitPresets = document.getElementById("unit-presets");
const timerRestPresets = document.getElementById("timer-rest-presets");
const timerEndHint = document.getElementById("timer-end-hint");
const notifyRestToggle = document.getElementById("notify-rest-toggle");
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
let notifyRest = true;
let weightUnit = "lb";
let restEndsAt = null;
let restNotifyContext = null;
let restDoneNotified = false;
let wakeLock = null;
let sourceLibrary = null;
let swapIndex = null;
let swapMuscleFilter = null;
let pickerMode = "swap";
let guideReturnPhase = "build";

function loadWorkouts() {
  try {
    const state = parseStoredState(localStorage.getItem(STORAGE_KEY));
    hiddenIds = state.hiddenIds || [];
    templates = state.templates || [];
    const settings = state.settings || defaultSettings();
    restSeconds = settings.restSeconds;
    equipmentIds = settings.equipmentIds;
    notifyRest = settings.notifyRest !== false;
    weightUnit = normalizeWeightUnit(settings.weightUnit);
    return state.workouts;
  } catch {
    hiddenIds = [];
    templates = [];
    restSeconds = DEFAULT_REST_SECONDS;
    equipmentIds = defaultEquipmentIds();
    notifyRest = true;
    weightUnit = "lb";
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
        settings: { restSeconds, equipmentIds, notifyRest, weightUnit },
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
      notifyRest = extra.settings.notifyRest !== false;
      weightUnit = normalizeWeightUnit(extra.settings.weightUnit);
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
  renderUnitPresets();
  renderNotifyToggle();
  renderSuggestions();
  renderWeeklyVolume();
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
    settings: { restSeconds, equipmentIds, notifyRest },
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

function renderNotifyToggle() {
  if (!notifyRestToggle) return;
  notifyRestToggle.checked = notifyRest;
}

async function setNotifyRest(enabled) {
  notifyRest = !!enabled;
  persistWorkouts();
  renderNotifyToggle();
  if (notifyRest) await ensureNotificationPermission();
}

async function ensureNotificationPermission() {
  if (!notifyRest || !("Notification" in window)) return;
  const action = notificationPermissionAction(Notification.permission, notifyRest);
  if (action !== "request") return;
  try {
    await Notification.requestPermission();
  } catch {
    // Safari can throw if this is not tied to a gesture.
  }
  renderNotifyToggle();
}

async function holdWakeLock() {
  if (!navigator.wakeLock || document.visibilityState !== "visible") return;
  try {
    wakeLock = await navigator.wakeLock.request("screen");
    wakeLock.addEventListener?.("release", () => {
      if (wakeLock) wakeLock = null;
    });
  } catch {
    wakeLock = null;
  }
}

function releaseWakeLock() {
  try {
    wakeLock?.release?.();
  } catch {
    // Ignore.
  }
  wakeLock = null;
}

function loadText(weight, reps) {
  return formatLoad(weight, reps, weightUnit);
}

function setLine(set) {
  const load = loadText(set.weight, set.reps);
  return set.rpe != null ? `Set ${set.set}: ${load} @ RPE ${set.rpe}` : `Set ${set.set}: ${load}`;
}

function restNotificationOptions(payload, extra = {}) {
  const silent = extra.silent ?? payload.silent ?? false;
  return {
    body: payload.body,
    icon: "./icons/icon-192.png",
    badge: "./icons/icon-192.png",
    tag: "rest-timer",
    renotify: extra.renotify ?? !silent,
    silent,
    vibrate: silent ? [] : [180, 80, 180],
    data: { url: "./" },
  };
}

async function showRestNotification(payload, extra = {}) {
  if (!notifyRest || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  const options = restNotificationOptions(payload, extra);
  try {
    const reg = await navigator.serviceWorker?.ready;
    if (reg?.showNotification) {
      await reg.showNotification(payload.title, options);
      return;
    }
    if (reg?.active) {
      reg.active.postMessage({
        type: extra.silent || payload.silent ? "REST_START" : "REST_DONE",
        title: payload.title,
        body: payload.body,
        silent: !!(extra.silent || payload.silent),
      });
      return;
    }
  } catch {
    // Fall through to the page Notification API.
  }
  try {
    new Notification(payload.title, options);
  } catch {
    // iOS Safari only allows notifications from an installed PWA.
  }
}

async function closeRestNotification() {
  try {
    const reg = await navigator.serviceWorker?.ready;
    const notes = await reg?.getNotifications?.({ tag: "rest-timer" });
    notes?.forEach((note) => note.close());
  } catch {
    // Ignore.
  }
}

function fireRestNotification() {
  if (!notifyRest || restDoneNotified) return;
  restDoneNotified = true;
  try {
    navigator.vibrate?.([180, 80, 180]);
  } catch {
    // Vibration is Android-only.
  }
  const payload = restNotifyContext
    ? restNotificationPayload(
        selectedExercises,
        restNotifyContext.exerciseIndex,
        restNotifyContext.setIndex
      )
    : { title: "Rest over", body: "Time for your next set." };
  showRestNotification(payload, { silent: false, renotify: true });
}

function showRestStartNotification(endsAt) {
  if (!notifyRest) return;
  showRestNotification(restStartNotificationPayload(endsAt), { silent: true, renotify: false });
}

function updateTimerEndHint(endsAt) {
  if (!timerEndHint) return;
  if (!endsAt) {
    timerEndHint.textContent = "";
    return;
  }
  const clock = restEndClockLabel(endsAt);
  timerEndHint.textContent = clock ? `Up at ${clock}` : "";
}

function maybeStartRest(exerciseIndex, setIndex, justCompleted) {
  if (!justCompleted) return;
  if (!shouldStartRestTimer(selectedExercises, exerciseIndex, setIndex)) return;
  restNotifyContext = { exerciseIndex, setIndex };
  startRestTimer(restSeconds);
}

function tickRestTimer() {
  const left = remainingSeconds(restEndsAt);
  timerSecondsLeft = left;
  timerDisplay.textContent = formatTime(left);
  if (left <= 0) {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    restEndsAt = null;
    restTimerBar.classList.add("finished");
    updateTimerEndHint(null);
    releaseWakeLock();
    fireRestNotification();
    return true;
  }
  return false;
}

function startRestTimer(duration = restSeconds) {
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  const seconds = Math.max(0, duration);
  restEndsAt = Date.now() + seconds * 1000;
  restDoneNotified = false;
  timerSecondsLeft = seconds;
  timerDisplay.textContent = formatTime(seconds);
  restTimerBar.classList.remove("hidden");
  restTimerBar.classList.remove("finished");
  updateTimerEndHint(restEndsAt);
  renderTimerRestPresets();
  holdWakeLock();
  showRestStartNotification(restEndsAt);

  if (tickRestTimer()) return;

  timerInterval = setInterval(tickRestTimer, 1000);
}

function catchUpRestTimer() {
  if (restTimerBar.classList.contains("hidden") || !restEndsAt) return;
  if (tickRestTimer()) return;
  holdWakeLock();
}

function nudgeTimer(delta) {
  const current = restTimerBar.classList.contains("hidden")
    ? restSeconds
    : remainingSeconds(restEndsAt || Date.now() + timerSecondsLeft * 1000);
  startRestTimer(adjustTimerSeconds(current, delta));
}

function stopRestTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  restEndsAt = null;
  restDoneNotified = false;
  restTimerBar.classList.add("hidden");
  restTimerBar.classList.remove("finished");
  updateTimerEndHint(null);
  releaseWakeLock();
  closeRestNotification();
}

function fillExerciseSelect(selectEl, { muscleId = null, excludeNames = [] } = {}) {
  const previousValue = selectEl.value;
  selectEl.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = muscleId
    ? `Choose a ${(getMuscleLabel(muscleId) || "muscle").toLowerCase()} exercise…`
    : "Choose an exercise…";
  selectEl.appendChild(placeholder);

  const excluded = new Set(excludeNames);
  const filtered = filterCatalog(EXERCISES, muscleId, equipmentIds).filter((ex) => !excluded.has(ex.name));

  if (muscleId) {
    filtered
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((ex) => {
        const option = document.createElement("option");
        option.value = ex.name;
        option.textContent = ex.name;
        selectEl.appendChild(option);
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
      selectEl.appendChild(optgroup);
    });
  }

  if ([...selectEl.options].some((opt) => opt.value === previousValue)) {
    selectEl.value = previousValue;
  }

  return filtered.length;
}

function populateDropdown() {
  fillExerciseSelect(exerciseSelect, { muscleId: muscleFilter });
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

function renderUnitPresets() {
  if (!unitPresets) return;
  unitPresets.innerHTML = "";
  [
    { id: "lb", label: "lb" },
    { id: "kg", label: "kg" },
  ].forEach((unit) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "rest-chip" + (weightUnit === unit.id ? " active" : "");
    btn.textContent = unit.label;
    btn.setAttribute("aria-pressed", weightUnit === unit.id ? "true" : "false");
    btn.addEventListener("click", () => setWeightUnit(unit.id));
    unitPresets.appendChild(btn);
  });
}

function setWeightUnit(next) {
  const unit = normalizeWeightUnit(next);
  if (unit === weightUnit) return;
  selectedExercises = convertLiveExerciseWeights(selectedExercises, weightUnit, unit);
  weightUnit = unit;
  persistWorkouts();
  renderUnitPresets();
  renderPersonalRecords();
  if (!trackPhase.classList.contains("hidden")) renderSetsForm();
  if (!summaryPhase.classList.contains("hidden")) {
    renderSummary(collectWorkoutData(selectedExercises, weightUnit));
  }
}

function applySuggestion(suggestion) {
  sourceLibrary = null;
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
      ? "No sessions in the last week — pick a hypertrophy split with antagonist supersets. Equipment filters apply."
      : "Built from recent volume and 48-hour recovery, using only the equipment you have. Supersets are on by default.";

  suggestions.forEach((suggestion) => {
    const card = document.createElement("div");
    card.className = "suggestion-card";
    const title = document.createElement("h3");
    title.textContent = suggestion.name;
    const reason = document.createElement("p");
    reason.className = "suggestion-reason";
    reason.textContent = suggestion.reason;
    const summary = document.createElement("div");
    summary.className = "suggestion-summary";
    groupedWorkoutItems(suggestion.exercises).forEach((group, i) => {
      if (i) summary.append(" · ");
      if (group.kind === "superset") {
        summary.appendChild(exerciseNameButton(group.exercises[0].name, { className: "exercise-link-inline" }));
        summary.append(" + ");
        summary.appendChild(exerciseNameButton(group.exercises[1].name, { className: "exercise-link-inline" }));
      } else {
        summary.appendChild(exerciseNameButton(group.exercises[0].name, { className: "exercise-link-inline" }));
      }
    });
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

function muscleCaption(name) {
  const muscleId = getMuscleForExercise(name);
  return muscleId ? getMuscleLabel(muscleId) : "";
}

function currentPhase() {
  if (guidePhase && !guidePhase.classList.contains("hidden")) return "guide";
  if (!trackPhase.classList.contains("hidden")) return "track";
  if (!summaryPhase.classList.contains("hidden")) return "summary";
  return "build";
}

function exerciseNameButton(name, { heading = false, className = "" } = {}) {
  const guide = getExerciseGuide(name);
  const el = document.createElement(guide ? "button" : "span");
  el.className = ["exercise-link", heading ? "exercise-link-heading" : "", className].filter(Boolean).join(" ");
  if (guide) {
    el.type = "button";
    el.setAttribute("aria-label", `${name}, form guide`);
    el.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openExerciseGuide(name);
    });
  }
  const text = document.createElement("span");
  text.textContent = name;
  el.appendChild(text);
  if (guide) {
    const icon = document.createElement("span");
    icon.className = "info-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "i";
    el.appendChild(icon);
  }
  return el;
}

function openExerciseGuide(name) {
  const guide = getExerciseGuide(name);
  if (!guide || !guidePhase) return;
  const from = currentPhase();
  if (from !== "guide") guideReturnPhase = from;
  const muscleId = getMuscleForExercise(name);
  const catalog = EXERCISES.find((ex) => ex.name === name);
  const gear = (catalog?.equipment || [])
    .map((id) => EQUIPMENT.find((item) => item.id === id)?.label || id)
    .join(", ");
  guideTitle.textContent = name;
  guideMeta.textContent = [getMuscleLabel(muscleId), gear].filter(Boolean).join(" · ");
  guideSummary.textContent = guide.summary;
  guideSteps.innerHTML = "";
  guide.steps.forEach((step) => {
    const li = document.createElement("li");
    li.textContent = step;
    guideSteps.appendChild(li);
  });
  guideMistakes.innerHTML = "";
  guide.mistakes.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    guideMistakes.appendChild(li);
  });
  showPhase("guide");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeExerciseGuide() {
  showPhase(guideReturnPhase || "build");
}

function builderNameEl(index) {
  const item = selectedExercises[index];
  const left = document.createElement("span");
  left.className = "name";
  const muscleName = muscleCaption(item.name);
  const indexEl = document.createElement("span");
  indexEl.className = "index";
  indexEl.textContent = `${index + 1}.`;
  left.appendChild(indexEl);
  left.appendChild(exerciseNameButton(item.name));
  if (muscleName) {
    const muscle = document.createElement("span");
    muscle.className = "muscle";
    muscle.textContent = muscleName;
    left.appendChild(muscle);
  }
  return left;
}

function tinyButton(label, { ariaLabel, active = false, disabled = false, onClick } = {}) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn-tiny" + (active ? " active" : "");
  btn.textContent = label;
  if (ariaLabel) btn.setAttribute("aria-label", ariaLabel);
  btn.disabled = !!disabled;
  if (onClick) btn.addEventListener("click", onClick);
  return btn;
}

function refreshWorkoutStructure() {
  if (!trackPhase.classList.contains("hidden")) {
    renderSetsForm();
  } else {
    renderExerciseList();
  }
}

function applyBlockChange(next) {
  if (restNotifyContext) {
    const name = selectedExercises[restNotifyContext.exerciseIndex]?.name;
    const idx = name ? next.findIndex((ex) => ex.name === name) : -1;
    if (idx >= 0) restNotifyContext = { ...restNotifyContext, exerciseIndex: idx };
  }
  selectedExercises = next;
  refreshWorkoutStructure();
}

function appendBlockMoveButtons(actions, groupIndex, groupCount, label) {
  actions.appendChild(
    tinyButton("↑", {
      ariaLabel: `Move ${label} up`,
      disabled: groupIndex === 0,
      onClick: () => applyBlockChange(moveWorkoutBlock(selectedExercises, groupIndex, -1)),
    })
  );
  actions.appendChild(
    tinyButton("↓", {
      ariaLabel: `Move ${label} down`,
      disabled: groupIndex === groupCount - 1,
      onClick: () => applyBlockChange(moveWorkoutBlock(selectedExercises, groupIndex, 1)),
    })
  );
}

function appendPairActions(actions, group) {
  const label = `${group.exercises[0].name} + ${group.exercises[1].name}`;
  actions.appendChild(
    tinyButton("Swap order", {
      ariaLabel: `Swap order of ${label}`,
      onClick: () => applyBlockChange(swapSupersetPartners(selectedExercises, group.indices[0])),
    })
  );
  actions.appendChild(
    tinyButton("Unpair", {
      active: true,
      onClick: () => applyBlockChange(togglePairWithNext(selectedExercises, group.indices[0])),
    })
  );
}

function createDragHandle(groupIndex) {
  const handle = document.createElement("button");
  handle.type = "button";
  handle.className = "drag-handle";
  handle.textContent = "⋮⋮";
  handle.setAttribute("aria-label", "Drag to reorder");
  bindBlockDrag(handle, groupIndex);
  return handle;
}

let dragState = null;

function clearDropHints() {
  document.querySelectorAll("[data-block-index]").forEach((el) => {
    el.classList.remove("drop-before", "drop-after", "is-dragging");
  });
}

function endBlockDrag() {
  if (!dragState) return;
  const { handle, pointerId, from, over, place, moved } = dragState;
  try {
    if (handle?.hasPointerCapture?.(pointerId)) handle.releasePointerCapture(pointerId);
  } catch {
    // Capture may already be released.
  }
  document.body.classList.remove("is-block-dragging");
  clearDropHints();
  dragState = null;
  if (!moved || over == null) return;
  applyBlockChange(dropWorkoutBlock(selectedExercises, from, over, place));
}

function bindBlockDrag(handle, groupIndex) {
  handle.addEventListener("pointerdown", (event) => {
    if (event.button != null && event.button !== 0) return;
    event.preventDefault();
    handle.setPointerCapture(event.pointerId);
    dragState = {
      from: groupIndex,
      over: groupIndex,
      place: "before",
      startY: event.clientY,
      moved: false,
      pointerId: event.pointerId,
      handle,
    };
  });
  handle.addEventListener("pointermove", (event) => {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    if (!dragState.moved && Math.abs(event.clientY - dragState.startY) < 8) return;
    dragState.moved = true;
    document.body.classList.add("is-block-dragging");
    const source = document.querySelector(`[data-block-index="${dragState.from}"]`);
    source?.classList.add("is-dragging");
    const under = document.elementFromPoint(event.clientX, event.clientY);
    const block = under?.closest?.("[data-block-index]");
    if (!block) return;
    const over = Number(block.dataset.blockIndex);
    const rect = block.getBoundingClientRect();
    const place = dropPlaceFromOffset(event.clientY - rect.top, rect.height);
    dragState.over = over;
    dragState.place = place;
    clearDropHints();
    source?.classList.add("is-dragging");
    if (over !== dragState.from) {
      block.classList.add(place === "before" ? "drop-before" : "drop-after");
    }
  });
  handle.addEventListener("pointerup", (event) => {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    endBlockDrag();
  });
  handle.addEventListener("pointercancel", (event) => {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    dragState.moved = false;
    endBlockDrag();
  });
}

function appendBlockToolbar(container, group, groupIndex, groupCount) {
  const toolbar = document.createElement("div");
  toolbar.className = "block-toolbar";
  if (groupCount > 1) toolbar.appendChild(createDragHandle(groupIndex));
  const actions = document.createElement("div");
  actions.className = "builder-actions";
  const label =
    group.kind === "superset"
      ? `${group.exercises[0].name} + ${group.exercises[1].name}`
      : group.exercises[0].name;
  appendBlockMoveButtons(actions, groupIndex, groupCount, label);
  if (group.kind === "superset") {
    appendPairActions(actions, group);
  } else if (canPairWithNext(selectedExercises, group.indices[0])) {
    actions.appendChild(
      tinyButton("Superset with next", {
        onClick: () => applyBlockChange(togglePairWithNext(selectedExercises, group.indices[0])),
      })
    );
  }
  toolbar.appendChild(actions);
  container.appendChild(toolbar);
}

function renderBuilderSingle(index, group, groupIndex, groupCount) {
  const wrap = document.createElement("div");
  wrap.className = "builder-exercise-row";
  wrap.appendChild(builderNameEl(index));
  appendBlockToolbar(wrap, group, groupIndex, groupCount);

  const actions = wrap.querySelector(".builder-actions");
  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "btn btn-danger";
  removeBtn.textContent = "Remove";
  removeBtn.addEventListener("click", () => removeExercise(index));
  actions.appendChild(removeBtn);
  return wrap;
}

function renderBuilderPair(group, groupIndex, groupCount) {
  const wrap = document.createElement("div");
  wrap.className = "builder-superset";
  const header = document.createElement("div");
  header.className = "builder-block-header";
  const badge = document.createElement("div");
  badge.className = "superset-badge";
  badge.textContent = "Superset";
  header.appendChild(badge);
  appendBlockToolbar(header, group, groupIndex, groupCount);
  wrap.appendChild(header);

  group.indices.forEach((index) => {
    const row = document.createElement("div");
    row.className = "builder-exercise-row";
    row.appendChild(builderNameEl(index));
    const rowActions = document.createElement("div");
    rowActions.className = "builder-actions";
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "btn btn-danger";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => removeExercise(index));
    rowActions.appendChild(removeBtn);
    row.appendChild(rowActions);
    wrap.appendChild(row);
  });

  return wrap;
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

  const groups = groupedWorkoutItems(selectedExercises);
  groups.forEach((group, groupIndex) => {
    const li = document.createElement("li");
    li.dataset.blockIndex = String(groupIndex);
    if (group.kind === "superset") {
      li.className = "exercise-list-item is-superset";
      li.appendChild(renderBuilderPair(group, groupIndex, groups.length));
    } else {
      li.className = "exercise-list-item";
      li.appendChild(renderBuilderSingle(group.indices[0], group, groupIndex, groups.length));
    }
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
  selectedExercises = normalizeSupersetAdjacency(selectedExercises);
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
  guidePhase?.classList.add("hidden");

  if (phase === "build") {
    buildPhase.classList.remove("hidden");
    phaseLabel.textContent = "Build your workout";
  } else if (phase === "track") {
    trackPhase.classList.remove("hidden");
    phaseLabel.textContent = "Log your sets";
  } else if (phase === "summary") {
    summaryPhase.classList.remove("hidden");
    phaseLabel.textContent = "Summary";
  } else if (phase === "guide") {
    guidePhase?.classList.remove("hidden");
    phaseLabel.textContent = "Exercise guide";
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
    const stats = summarizeExercises(workout.routine || workout.exercises);
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
    const name = exerciseNameButton(pr.name, { className: "pr-name" });

    const meta = document.createElement("div");
    meta.className = "pr-meta";
    const when = pr.date ? formatRelativeDate(pr.date) : "";
    meta.textContent = [pr.workoutName, when].filter(Boolean).join(" · ");

    left.appendChild(name);
    left.appendChild(meta);

    const load = document.createElement("div");
    load.className = "pr-load";
    load.textContent = loadText(pr.weight, pr.reps);

    li.appendChild(left);
    li.appendChild(load);
    prResults.appendChild(li);
  });
}

function useSavedWorkout(workout) {
  selectedExercises = workoutToExercises(workout, savedWorkouts);
  sourceLibrary = {
    kind: workout.kind === "template" ? "template" : "history",
    id: workout.id,
    name: displayWorkoutName(workout),
    structure: exerciseStructure(workout.routine || workout.exercises),
  };
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

function renderExerciseBlock(item, exerciseIndex, prs) {
  const block = document.createElement("div");
  block.className = "exercise-block";
  block.dataset.exerciseIndex = exerciseIndex;

  const header = document.createElement("div");
  header.className = "exercise-header";

  const titleWrap = document.createElement("div");
    const title = document.createElement("h3");
    title.appendChild(exerciseNameButton(item.name, { heading: true }));
    titleWrap.appendChild(title);

  const pr = prs[item.name];
  if (pr) {
    const prLine = document.createElement("div");
    prLine.className = "exercise-pr";
    prLine.textContent = `PR ${loadText(pr.weight, pr.reps)}`;
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

  const actions = document.createElement("div");
  actions.className = "exercise-header-actions";

  const swapBtn = document.createElement("button");
  swapBtn.type = "button";
  swapBtn.className = "btn-swap";
  swapBtn.textContent = "Swap";
  swapBtn.setAttribute("aria-label", `Swap ${item.name}`);
  swapBtn.addEventListener("click", () => openExercisePicker("swap", exerciseIndex));

  actions.appendChild(swapBtn);
  actions.appendChild(setControls);

  header.appendChild(titleWrap);
  header.appendChild(actions);
  block.appendChild(header);

  const noteInput = document.createElement("input");
  noteInput.type = "text";
  noteInput.className = "input exercise-note";
  noteInput.placeholder = "Note (optional)";
  noteInput.value = item.note || "";
  noteInput.autocomplete = "off";
  noteInput.setAttribute("aria-label", `${item.name} note`);
  noteInput.addEventListener("input", (e) => {
    selectedExercises[exerciseIndex].note = e.target.value;
  });
  block.appendChild(noteInput);

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
    weightInput.placeholder = unitLabel(weightUnit);
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

    const tryBtn = document.createElement("button");
    tryBtn.type = "button";
    tryBtn.className = "try-next";

    const refreshSetUi = () => {
      weightInput.className = inputClassFor(setData, "weight");
      repsInput.className = inputClassFor(setData, "reps");
      syncAutofillButton(autoBtn, setData, item.name, setNum);
      syncProgressionButton(tryBtn, setData);
    };

    weightInput.addEventListener("input", (e) => {
      const justCompleted = updateSetField(setData, "weight", e.target.value);
      refreshSetUi();
      maybeStartRest(exerciseIndex, setIdx, justCompleted);
    });

    repsInput.addEventListener("input", (e) => {
      const justCompleted = updateSetField(setData, "reps", e.target.value);
      refreshSetUi();
      maybeStartRest(exerciseIndex, setIdx, justCompleted);
    });

    autoBtn.addEventListener("click", () => {
      const justCompleted = applyPreviousSet(setData, weightUnit);
      weightInput.value = setData.weight;
      repsInput.value = setData.reps;
      refreshSetUi();
      maybeStartRest(exerciseIndex, setIdx, justCompleted);
    });

    tryBtn.addEventListener("click", () => {
      applyProgressionHint(exerciseIndex, setIdx);
    });
    syncProgressionButton(tryBtn, setData);

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
      ? `prev ${displayWeightFromLb(setData.previousWeight, weightUnit) || "—"}`
      : "";
    const prevReps = document.createElement("span");
    prevReps.className = hasPreviousSet(setData) ? "prev-hint" : "prev-hint empty";
    prevReps.textContent = hasPreviousSet(setData)
      ? `prev ${setData.previousReps ?? "—"}`
      : "";
    const rpeInput = document.createElement("input");
    rpeInput.type = "number";
    rpeInput.className = "input rpe-input";
    rpeInput.min = "1";
    rpeInput.max = "10";
    rpeInput.step = "0.5";
    rpeInput.inputMode = "decimal";
    rpeInput.placeholder = setData.previousRpe != null ? `RPE ${setData.previousRpe}` : "RPE";
    rpeInput.value = setData.rpe || "";
    rpeInput.setAttribute("aria-label", `${item.name} set ${setNum} RPE`);
    rpeInput.addEventListener("input", (e) => {
      updateSetField(setData, "rpe", e.target.value);
    });
    prevRow.appendChild(spacer);
    prevRow.appendChild(prevWeight);
    prevRow.appendChild(prevReps);
    prevRow.appendChild(rpeInput);

    group.appendChild(row);
    group.appendChild(prevRow);
    group.appendChild(tryBtn);
    block.appendChild(group);
  });

  return block;
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

  const note = document.createElement("p");
  note.className = "legend rest-superset-note";
  note.textContent = selectedExercises.some((ex) => ex.supersetId)
    ? "Rest starts after both sides of a superset finish that set. Reorder with ↑↓ or the ⋮⋮ handle; a pair moves as one block."
    : "Reorder with ↑↓ or the ⋮⋮ handle. Superset with next pairs two adjacent lifts.";
  setsContainer.appendChild(note);

  const prs = personalRecords();
  const groups = groupedWorkoutItems(selectedExercises);

  groups.forEach((group, groupIndex) => {
    const wrap = document.createElement("div");
    wrap.className = group.kind === "superset" ? "track-block track-superset" : "track-block";
    wrap.dataset.blockIndex = String(groupIndex);
    if (group.kind === "superset") {
      const label = document.createElement("div");
      label.className = "superset-badge";
      label.textContent = `Superset · ${group.exercises[0].name} + ${group.exercises[1].name}`;
      wrap.appendChild(label);
    }
    appendBlockToolbar(wrap, group, groupIndex, groups.length);
    group.indices.forEach((index) => {
      wrap.appendChild(renderExerciseBlock(selectedExercises[index], index, prs));
    });
    setsContainer.appendChild(wrap);
  });
}

function syncAutofillButton(btn, setData, exerciseName, setNum) {
  const available = hasPreviousSet(setData);
  btn.disabled = !available;
  btn.classList.toggle("applied", setData.source === "previous");
  const label = available
    ? `Use previous ${loadText(setData.previousWeight, setData.previousReps)} for ${exerciseName || "exercise"} set ${setNum || ""}`.trim()
    : "No previous set to copy";
  btn.setAttribute("aria-label", label);
}

function syncProgressionButton(btn, setData) {
  const empty = !setData.weight && !setData.reps;
  const suggestion = empty
    ? suggestProgression(setData.previousWeight, setData.previousReps, weightUnit)
    : null;
  const label = formatProgressionHint(suggestion, weightUnit);
  btn.hidden = !label;
  btn.textContent = label;
  btn.setAttribute("aria-label", label || "No progression suggestion");
}

function applyProgressionHint(exerciseIndex, setIndex) {
  const setData = selectedExercises[exerciseIndex]?.sets?.[setIndex];
  if (!setData) return;
  const suggestion = suggestProgression(setData.previousWeight, setData.previousReps, weightUnit);
  if (!suggestion) return;
  updateSetField(setData, "weight", displayWeightFromLb(suggestion.weightLb, weightUnit));
  const justCompleted = updateSetField(setData, "reps", String(suggestion.reps));
  maybeStartRest(exerciseIndex, setIndex, justCompleted);
  renderSetsForm();
}

function renderWeeklyVolume() {
  const rows = weeklyVolumeRows(savedWorkouts);
  document.querySelectorAll("[data-volume-list]").forEach((list) => {
    list.innerHTML = "";
    if (rows.length === 0) {
      const li = document.createElement("li");
      li.className = "empty-state";
      li.textContent = "No sets logged in the last 7 days.";
      list.appendChild(li);
      return;
    }
    rows.forEach((row) => {
      const li = document.createElement("li");
      li.className = "volume-row";
      const name = document.createElement("span");
      name.textContent = row.label;
      const sets = document.createElement("span");
      sets.className = "volume-sets";
      sets.textContent = `${row.sets} set${row.sets !== 1 ? "s" : ""}`;
      li.appendChild(name);
      li.appendChild(sets);
      list.appendChild(li);
    });
  });
}

function pickerExcludeNames() {
  return selectedExercises.map((ex) => ex.name);
}

function refreshPickerSelect() {
  const count = fillExerciseSelect(swapSelect, {
    muscleId: swapMuscleFilter,
    excludeNames: pickerExcludeNames(),
  });
  swapConfirmBtn.disabled = !swapSelect.value;
  if (count === 0) {
    swapHelp.textContent = "No other exercises match that filter. Try All or a different muscle.";
    return;
  }
  const current = swapIndex != null ? selectedExercises[swapIndex] : null;
  swapHelp.textContent = pickerMode === "add"
    ? "Added to the end of this session. Equipment filters still apply."
    : `Replace ${current?.name || "this exercise"}. Logged sets for it will be cleared.`;
}

function setSwapMuscleFilter(muscleId) {
  swapMuscleFilter = muscleId;
  renderMuscleChips(swapMuscleFilters, swapMuscleFilter, setSwapMuscleFilter);
  refreshPickerSelect();
}

function openExercisePicker(mode, index = null) {
  pickerMode = mode;
  swapIndex = index;
  const current = index != null ? selectedExercises[index] : null;
  swapMuscleFilter = current ? getMuscleForExercise(current.name) : null;
  swapTitle.textContent = mode === "add" ? "Add exercise" : "Swap exercise";
  swapConfirmBtn.textContent = mode === "add" ? "Add" : "Swap";
  swapHelp.textContent = mode === "add"
    ? "Added to the end of this session. Equipment filters still apply."
    : `Replace ${current?.name || "this exercise"}. Logged sets for it will be cleared.`;
  renderMuscleChips(swapMuscleFilters, swapMuscleFilter, setSwapMuscleFilter);
  refreshPickerSelect();
  swapModal.classList.remove("hidden");
  swapSelect.focus();
}

function closeExercisePicker() {
  swapModal.classList.add("hidden");
  swapIndex = null;
}

function confirmExercisePicker() {
  const name = swapSelect.value;
  if (!name) return;
  if (pickerMode === "add") {
    selectedExercises.push(createExercise(name, SETS_PER_EXERCISE, getPreviousSets(savedWorkouts, name)));
  } else if (swapIndex != null) {
    selectedExercises = swapExerciseAt(
      selectedExercises,
      swapIndex,
      name,
      getPreviousSets(savedWorkouts, name)
    );
  }
  closeExercisePicker();
  renderSetsForm();
}

function renderUpdatePrompt() {
  updateRoutineStatus.textContent = "";
  updateRoutineStatus.classList.remove("success");
  const changed = sourceLibrary && !structuresEqual(sourceLibrary.structure, exerciseStructure(selectedExercises));
  updateRoutinePrompt.classList.toggle("hidden", !changed);
  if (!changed) return;
  updateRoutineYes.disabled = false;
  updateRoutineNo.disabled = false;
  updateRoutineText.textContent =
    `You changed “${sourceLibrary.name}”. Update the saved workout for next time? Today's session and past PRs stay as logged.`;
}

function applyRoutineUpdateChoice(shouldUpdate) {
  if (!sourceLibrary) {
    updateRoutinePrompt.classList.add("hidden");
    return;
  }
  if (shouldUpdate) {
    const next = updateSavedWorkoutRoutine(templates, savedWorkouts, sourceLibrary, selectedExercises);
    templates = next.templates;
    savedWorkouts = next.workouts;
    persistWorkouts();
    renderSavedWorkouts();
    updateRoutineStatus.textContent = `Updated “${sourceLibrary.name}” for next time.`;
    updateRoutineStatus.classList.add("success");
  } else {
    updateRoutineStatus.textContent = "Kept the original saved workout.";
    updateRoutineStatus.classList.remove("success");
  }
  updateRoutineYes.disabled = true;
  updateRoutineNo.disabled = true;
  sourceLibrary = null;
}

function renderSummary(workoutData) {
  const totalSets = workoutData.reduce((sum, ex) => sum + ex.sets.length, 0);
  const loggedSets = workoutData.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.weight !== null || s.reps !== null).length,
    0
  );

  summaryMeta.textContent = `${workoutData.length} exercise${workoutData.length !== 1 ? "s" : ""} · ${loggedSets} of ${totalSets} sets logged`;

  summaryDetails.innerHTML = "";

  groupedWorkoutItems(workoutData).forEach((group) => {
    const wrap = document.createElement("div");
    wrap.className = group.kind === "superset" ? "summary-superset" : "";
    if (group.kind === "superset") {
      const badge = document.createElement("div");
      badge.className = "superset-badge";
      badge.textContent = "Superset";
      wrap.appendChild(badge);
    }
    group.exercises.forEach((exercise) => {
      const div = document.createElement("div");
      div.className = "summary-exercise";
      const heading = document.createElement("h4");
      heading.appendChild(exerciseNameButton(exercise.name, { heading: true }));
      div.appendChild(heading);
      if (exercise.note) {
        const note = document.createElement("p");
        note.className = "summary-note";
        note.textContent = exercise.note;
        div.appendChild(note);
      }
      exercise.sets.forEach((set) => {
        const p = document.createElement("p");
        p.className = "summary-set";
        p.textContent = setLine(set);
        div.appendChild(p);
      });
      wrap.appendChild(div);
    });
    summaryDetails.appendChild(wrap);
  });
}

function startWorkout() {
  if (selectedExercises.length === 0) return;
  selectedExercises = attachPreviousSets(selectedExercises, savedWorkouts);
  ensureNotificationPermission();
  renderSetsForm();
  showPhase("track");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function finishWorkout() {
  closeExercisePicker();
  stopRestTimer();
  const data = collectWorkoutData(selectedExercises, weightUnit);
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
  renderWeeklyVolume();
  showPhase("summary");
  renderUpdatePrompt();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetWorkout() {
  stopRestTimer();
  selectedExercises = [];
  savedWorkoutId = null;
  sourceLibrary = null;
  closeExercisePicker();
  workoutNameInput.value = "";
  summaryNameInput.value = "";
  updateRoutinePrompt.classList.add("hidden");
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
  guideBackBtn?.addEventListener("click", closeExerciseGuide);
  if (notifyRestToggle) {
    notifyRestToggle.addEventListener("change", () => {
      setNotifyRest(notifyRestToggle.checked);
    });
  }
  finishWorkoutBtn.addEventListener("click", finishWorkout);
  trackAddExerciseBtn.addEventListener("click", () => openExercisePicker("add"));
  swapConfirmBtn.addEventListener("click", confirmExercisePicker);
  swapCancelBtn.addEventListener("click", closeExercisePicker);
  swapSelect.addEventListener("change", () => {
    swapConfirmBtn.disabled = !swapSelect.value;
  });
  swapModal.addEventListener("click", (e) => {
    if (e.target === swapModal) closeExercisePicker();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && guidePhase && !guidePhase.classList.contains("hidden")) {
      closeExerciseGuide();
      return;
    }
    if (e.key === "Escape" && !swapModal.classList.contains("hidden")) {
      closeExercisePicker();
    }
  });
  updateRoutineYes.addEventListener("click", () => applyRoutineUpdateChoice(true));
  updateRoutineNo.addEventListener("click", () => applyRoutineUpdateChoice(false));
  newWorkoutBtn.addEventListener("click", resetWorkout);
  dismissTimerBtn.addEventListener("click", stopRestTimer);
  timerMinusBtn.addEventListener("click", () => nudgeTimer(-TIMER_ADJUST_SECONDS));
  timerPlusBtn.addEventListener("click", () => nudgeTimer(TIMER_ADJUST_SECONDS));
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") return;
    catchUpRestTimer();
  });
  window.addEventListener("focus", catchUpRestTimer);
  window.addEventListener("pageshow", catchUpRestTimer);

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
renderUnitPresets();
renderNotifyToggle();
populateDropdown();
renderExerciseList();
renderSuggestions();
renderSavedWorkouts();
renderPersonalRecords();
renderWeeklyVolume();
bindEvents();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
