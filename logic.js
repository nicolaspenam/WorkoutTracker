/**
 * logic.js – pure functions shared between app.js and the test suite.
 * No DOM access here so these can be imported directly by Node.js tests.
 */

export const SETS_PER_EXERCISE = 3;
export const DEFAULT_REST_SECONDS = 90;
export const STORAGE_KEY = "workout-tracker-v1";

export const EXERCISES = [
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

/**
 * Format a number of seconds as "m:ss".
 * @param {number} seconds
 * @returns {string}
 */
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

/**
 * Stable-enough unique id for saved workouts.
 * @returns {string}
 */
export function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * @param {{ weight?: number|null, reps?: number|null } | null | undefined} previous
 * @returns {{ weight: string, reps: string, completed: boolean, source: null|"previous"|"typed", previousWeight: number|null, previousReps: number|null }}
 */
export function createEmptySet(previous) {
  return {
    weight: "",
    reps: "",
    completed: false,
    source: null,
    weightSource: null,
    repsSource: null,
    previousWeight: previous?.weight ?? null,
    previousReps: previous?.reps ?? null,
  };
}

/**
 * @param {string} name
 * @param {number} [setCount]
 * @param {Array<{ weight: number|null, reps: number|null }> | null} [previousSets]
 */
export function createExercise(name, setCount = SETS_PER_EXERCISE, previousSets = null) {
  const count = Math.max(1, setCount);
  const sets = Array.from({ length: count }, (_, i) => createEmptySet(previousSets?.[i]));
  return { name, sets, previousSets: previousSets || null };
}

/**
 * A set counts as logged when weight or reps has a real value (including 0).
 * @param {{ weight?: unknown, reps?: unknown }} set
 */
export function isLoggedSet(set) {
  return isPresent(set?.weight) || isPresent(set?.reps);
}

function isPresent(value) {
  return value !== null && value !== undefined && value !== "";
}

/**
 * Mark a set as completed (or incomplete) based on whether both
 * weight and reps have been filled in.  Returns true when the set
 * transitions to completed (i.e. the rest timer should start).
 *
 * @param {{ weight: string, reps: string, completed: boolean }} setData
 * @returns {boolean} – true when the set was just completed
 */
export function handleSetCompletion(setData) {
  const isFilled = setData.weight !== "" && setData.reps !== "";

  if (isFilled && !setData.completed) {
    setData.completed = true;
    return true;
  } else if (!isFilled && setData.completed) {
    setData.completed = false;
  }
  return false;
}

/**
 * Convert the internal selectedExercises array into the serialisable
 * workout-data structure used for the summary screen and history.
 *
 * @param {Array<{ name: string, sets: Array<{ weight: string|number, reps: string|number }> }>} selectedExercises
 * @returns {Array<{ name: string, sets: Array<{ set: number, weight: number|null, reps: number|null }> }>}
 */
export function collectWorkoutData(selectedExercises) {
  return selectedExercises.map((item) => {
    const sets = item.sets.map((s, idx) => ({
      set: idx + 1,
      weight: isPresent(s.weight) ? Number(s.weight) : null,
      reps: isPresent(s.reps) ? Number(s.reps) : null,
    }));
    return { name: item.name, sets };
  });
}

/**
 * @param {Array<{ name: string, sets: Array<unknown> }>} exercises
 */
export function summarizeExercises(exercises) {
  const list = exercises || [];
  const exerciseCount = list.length;
  const setCount = list.reduce((n, ex) => n + (ex.sets?.length || 0), 0);
  const parts = list.map((ex) => {
    const n = ex.sets?.length || 0;
    return `${ex.name} · ${n} set${n !== 1 ? "s" : ""}`;
  });
  return {
    exerciseCount,
    setCount,
    parts,
    summary: parts.join(" · "),
  };
}

/**
 * Human-readable label for a saved workout.
 * @param {{ name?: string|null, completedAt?: string }} workout
 * @param {Date} [now]
 */
export function displayWorkoutName(workout, now = new Date()) {
  const name = typeof workout?.name === "string" ? workout.name.trim() : "";
  if (name) return name;
  return formatRelativeDate(workout?.completedAt, now);
}

/**
 * @param {string} [iso]
 * @param {Date} [now]
 */
export function formatRelativeDate(iso, now = new Date()) {
  if (!iso) return "Untitled workout";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Untitled workout";

  const startOfDay = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate());
  const diffDays = Math.round((startOfDay(now) - startOfDay(d)) / 86400000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays > 1 && diffDays < 7) {
    return d.toLocaleDateString(undefined, { weekday: "long" });
  }
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: d.getFullYear() === now.getFullYear() ? undefined : "numeric",
  });
}

