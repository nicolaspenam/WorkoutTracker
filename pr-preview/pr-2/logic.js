/**
 * logic.js – pure functions shared between app.js and the test suite.
 * No DOM access here so these can be imported directly by Node.js tests.
 */

export const SETS_PER_EXERCISE = 3;
export const DEFAULT_REST_SECONDS = 90;
export const STORAGE_KEY = "workout-tracker-v1";

/**
 * Primary muscle groups used to prefilter the exercise list.
 * Compound lifts are tagged by the main target, not every muscle involved.
 */
export const MUSCLE_GROUPS = [
  { id: "chest", label: "Chest" },
  { id: "back", label: "Back" },
  { id: "shoulders", label: "Shoulders" },
  { id: "biceps", label: "Biceps" },
  { id: "triceps", label: "Triceps" },
  { id: "quads", label: "Quads" },
  { id: "hamstrings", label: "Hamstrings" },
  { id: "glutes", label: "Glutes" },
  { id: "calves", label: "Calves" },
  { id: "core", label: "Core" },
];

export const EXERCISES = [
  // Chest
  { name: "Bench Press", muscle: "chest" },
  { name: "Incline Bench Press", muscle: "chest" },
  { name: "Decline Bench Press", muscle: "chest" },
  { name: "Dumbbell Bench Press", muscle: "chest" },
  { name: "Incline Dumbbell Press", muscle: "chest" },
  { name: "Chest Press Machine", muscle: "chest" },
  { name: "Cable Fly", muscle: "chest" },
  { name: "Dumbbell Fly", muscle: "chest" },
  { name: "Pec Deck", muscle: "chest" },
  { name: "Push-ups", muscle: "chest" },
  { name: "Dips", muscle: "chest" },

  // Back
  { name: "Deadlift", muscle: "back" },
  { name: "Barbell Row", muscle: "back" },
  { name: "Dumbbell Row", muscle: "back" },
  { name: "Seated Cable Row", muscle: "back" },
  { name: "T-Bar Row", muscle: "back" },
  { name: "Chest-Supported Row", muscle: "back" },
  { name: "Pull-ups", muscle: "back" },
  { name: "Chin-ups", muscle: "back" },
  { name: "Lat Pulldown", muscle: "back" },
  { name: "Straight-Arm Pulldown", muscle: "back" },
  { name: "Inverted Row", muscle: "back" },
  { name: "Shrugs", muscle: "back" },

  // Shoulders
  { name: "Overhead Press", muscle: "shoulders" },
  { name: "Dumbbell Shoulder Press", muscle: "shoulders" },
  { name: "Arnold Press", muscle: "shoulders" },
  { name: "Lateral Raise", muscle: "shoulders" },
  { name: "Cable Lateral Raise", muscle: "shoulders" },
  { name: "Front Raise", muscle: "shoulders" },
  { name: "Rear Delt Fly", muscle: "shoulders" },
  { name: "Face Pulls", muscle: "shoulders" },
  { name: "Upright Row", muscle: "shoulders" },

  // Biceps
  { name: "Dumbbell Curl", muscle: "biceps" },
  { name: "Barbell Curl", muscle: "biceps" },
  { name: "Hammer Curl", muscle: "biceps" },
  { name: "Preacher Curl", muscle: "biceps" },
  { name: "Incline Dumbbell Curl", muscle: "biceps" },
  { name: "Cable Curl", muscle: "biceps" },
  { name: "Concentration Curl", muscle: "biceps" },

  // Triceps
  { name: "Tricep Pushdown", muscle: "triceps" },
  { name: "Rope Pushdown", muscle: "triceps" },
  { name: "Skull Crushers", muscle: "triceps" },
  { name: "Overhead Tricep Extension", muscle: "triceps" },
  { name: "Close-Grip Bench Press", muscle: "triceps" },
  { name: "Tricep Dips", muscle: "triceps" },
  { name: "Kickbacks", muscle: "triceps" },

  // Quads
  { name: "Squat", muscle: "quads" },
  { name: "Front Squat", muscle: "quads" },
  { name: "Goblet Squat", muscle: "quads" },
  { name: "Hack Squat", muscle: "quads" },
  { name: "Leg Press", muscle: "quads" },
  { name: "Bulgarian Split Squat", muscle: "quads" },
  { name: "Walking Lunge", muscle: "quads" },
  { name: "Leg Extension", muscle: "quads" },
  { name: "Step-up", muscle: "quads" },

  // Hamstrings
  { name: "Romanian Deadlift", muscle: "hamstrings" },
  { name: "Stiff-Leg Deadlift", muscle: "hamstrings" },
  { name: "Lying Leg Curl", muscle: "hamstrings" },
  { name: "Seated Leg Curl", muscle: "hamstrings" },
  { name: "Nordic Curl", muscle: "hamstrings" },
  { name: "Good Morning", muscle: "hamstrings" },

  // Glutes
  { name: "Hip Thrust", muscle: "glutes" },
  { name: "Glute Bridge", muscle: "glutes" },
  { name: "Sumo Deadlift", muscle: "glutes" },
  { name: "Cable Kickback", muscle: "glutes" },
  { name: "Hip Abduction", muscle: "glutes" },
  { name: "Reverse Lunge", muscle: "glutes" },

  // Calves
  { name: "Standing Calf Raise", muscle: "calves" },
  { name: "Seated Calf Raise", muscle: "calves" },
  { name: "Donkey Calf Raise", muscle: "calves" },

  // Core
  { name: "Plank", muscle: "core" },
  { name: "Side Plank", muscle: "core" },
  { name: "Hanging Leg Raise", muscle: "core" },
  { name: "Cable Crunch", muscle: "core" },
  { name: "Ab Wheel", muscle: "core" },
  { name: "Russian Twist", muscle: "core" },
  { name: "Pallof Press", muscle: "core" },
  { name: "Dead Bug", muscle: "core" },
];

/**
 * @param {Array<{ name: string, muscle: string }>} [exercises]
 * @param {string|null} [muscleId]
 */
export function filterExercisesByMuscle(exercises = EXERCISES, muscleId = null) {
  if (!muscleId) return [...exercises];
  return exercises.filter((ex) => ex.muscle === muscleId);
}

/**
 * Group exercises in MUSCLE_GROUPS order for optgroup dropdowns.
 * @param {Array<{ name: string, muscle: string }>} [exercises]
 */
export function groupExercisesByMuscle(exercises = EXERCISES) {
  return MUSCLE_GROUPS.map((group) => ({
    id: group.id,
    label: group.label,
    exercises: exercises
      .filter((ex) => ex.muscle === group.id)
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((group) => group.exercises.length > 0);
}

export function getMuscleForExercise(name, exercises = EXERCISES) {
  return exercises.find((ex) => ex.name === name)?.muscle ?? null;
}

export function getMuscleLabel(muscleId) {
  return MUSCLE_GROUPS.find((group) => group.id === muscleId)?.label ?? null;
}

/**
 * Keep PR rows whose catalog exercise matches the selected muscle.
 * Unknown names (not in the catalog) only appear when no muscle is selected.
 */
export function filterRecordsByMuscle(records, muscleId, exercises = EXERCISES) {
  if (!muscleId) return [...(records || [])];
  const names = new Set(
    exercises.filter((ex) => ex.muscle === muscleId).map((ex) => ex.name)
  );
  return (records || []).filter((record) => names.has(record.name));
}

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

export const EXPORT_APP_ID = "workout-tracker";
export const EXPORT_FORMAT_VERSION = 1;

/**
 * Normalize a loosely-shaped workout from storage or a backup file.
 * @returns {object|null}
 */
export function normalizeWorkout(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  if (!Array.isArray(raw.exercises)) return null;
  return {
    id: typeof raw.id === "string" && raw.id.trim() ? raw.id.trim() : createId(),
    name: typeof raw.name === "string" && raw.name.trim() ? raw.name.trim() : null,
    completedAt: typeof raw.completedAt === "string" ? raw.completedAt : null,
    exercises: raw.exercises,
  };
}

/**
 * @param {Date} [date]
 */
export function exportFilename(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `workout-tracker-${y}-${m}-${d}.json`;
}

export function buildExportPayload(workouts, exportedAt = new Date().toISOString()) {
  return {
    app: EXPORT_APP_ID,
    version: EXPORT_FORMAT_VERSION,
    exportedAt,
    workouts: (workouts || []).map(normalizeWorkout).filter(Boolean),
  };
}

/**
 * Accepts our backup file, the raw localStorage blob, or a bare workouts array.
 * @param {string|object} raw
 * @returns {{ ok: true, workouts: object[], exportedAt: string|null } | { ok: false, error: string }}
 */
export function parseImportPayload(raw) {
  let data;
  try {
    data = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return { ok: false, error: "Could not read that file. Use a JSON backup from this app." };
  }

  let list;
  if (Array.isArray(data)) {
    list = data;
  } else if (data && Array.isArray(data.workouts)) {
    list = data.workouts;
  } else {
    return { ok: false, error: "That file does not look like a workout backup." };
  }

  const workouts = list.map(normalizeWorkout).filter(Boolean);
  if (list.length > 0 && workouts.length === 0) {
    return { ok: false, error: "No valid workouts found in that backup." };
  }

  return {
    ok: true,
    workouts,
    exportedAt: typeof data?.exportedAt === "string" ? data.exportedAt : null,
  };
}

/**
 * Combine two histories. Matching ids keep the existing session; new ids are added.
 * Result is newest-first by completedAt.
 */
export function mergeWorkouts(existing, incoming) {
  const byId = new Map();
  for (const workout of existing || []) {
    const normalized = normalizeWorkout(workout);
    if (normalized) byId.set(normalized.id, normalized);
  }

  let added = 0;
  let skipped = 0;
  for (const workout of incoming || []) {
    const normalized = normalizeWorkout(workout);
    if (!normalized) continue;
    if (byId.has(normalized.id)) {
      skipped += 1;
      continue;
    }
    byId.set(normalized.id, normalized);
    added += 1;
  }

  const merged = [...byId.values()].sort((a, b) => {
    return (Date.parse(b.completedAt || "") || 0) - (Date.parse(a.completedAt || "") || 0);
  });

  return { workouts: merged, added, skipped };
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