/**
 * Full date for secondary lines (always includes calendar date).
 * @param {string} [iso]
 */
export function formatFullDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/**
 * Most recent logged performance of an exercise across saved workouts.
 * Workouts are expected newest-first.
 *
 * @param {Array<{ exercises: Array<{ name: string, sets: Array<{ weight: number|null, reps: number|null }> }> }>} workouts
 * @param {string} exerciseName
 * @returns {Array<{ weight: number|null, reps: number|null }> | null}
 */
export function getPreviousSets(workouts, exerciseName) {
  for (const workout of workouts || []) {
    const match = (workout.exercises || []).find((ex) => ex.name === exerciseName);
    if (!match) continue;
    if ((match.sets || []).some(isLoggedSet)) {
      return match.sets.map((s) => ({
        weight: isPresent(s.weight) ? Number(s.weight) : null,
        reps: isPresent(s.reps) ? Number(s.reps) : null,
      }));
    }
  }
  return null;
}

/**
 * Attach previous weight/reps onto each set without filling current values.
 * @param {Array<{ name: string, sets: Array<object>, previousSets?: unknown }>} exercises
 * @param {Array<object>} workouts
 */
export function attachPreviousSets(exercises, workouts) {
  return (exercises || []).map((ex) => {
    const previousSets = getPreviousSets(workouts, ex.name);
    const sets = (ex.sets || []).map((set, i) => ({
      ...set,
      previousWeight: previousSets?.[i]?.weight ?? null,
      previousReps: previousSets?.[i]?.reps ?? null,
    }));
    return { ...ex, sets, previousSets };
  });
}

/**
 * @param {{ previousWeight: number|null, previousReps: number|null }} setData
 */
export function hasPreviousSet(setData) {
  return isPresent(setData?.previousWeight) || isPresent(setData?.previousReps);
}

/**
 * Copy previous weight/reps into the live fields and mark source as "previous".
 * @returns {boolean} whether the set newly completed (start rest timer)
 */
function syncSetSource(setData) {
  const sources = [setData.weightSource, setData.repsSource].filter(Boolean);
  if (sources.length === 0) {
    setData.source = null;
  } else if (sources.every((s) => s === "previous")) {
    setData.source = "previous";
  } else {
    setData.source = "typed";
  }
}

/**
 * Copy previous weight/reps into the live fields and mark source as "previous".
 * @returns {boolean} whether the set newly completed (start rest timer)
 */
export function applyPreviousSet(setData) {
  if (!hasPreviousSet(setData)) return false;
  if (isPresent(setData.previousWeight)) {
    setData.weight = String(setData.previousWeight);
    setData.weightSource = "previous";
  } else {
    setData.weight = "";
    setData.weightSource = null;
  }
  if (isPresent(setData.previousReps)) {
    setData.reps = String(setData.previousReps);
    setData.repsSource = "previous";
  } else {
    setData.reps = "";
    setData.repsSource = null;
  }
  syncSetSource(setData);
  return handleSetCompletion(setData);
}

/**
 * User typed a value — mark that field as "typed" so styling differs from autofill.
 * @returns {boolean} whether the set newly completed
 */
export function updateSetField(setData, field, value) {
  setData[field] = value;
  const sourceField = field === "weight" ? "weightSource" : "repsSource";
  setData[sourceField] = value === "" ? null : "typed";
  syncSetSource(setData);
  return handleSetCompletion(setData);
}

/**
 * CSS-facing source for one input: empty | previous | typed
 */
export function fieldInputSource(setData, field) {
  const value = field === "weight" ? setData?.weight : setData?.reps;
  if (!isPresent(value)) return null;
  const source = field === "weight" ? setData.weightSource : setData.repsSource;
  return source === "previous" ? "previous" : "typed";
}

/**
 * CSS-facing source for a set (used when both fields share a style).
 */
export function setInputSource(setData) {
  if (!isPresent(setData?.weight) && !isPresent(setData?.reps)) return null;
  return setData.source === "previous" ? "previous" : "typed";
}

export function addSet(exercise) {
  const idx = exercise.sets.length;
  exercise.sets.push(createEmptySet(exercise.previousSets?.[idx]));
  return exercise;
}

export function removeSet(exercise) {
  if (exercise.sets.length > 1) {
    exercise.sets.pop();
  }
  return exercise;
}

/**
 * Build a fresh in-progress workout from a saved session (same exercises/set counts,
 * empty live values, previous numbers attached from history).
 */
export function workoutToExercises(savedWorkout, allWorkouts) {
  const exercises = (savedWorkout?.exercises || []).map((ex) =>
    createExercise(ex.name, Math.max(1, ex.sets?.length || SETS_PER_EXERCISE), null)
  );
  return attachPreviousSets(exercises, allWorkouts);
}

function numericOrZero(value) {
  if (!isPresent(value)) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Weight-first comparison; reps break ties. Returns true if `candidate` is a better PR.
 */
export function isBetterSet(candidate, currentBest) {
  if (!isLoggedSet(candidate)) return false;
  if (!currentBest || !isLoggedSet(currentBest)) return true;

  const candWeight = numericOrZero(candidate.weight);
  const bestWeight = numericOrZero(currentBest.weight);
  if (candWeight !== bestWeight) return candWeight > bestWeight;

  const candReps = numericOrZero(candidate.reps);
  const bestReps = numericOrZero(currentBest.reps);
  return candReps > bestReps;
}

/**
 * Recompute PRs from full workout history (newest-first is fine; first best wins
 * unless a later-processed set is strictly better — we iterate oldest-first so the
 * earliest date is kept on ties).
 *
 * @param {Array<{ name?: string|null, completedAt?: string, exercises: Array<{ name: string, sets: Array<{ weight: number|null, reps: number|null }> }> }>} workouts
 */
export function computePersonalRecords(workouts) {
  const prs = {};
  const chronological = [...(workouts || [])].sort((a, b) => {
    return new Date(a.completedAt || 0) - new Date(b.completedAt || 0);
  });

  for (const workout of chronological) {
    for (const ex of workout.exercises || []) {
      for (const set of ex.sets || []) {
        if (!isBetterSet(set, prs[ex.name])) continue;
        prs[ex.name] = {
          weight: isPresent(set.weight) ? Number(set.weight) : null,
          reps: isPresent(set.reps) ? Number(set.reps) : null,
          date: workout.completedAt || null,
          workoutName: workout.name || null,
        };
      }
    }
  }
  return prs;
}

/**
 * Filter/sort PRs for the lookup UI.
 * @param {Record<string, { weight: number|null, reps: number|null, date?: string|null, workoutName?: string|null }>} records
 * @param {string} [query]
 */
export function queryPersonalRecords(records, query = "") {
  const q = (query || "").trim().toLowerCase();
  const list = Object.entries(records || {}).map(([name, pr]) => ({
    name,
    weight: pr.weight,
    reps: pr.reps,
    date: pr.date || null,
    workoutName: pr.workoutName || null,
  }));
  const filtered = q
    ? list.filter((r) => r.name.toLowerCase().includes(q))
    : list;
  return filtered.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Format a weight × reps pair for display.
 */
export function formatLoad(weight, reps) {
  const w = isPresent(weight) ? `${weight} lbs` : "—";
  const r = isPresent(reps) ? `${reps} reps` : "—";
  return `${w} × ${r}`;
}

export function parseStoredState(raw) {
  if (!raw) return { workouts: [] };
  try {
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!data || !Array.isArray(data.workouts)) return { workouts: [] };
    return { workouts: data.workouts };
  } catch {
    return { workouts: [] };
  }
}

export function serializeState(workouts) {
  return JSON.stringify({ workouts: workouts || [] });
}

/**
 * Persist a completed session onto the history list (newest first).
 */
export function saveCompletedWorkout(workouts, { name, exercises, completedAt, id }) {
  const workout = {
    id: id || createId(),
    name: typeof name === "string" && name.trim() ? name.trim() : null,
    completedAt: completedAt || new Date().toISOString(),
    exercises,
  };
  return [workout, ...(workouts || [])];
}

export function renameWorkout(workouts, id, name) {
  return (workouts || []).map((w) =>
    w.id === id
      ? { ...w, name: typeof name === "string" && name.trim() ? name.trim() : null }
      : w
  );
}
