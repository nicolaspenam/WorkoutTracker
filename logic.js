/**
 * logic.js – pure functions shared between app.js and the test suite.
 * No DOM access here so these can be imported directly by Node.js tests.
 */

export const SETS_PER_EXERCISE = 3;
export const DEFAULT_REST_SECONDS = 90;
export const REST_PRESETS = [60, 90, 120];
export const STORAGE_KEY = "workout-tracker-v1";
export const LOOKBACK_DAYS = 7;
export const RECOVERY_HOURS = 48;
export const TIMER_ADJUST_SECONDS = 15;
export const TIMER_MAX_SECONDS = 600;
export const WEIGHT_UNITS = ["lb", "kg"];
export const LB_PER_KG = 2.2046226218;
export const TOP_REP_TARGET = 8;
export const PROGRESSION_LB = 5;
export const PROGRESSION_KG = 2.5;

export const EQUIPMENT = [
  { id: "barbell", label: "Barbell" },
  { id: "dumbbell", label: "Dumbbell" },
  { id: "machine", label: "Machine" },
  { id: "cable", label: "Cable" },
  { id: "bodyweight", label: "Bodyweight" },
];

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
  { name: "Bench Press", muscle: "chest", equipment: ["barbell"] },
  { name: "Incline Bench Press", muscle: "chest", equipment: ["barbell"] },
  { name: "Decline Bench Press", muscle: "chest", equipment: ["barbell"] },
  { name: "Dumbbell Bench Press", muscle: "chest", equipment: ["dumbbell"] },
  { name: "Incline Dumbbell Press", muscle: "chest", equipment: ["dumbbell"] },
  { name: "Chest Press Machine", muscle: "chest", equipment: ["machine"] },
  { name: "Cable Fly", muscle: "chest", equipment: ["cable"] },
  { name: "Dumbbell Fly", muscle: "chest", equipment: ["dumbbell"] },
  { name: "Pec Deck", muscle: "chest", equipment: ["machine"] },
  { name: "Cable Chest Press", muscle: "chest", equipment: ["cable"] },
  { name: "Push-ups", muscle: "chest", equipment: ["bodyweight"] },
  { name: "Dips", muscle: "chest", equipment: ["bodyweight"] },

  // Back
  { name: "Deadlift", muscle: "back", equipment: ["barbell"] },
  { name: "Barbell Row", muscle: "back", equipment: ["barbell"] },
  { name: "Dumbbell Row", muscle: "back", equipment: ["dumbbell"] },
  { name: "Seated Cable Row", muscle: "back", equipment: ["cable"] },
  { name: "T-Bar Row", muscle: "back", equipment: ["barbell"] },
  { name: "Chest-Supported Row", muscle: "back", equipment: ["dumbbell"] },
  { name: "Pull-ups", muscle: "back", equipment: ["bodyweight"] },
  { name: "Chin-ups", muscle: "back", equipment: ["bodyweight"] },
  { name: "Lat Pulldown", muscle: "back", equipment: ["cable"] },
  { name: "Straight-Arm Pulldown", muscle: "back", equipment: ["cable"] },
  { name: "Inverted Row", muscle: "back", equipment: ["bodyweight"] },
  { name: "Towel Row", muscle: "back", equipment: ["bodyweight"] },
  { name: "Superman", muscle: "back", equipment: ["bodyweight"] },
  { name: "Shrugs", muscle: "back", equipment: ["barbell", "dumbbell"] },
  { name: "Dumbbell Pullover", muscle: "back", equipment: ["dumbbell"] },
  { name: "Machine Row", muscle: "back", equipment: ["machine"] },
  { name: "Assisted Pull-up", muscle: "back", equipment: ["machine"] },

  // Shoulders
  { name: "Overhead Press", muscle: "shoulders", equipment: ["barbell"] },
  { name: "Dumbbell Shoulder Press", muscle: "shoulders", equipment: ["dumbbell"] },
  { name: "Arnold Press", muscle: "shoulders", equipment: ["dumbbell"] },
  { name: "Lateral Raise", muscle: "shoulders", equipment: ["dumbbell"] },
  { name: "Cable Lateral Raise", muscle: "shoulders", equipment: ["cable"] },
  { name: "Front Raise", muscle: "shoulders", equipment: ["dumbbell"] },
  { name: "Rear Delt Fly", muscle: "shoulders", equipment: ["dumbbell"] },
  { name: "Face Pulls", muscle: "shoulders", equipment: ["cable"] },
  { name: "Upright Row", muscle: "shoulders", equipment: ["barbell"] },
  { name: "Shoulder Press Machine", muscle: "shoulders", equipment: ["machine"] },
  { name: "Pike Push-ups", muscle: "shoulders", equipment: ["bodyweight"] },
  { name: "Cable Shoulder Press", muscle: "shoulders", equipment: ["cable"] },
  { name: "Machine Lateral Raise", muscle: "shoulders", equipment: ["machine"] },
  { name: "Prone Y Raise", muscle: "shoulders", equipment: ["bodyweight"] },

  // Biceps
  { name: "Dumbbell Curl", muscle: "biceps", equipment: ["dumbbell"] },
  { name: "Barbell Curl", muscle: "biceps", equipment: ["barbell"] },
  { name: "Hammer Curl", muscle: "biceps", equipment: ["dumbbell"] },
  { name: "Preacher Curl", muscle: "biceps", equipment: ["barbell"] },
  { name: "Incline Dumbbell Curl", muscle: "biceps", equipment: ["dumbbell"] },
  { name: "Cable Curl", muscle: "biceps", equipment: ["cable"] },
  { name: "Concentration Curl", muscle: "biceps", equipment: ["dumbbell"] },
  { name: "Machine Curl", muscle: "biceps", equipment: ["machine"] },
  { name: "Towel Curl", muscle: "biceps", equipment: ["bodyweight"] },

  // Triceps
  { name: "Tricep Pushdown", muscle: "triceps", equipment: ["cable"] },
  { name: "Rope Pushdown", muscle: "triceps", equipment: ["cable"] },
  { name: "Skull Crushers", muscle: "triceps", equipment: ["barbell"] },
  { name: "Overhead Tricep Extension", muscle: "triceps", equipment: ["dumbbell"] },
  { name: "Close-Grip Bench Press", muscle: "triceps", equipment: ["barbell"] },
  { name: "Tricep Dips", muscle: "triceps", equipment: ["bodyweight"] },
  { name: "Kickbacks", muscle: "triceps", equipment: ["dumbbell"] },
  { name: "Diamond Push-ups", muscle: "triceps", equipment: ["bodyweight"] },
  { name: "Machine Tricep Extension", muscle: "triceps", equipment: ["machine"] },

  // Quads
  { name: "Squat", muscle: "quads", equipment: ["barbell"] },
  { name: "Front Squat", muscle: "quads", equipment: ["barbell"] },
  { name: "Goblet Squat", muscle: "quads", equipment: ["dumbbell"] },
  { name: "Hack Squat", muscle: "quads", equipment: ["machine"] },
  { name: "Leg Press", muscle: "quads", equipment: ["machine"] },
  { name: "Bulgarian Split Squat", muscle: "quads", equipment: ["dumbbell", "bodyweight", "barbell"] },
  { name: "Walking Lunge", muscle: "quads", equipment: ["dumbbell", "bodyweight", "barbell"] },
  { name: "Leg Extension", muscle: "quads", equipment: ["machine"] },
  { name: "Step-up", muscle: "quads", equipment: ["dumbbell", "bodyweight", "barbell"] },
  { name: "Sissy Squat", muscle: "quads", equipment: ["bodyweight"] },
  { name: "Cable Squat", muscle: "quads", equipment: ["cable"] },
  { name: "Cable Lunge", muscle: "quads", equipment: ["cable"] },

  // Hamstrings
  { name: "Romanian Deadlift", muscle: "hamstrings", equipment: ["barbell"] },
  { name: "Stiff-Leg Deadlift", muscle: "hamstrings", equipment: ["barbell"] },
  { name: "Lying Leg Curl", muscle: "hamstrings", equipment: ["machine"] },
  { name: "Seated Leg Curl", muscle: "hamstrings", equipment: ["machine"] },
  { name: "Nordic Curl", muscle: "hamstrings", equipment: ["bodyweight"] },
  { name: "Good Morning", muscle: "hamstrings", equipment: ["barbell"] },
  { name: "Dumbbell Romanian Deadlift", muscle: "hamstrings", equipment: ["dumbbell"] },
  { name: "Single-Leg Romanian Deadlift", muscle: "hamstrings", equipment: ["dumbbell", "bodyweight"] },
  { name: "Sliding Leg Curl", muscle: "hamstrings", equipment: ["bodyweight"] },
  { name: "Back Extension", muscle: "hamstrings", equipment: ["machine", "bodyweight"] },
  { name: "Cable Leg Curl", muscle: "hamstrings", equipment: ["cable"] },

  // Glutes
  { name: "Hip Thrust", muscle: "glutes", equipment: ["barbell"] },
  { name: "Glute Bridge", muscle: "glutes", equipment: ["bodyweight"] },
  { name: "Sumo Deadlift", muscle: "glutes", equipment: ["barbell"] },
  { name: "Cable Kickback", muscle: "glutes", equipment: ["cable"] },
  { name: "Hip Abduction", muscle: "glutes", equipment: ["machine"] },
  { name: "Reverse Lunge", muscle: "glutes", equipment: ["dumbbell", "bodyweight", "barbell"] },
  { name: "Dumbbell Hip Thrust", muscle: "glutes", equipment: ["dumbbell"] },
  { name: "Single-Leg Glute Bridge", muscle: "glutes", equipment: ["bodyweight"] },
  { name: "Cable Pull-Through", muscle: "glutes", equipment: ["cable"] },

  // Calves
  { name: "Standing Calf Raise", muscle: "calves", equipment: ["machine", "bodyweight", "dumbbell", "barbell"] },
  { name: "Seated Calf Raise", muscle: "calves", equipment: ["machine"] },
  { name: "Donkey Calf Raise", muscle: "calves", equipment: ["machine"] },
  { name: "Dumbbell Calf Raise", muscle: "calves", equipment: ["dumbbell"] },
  { name: "Cable Calf Raise", muscle: "calves", equipment: ["cable"] },

  // Core
  { name: "Plank", muscle: "core", equipment: ["bodyweight"] },
  { name: "Side Plank", muscle: "core", equipment: ["bodyweight"] },
  { name: "Hanging Leg Raise", muscle: "core", equipment: ["bodyweight"] },
  { name: "Cable Crunch", muscle: "core", equipment: ["cable"] },
  { name: "Ab Wheel", muscle: "core", equipment: ["bodyweight"] },
  { name: "Russian Twist", muscle: "core", equipment: ["bodyweight", "dumbbell"] },
  { name: "Pallof Press", muscle: "core", equipment: ["cable"] },
  { name: "Dead Bug", muscle: "core", equipment: ["bodyweight"] },
  { name: "Dumbbell Sit-up", muscle: "core", equipment: ["dumbbell"] },
  { name: "Ab Crunch Machine", muscle: "core", equipment: ["machine"] },
  { name: "Barbell Rollout", muscle: "core", equipment: ["barbell"] },
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

export function defaultEquipmentIds() {
  return EQUIPMENT.map((item) => item.id);
}

export function defaultSettings() {
  return {
    restSeconds: DEFAULT_REST_SECONDS,
    equipmentIds: defaultEquipmentIds(),
    notifyRest: true,
    weightUnit: "lb",
  };
}

export function normalizeWeightUnit(value) {
  return value === "kg" ? "kg" : "lb";
}

export function normalizeSettings(raw) {
  const defaults = defaultSettings();
  const rest = Number(raw?.restSeconds);
  const restSeconds = REST_PRESETS.includes(rest) ? rest : defaults.restSeconds;
  const allowed = new Set(defaultEquipmentIds());
  const incoming = Array.isArray(raw?.equipmentIds)
    ? raw.equipmentIds.filter((id) => allowed.has(id))
    : defaults.equipmentIds;
  return {
    restSeconds,
    equipmentIds: incoming.length ? [...new Set(incoming)] : defaults.equipmentIds,
    notifyRest: raw?.notifyRest !== false,
    weightUnit: normalizeWeightUnit(raw?.weightUnit),
  };
}

export function roundToHalf(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 2) / 2;
}

export function lbToKg(weightLb) {
  return roundToHalf(Number(weightLb) / LB_PER_KG);
}

export function kgToLb(weightKg) {
  return roundToHalf(Number(weightKg) * LB_PER_KG);
}

export function unitLabel(unit) {
  return normalizeWeightUnit(unit) === "kg" ? "kg" : "lbs";
}

export function formatWeightNumber(weightLb, unit = "lb") {
  if (!isPresent(weightLb)) return "";
  const n = Number(weightLb);
  if (!Number.isFinite(n)) return "";
  const display = normalizeWeightUnit(unit) === "kg" ? lbToKg(n) : roundToHalf(n);
  return String(display);
}

export function displayWeightFromLb(weightLb, unit = "lb") {
  return formatWeightNumber(weightLb, unit);
}

export function weightLbFromDisplay(value, unit = "lb") {
  if (!isPresent(value)) return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return normalizeWeightUnit(unit) === "kg" ? kgToLb(n) : roundToHalf(n);
}

export function convertDisplayedWeight(value, fromUnit, toUnit) {
  const from = normalizeWeightUnit(fromUnit);
  const to = normalizeWeightUnit(toUnit);
  if (from === to) return value;
  if (!isPresent(value)) return value;
  const n = parseFloat(value);
  if (!Number.isFinite(n) || n < 0) return value;
  const asLb = from === "kg" ? kgToLb(n) : roundToHalf(n);
  return formatWeightNumber(asLb, to);
}

export function convertLiveExerciseWeights(exercises, fromUnit, toUnit) {
  if (normalizeWeightUnit(fromUnit) === normalizeWeightUnit(toUnit)) return exercises;
  return (exercises || []).map((ex) => ({
    ...ex,
    sets: (ex.sets || []).map((set) => ({
      ...set,
      weight: convertDisplayedWeight(set.weight, fromUnit, toUnit),
    })),
  }));
}

export function parseRpe(value) {
  if (!isPresent(value)) return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1 || n > 10) return null;
  return roundToHalf(n);
}

/**
 * Double progression: hit the top of the rep range, then add load.
 * Hypertrophy-friendly default is 8 reps, then +5 lb / +2.5 kg.
 */
export function suggestProgression(previousWeightLb, previousReps, unit = "lb") {
  const reps = Number(previousReps);
  const weightLb = Number(previousWeightLb);
  if (!Number.isFinite(weightLb) || weightLb <= 0 || !Number.isFinite(reps) || reps <= 0) {
    return null;
  }
  if (reps >= TOP_REP_TARGET) {
    const nextLb = normalizeWeightUnit(unit) === "kg"
      ? kgToLb(roundToHalf(lbToKg(weightLb) + PROGRESSION_KG))
      : roundToHalf(weightLb + PROGRESSION_LB);
    return { weightLb: nextLb, reps, bumped: "weight" };
  }
  return { weightLb, reps: reps + 1, bumped: "reps" };
}

export function formatProgressionHint(suggestion, unit = "lb") {
  if (!suggestion) return "";
  return `Try ${formatLoad(suggestion.weightLb, suggestion.reps, unit)}`;
}

export function hasAllEquipment(equipmentIds) {
  const selected = new Set(equipmentIds || []);
  return defaultEquipmentIds().every((id) => selected.has(id));
}

export function exerciseMatchesEquipment(exercise, equipmentIds) {
  if (!equipmentIds || hasAllEquipment(equipmentIds)) return true;
  const have = new Set(equipmentIds);
  return (exercise.equipment || []).some((id) => have.has(id));
}

export function filterExercisesByEquipment(exercises = EXERCISES, equipmentIds) {
  return (exercises || []).filter((ex) => exerciseMatchesEquipment(ex, equipmentIds));
}

export function filterCatalog(exercises, muscleId, equipmentIds) {
  return filterExercisesByEquipment(
    filterExercisesByMuscle(exercises, muscleId),
    equipmentIds
  );
}

export function toggleEquipmentId(currentIds, id) {
  const allowed = new Set(defaultEquipmentIds());
  if (!allowed.has(id)) return [...(currentIds || defaultEquipmentIds())];
  // From "all gear", tapping one type means "I only have this" — the
  // common bodyweight-only / dumbbells-only path. Further taps add or
  // remove types. An empty selection falls back to all equipment.
  if (hasAllEquipment(currentIds)) return [id];
  const selected = new Set(currentIds || []);
  if (selected.has(id)) {
    selected.delete(id);
  } else {
    selected.add(id);
  }
  const next = defaultEquipmentIds().filter((item) => selected.has(item));
  return next.length ? next : defaultEquipmentIds();
}

export function adjustTimerSeconds(current, delta, min = 0, max = TIMER_MAX_SECONDS) {
  const next = (Number(current) || 0) + delta;
  if (next < min) return min;
  if (next > max) return max;
  return next;
}

const ROLE_FALLBACKS = {
  squat: ["Squat", "Goblet Squat", "Hack Squat", "Leg Press", "Cable Squat", "Bulgarian Split Squat", "Sissy Squat", "Walking Lunge"],
  hinge: [
    "Romanian Deadlift",
    "Dumbbell Romanian Deadlift",
    "Stiff-Leg Deadlift",
    "Single-Leg Romanian Deadlift",
    "Cable Pull-Through",
    "Back Extension",
    "Deadlift",
    "Good Morning",
    "Nordic Curl",
    "Sliding Leg Curl",
  ],
  hPush: [
    "Bench Press",
    "Dumbbell Bench Press",
    "Incline Dumbbell Press",
    "Chest Press Machine",
    "Cable Chest Press",
    "Push-ups",
    "Dips",
    "Cable Fly",
  ],
  hPull: ["Barbell Row", "Dumbbell Row", "Seated Cable Row", "Chest-Supported Row", "Machine Row", "Inverted Row", "Towel Row"],
  vPush: ["Overhead Press", "Dumbbell Shoulder Press", "Arnold Press", "Shoulder Press Machine", "Cable Shoulder Press", "Pike Push-ups"],
  vPull: ["Pull-ups", "Chin-ups", "Lat Pulldown", "Assisted Pull-up", "Dumbbell Pullover", "Machine Row", "T-Bar Row", "Inverted Row", "Towel Row", "Superman"],
  laterals: ["Lateral Raise", "Cable Lateral Raise", "Machine Lateral Raise", "Upright Row", "Rear Delt Fly", "Prone Y Raise"],
  biceps: ["Dumbbell Curl", "Hammer Curl", "Barbell Curl", "Cable Curl", "Machine Curl", "Concentration Curl", "Chin-ups", "Towel Curl"],
  triceps: [
    "Tricep Pushdown",
    "Rope Pushdown",
    "Overhead Tricep Extension",
    "Machine Tricep Extension",
    "Tricep Dips",
    "Diamond Push-ups",
    "Close-Grip Bench Press",
    "Kickbacks",
  ],
  core: [
    "Plank",
    "Dumbbell Sit-up",
    "Cable Crunch",
    "Ab Crunch Machine",
    "Barbell Rollout",
    "Russian Twist",
    "Pallof Press",
    "Hanging Leg Raise",
    "Dead Bug",
    "Side Plank",
  ],
  unilateral: ["Bulgarian Split Squat", "Walking Lunge", "Cable Lunge", "Reverse Lunge", "Step-up", "Single-Leg Romanian Deadlift"],
  glute: [
    "Hip Thrust",
    "Dumbbell Hip Thrust",
    "Cable Pull-Through",
    "Cable Kickback",
    "Single-Leg Glute Bridge",
    "Glute Bridge",
    "Hip Abduction",
    "Sumo Deadlift",
  ],
  hamIso: [
    "Lying Leg Curl",
    "Seated Leg Curl",
    "Cable Leg Curl",
    "Dumbbell Romanian Deadlift",
    "Single-Leg Romanian Deadlift",
    "Nordic Curl",
    "Sliding Leg Curl",
    "Back Extension",
  ],
  calves: ["Standing Calf Raise", "Dumbbell Calf Raise", "Seated Calf Raise", "Cable Calf Raise", "Donkey Calf Raise"],
};

const TEMPLATE_SLOTS = {
  fullBody: [
    ["squat", "quads"],
    ["hPush", "chest"],
    ["hinge", "hamstrings"],
    ["hPull", "back"],
    ["vPush", "shoulders"],
    ["core", "core"],
  ],
  upper: [
    ["hPush", "chest"],
    ["hPull", "back"],
    ["vPush", "shoulders"],
    ["vPull", "back"],
    ["laterals", "shoulders"],
    ["biceps", "biceps"],
    ["triceps", "triceps"],
  ],
  lower: [
    ["squat", "quads"],
    ["hinge", "hamstrings"],
    ["unilateral", "quads"],
    ["glute", "glutes"],
    ["hamIso", "hamstrings"],
    ["calves", "calves"],
  ],
};

const SUPERSET_ROLE_PAIRS = {
  // Alternating lower/upper compounds, then push/pull, then press + core.
  // Antagonist and non-competing pairs keep load up while cutting rest time.
  fullBody: [
    ["squat", "hPush"],
    ["hinge", "hPull"],
    ["vPush", "core"],
  ],
  // Horizontal push/pull, vertical push/pull, then arm antagonists.
  upper: [
    ["hPush", "hPull"],
    ["vPush", "vPull"],
    ["biceps", "triceps"],
  ],
  // Knee + hip, single-leg + glute, curl + calves — little local overlap.
  lower: [
    ["squat", "hinge"],
    ["unilateral", "glute"],
    ["hamIso", "calves"],
  ],
};

const ANTAGONIST_MUSCLES = {
  chest: ["back"],
  back: ["chest", "shoulders"],
  shoulders: ["back"],
  biceps: ["triceps"],
  triceps: ["biceps"],
  quads: ["hamstrings"],
  hamstrings: ["quads"],
  glutes: ["quads"],
  calves: ["core"],
  core: ["calves"],
};

const ROLE_MUSCLE = Object.fromEntries(Object.values(TEMPLATE_SLOTS).flat());

const MUSCLE_PRIORITY = {
  chest: ROLE_FALLBACKS.hPush,
  back: ["Deadlift", ...ROLE_FALLBACKS.hPull, ...ROLE_FALLBACKS.vPull],
  shoulders: [...ROLE_FALLBACKS.vPush, ...ROLE_FALLBACKS.laterals],
  biceps: ROLE_FALLBACKS.biceps,
  triceps: ROLE_FALLBACKS.triceps,
  quads: [...ROLE_FALLBACKS.squat, ...ROLE_FALLBACKS.unilateral],
  hamstrings: [...ROLE_FALLBACKS.hinge, ...ROLE_FALLBACKS.hamIso],
  glutes: ROLE_FALLBACKS.glute,
  calves: ROLE_FALLBACKS.calves,
  core: ROLE_FALLBACKS.core,
};

function catalogByName(exercises = EXERCISES) {
  return new Map((exercises || []).map((ex) => [ex.name, ex]));
}

function isBodyweightOnly(equipmentIds) {
  return Array.isArray(equipmentIds) && equipmentIds.length === 1 && equipmentIds[0] === "bodyweight";
}

/** These are bodyweight *loading* but need a bar — skip them in bodyweight-only suggestions. */
const NEEDS_PULLUP_BAR = new Set(["Pull-ups", "Chin-ups", "Hanging Leg Raise"]);

function pickMatchingExercise(preferredNames, equipmentIds, usedNames, exercises, muscleId) {
  const skipBar = isBodyweightOnly(equipmentIds);
  const byName = catalogByName(exercises);
  for (const name of preferredNames || []) {
    if (usedNames.has(name)) continue;
    if (skipBar && NEEDS_PULLUP_BAR.has(name)) continue;
    const ex = byName.get(name);
    if (ex && exerciseMatchesEquipment(ex, equipmentIds)) return ex;
  }
  if (!muscleId) return null;
  return (
    (exercises || []).find(
      (ex) =>
        ex.muscle === muscleId &&
        !usedNames.has(ex.name) &&
        !(skipBar && NEEDS_PULLUP_BAR.has(ex.name)) &&
        exerciseMatchesEquipment(ex, equipmentIds)
    ) || null
  );
}

export function pickExerciseForRole(role, equipmentIds, usedNames = new Set(), exercises = EXERCISES, muscleId) {
  return pickMatchingExercise(
    ROLE_FALLBACKS[role],
    equipmentIds,
    usedNames,
    exercises,
    muscleId || ROLE_MUSCLE[role]
  );
}

export function buildSplitWorkout(kind, equipmentIds, exercises = EXERCISES) {
  const slots = TEMPLATE_SLOTS[kind] || [];
  const used = new Set();
  const picked = [];
  for (const [role, muscle] of slots) {
    const ex = pickExerciseForRole(role, equipmentIds, used, exercises, muscle);
    if (!ex) continue;
    used.add(ex.name);
    picked.push({ name: ex.name, setCount: SETS_PER_EXERCISE, role });
  }
  return applyRoleSupersets(picked, SUPERSET_ROLE_PAIRS[kind] || []);
}

export function applyRoleSupersets(items, pairs) {
  const next = (items || []).map((item) => ({ ...item, supersetId: item.supersetId ?? null }));
  const indexByRole = new Map();
  next.forEach((item, i) => {
    if (item.role) indexByRole.set(item.role, i);
  });
  let n = 1;
  for (const [a, b] of pairs || []) {
    const i = indexByRole.get(a);
    const j = indexByRole.get(b);
    if (i == null || j == null) continue;
    const id = `ss-${n++}`;
    next[i] = { ...next[i], supersetId: id };
    next[j] = { ...next[j], supersetId: id };
  }
  return next.map(({ role, ...rest }) => rest);
}

export function pairAntagonistSupersets(items, catalog = EXERCISES) {
  const list = (items || []).map((item) => ({
    ...item,
    muscle: getMuscleForExercise(item.name, catalog),
    supersetId: null,
  }));
  const used = new Set();
  const ordered = [];
  let n = 1;
  for (let i = 0; i < list.length; i++) {
    if (used.has(i)) continue;
    const partners = ANTAGONIST_MUSCLES[list[i].muscle] || [];
    let found = -1;
    for (let j = i + 1; j < list.length; j++) {
      if (used.has(j)) continue;
      if (partners.includes(list[j].muscle)) {
        found = j;
        break;
      }
    }
    const id = found >= 0 ? `ss-${n++}` : null;
    ordered.push({ ...list[i], supersetId: id });
    used.add(i);
    if (found >= 0) {
      ordered.push({ ...list[found], supersetId: id });
      used.add(found);
    }
  }
  return ordered.map(({ muscle, ...rest }) => rest);
}

export function findSupersetPartnerIndex(exercises, index) {
  const id = exercises?.[index]?.supersetId;
  if (!id) return null;
  if (index > 0 && exercises[index - 1]?.supersetId === id) return index - 1;
  if (index < (exercises?.length || 0) - 1 && exercises[index + 1]?.supersetId === id) return index + 1;
  return null;
}

export function groupedWorkoutItems(exercises) {
  const list = exercises || [];
  const groups = [];
  for (let i = 0; i < list.length; i++) {
    const partner = findSupersetPartnerIndex(list, i);
    if (partner === i + 1) {
      groups.push({ kind: "superset", indices: [i, i + 1], exercises: [list[i], list[i + 1]] });
      i += 1;
    } else {
      groups.push({ kind: "single", indices: [i], exercises: [list[i]] });
    }
  }
  return groups;
}

function cloneExercises(exercises) {
  return (exercises || []).map((ex) => ({ ...ex }));
}

/** Move a single or a whole superset as one block. `delta` is in groups, not lifts. */
export function moveWorkoutBlock(exercises, groupIndex, delta) {
  const groups = groupedWorkoutItems(exercises);
  const to = groupIndex + delta;
  if (groupIndex < 0 || to < 0 || groupIndex >= groups.length || to >= groups.length) {
    return cloneExercises(exercises);
  }
  const next = groups.slice();
  const [group] = next.splice(groupIndex, 1);
  next.splice(to, 0, group);
  return next.flatMap((item) => item.exercises.map((ex) => ({ ...ex })));
}

export function moveWorkoutBlockTo(exercises, fromGroupIndex, toGroupIndex) {
  return moveWorkoutBlock(exercises, fromGroupIndex, toGroupIndex - fromGroupIndex);
}

/**
 * Where a dragged block should land after dropping on another block.
 * `place` is "before" or "after" the hovered group.
 */
export function dropTargetIndex(fromIndex, overIndex, place) {
  const from = Number(fromIndex);
  const over = Number(overIndex);
  if (!Number.isInteger(from) || !Number.isInteger(over) || from === over) return from;
  if (place === "before") return from < over ? over - 1 : over;
  if (place === "after") return from < over ? over : over + 1;
  return from;
}

export function dropPlaceFromOffset(offsetY, height) {
  if (!height || offsetY < height / 2) return "before";
  return "after";
}

export function dropWorkoutBlock(exercises, fromGroupIndex, overGroupIndex, place) {
  const to = dropTargetIndex(fromGroupIndex, overGroupIndex, place);
  if (to === fromGroupIndex) return cloneExercises(exercises);
  return moveWorkoutBlockTo(exercises, fromGroupIndex, to);
}

export function canPairWithNext(exercises, index) {
  const current = exercises?.[index];
  const next = exercises?.[index + 1];
  if (!current || !next) return false;
  if (current.supersetId || next.supersetId) return false;
  return true;
}

/** Swap the two lifts inside a pair. `index` can be either partner. */
export function swapSupersetPartners(exercises, index) {
  const partner = findSupersetPartnerIndex(exercises, index);
  if (partner == null) return cloneExercises(exercises);
  const list = cloneExercises(exercises);
  const a = Math.min(index, partner);
  const b = Math.max(index, partner);
  const tmp = list[a];
  list[a] = list[b];
  list[b] = tmp;
  return list;
}

export function togglePairWithNext(exercises, index) {
  const list = (exercises || []).map((ex) => ({ ...ex }));
  if (index < 0 || index >= list.length - 1) return list;
  const a = list[index];
  const b = list[index + 1];
  if (a.supersetId && a.supersetId === b.supersetId) {
    a.supersetId = null;
    b.supersetId = null;
    return list;
  }
  const stale = new Set([a.supersetId, b.supersetId].filter(Boolean));
  if (stale.size) {
    for (const ex of list) {
      if (stale.has(ex.supersetId)) ex.supersetId = null;
    }
  }
  const id = `ss-${createId().replace(/-/g, "").slice(0, 8)}`;
  list[index].supersetId = id;
  list[index + 1].supersetId = id;
  return list;
}

export function moveExercise(exercises, from, delta) {
  const groups = groupedWorkoutItems(exercises);
  const groupIndex = groups.findIndex((group) => group.indices.includes(from));
  if (groupIndex < 0) return cloneExercises(exercises);
  return moveWorkoutBlock(exercises, groupIndex, delta);
}

export function normalizeSupersetAdjacency(exercises) {
  const list = (exercises || []).map((ex) => ({ ...ex }));
  const counts = new Map();
  for (const ex of list) {
    if (!ex.supersetId) continue;
    counts.set(ex.supersetId, (counts.get(ex.supersetId) || 0) + 1);
  }
  for (let i = 0; i < list.length; i++) {
    const id = list[i].supersetId;
    if (!id) continue;
    const adjacent =
      (i > 0 && list[i - 1].supersetId === id) ||
      (i < list.length - 1 && list[i + 1].supersetId === id);
    if (!adjacent || counts.get(id) !== 2) list[i].supersetId = null;
  }
  return list;
}

/**
 * Rest starts after a completed set, unless this lift is in a superset —
 * then both partners must finish that set number first.
 */
export function shouldStartRestTimer(exercises, exerciseIndex, setIndex) {
  const current = exercises?.[exerciseIndex]?.sets?.[setIndex];
  if (!current?.completed) return false;
  const partner = findSupersetPartnerIndex(exercises, exerciseIndex);
  if (partner == null) return true;
  const partnerSet = exercises[partner]?.sets?.[setIndex];
  if (!partnerSet) return true;
  return !!partnerSet.completed;
}

export function restNotificationPayload(exercises, exerciseIndex, setIndex) {
  const current = exercises?.[exerciseIndex];
  const partnerIndex = findSupersetPartnerIndex(exercises, exerciseIndex);
  const partner = partnerIndex != null ? exercises[partnerIndex] : null;
  const nextNum = (setIndex ?? 0) + 2;
  const hasNext =
    (current?.sets?.length || 0) > (setIndex ?? 0) + 1 ||
    (partner?.sets?.length || 0) > (setIndex ?? 0) + 1;
  if (partner) {
    const first = partnerIndex < exerciseIndex ? partner : current;
    const second = partnerIndex < exerciseIndex ? current : partner;
    return {
      title: "Rest over",
      body: hasNext
        ? `Next round: ${first.name} + ${second.name}.`
        : `${first.name} + ${second.name} is done. On to the next work.`,
    };
  }
  return {
    title: "Rest over",
    body: hasNext
      ? `Time for ${current?.name || "your next set"}, set ${nextNum}.`
      : `Time for your next exercise.`,
  };
}

export function remainingSeconds(endsAt, now = Date.now()) {
  if (!endsAt) return 0;
  return Math.max(0, Math.round((Number(endsAt) - Number(now)) / 1000));
}

export function restEndClockLabel(endsAt) {
  const d = new Date(endsAt);
  if (Number.isNaN(d.getTime())) return "";
  let hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${String(minutes).padStart(2, "0")} ${ampm}`;
}

export function restStartNotificationPayload(endsAt) {
  const clock = restEndClockLabel(endsAt);
  return {
    title: "Resting",
    body: clock
      ? `Up at ${clock}. This stays on the lock screen if the app sleeps.`
      : "Rest timer running.",
    silent: true,
  };
}

/** Compact lineup for suggestion cards: "Squat + Bench Press · Row". */
export function formatExerciseLineup(exercises) {
  return groupedWorkoutItems(exercises)
    .map((group) => {
      if (group.kind === "superset") {
        return `${group.exercises[0].name} + ${group.exercises[1].name}`;
      }
      return group.exercises[0]?.name || "";
    })
    .filter(Boolean)
    .join(" · ");
}

/**
 * Whether to skip, request, or show rest notifications.
 * @param {NotificationPermission | string | undefined} permission
 * @param {boolean} notifyEnabled
 */
export function notificationPermissionAction(permission, notifyEnabled) {
  if (!notifyEnabled) return "skip";
  if (permission === "granted") return "notify";
  if (permission === "denied") return "blocked";
  return "request";
}

function hoursBetween(iso, now) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return Infinity;
  return (now.getTime() - then) / 3_600_000;
}

export function muscleTrainingStats(workouts, now = new Date(), exercises = EXERCISES) {
  const cutoff = now.getTime() - LOOKBACK_DAYS * 24 * 3_600_000;
  const stats = {};
  for (const group of MUSCLE_GROUPS) {
    stats[group.id] = { muscle: group.id, weeklySets: 0, lastTrainedAt: null };
  }

  for (const workout of workouts || []) {
    if (!workout?.completedAt) continue;
    const at = new Date(workout.completedAt);
    if (Number.isNaN(at.getTime())) continue;
    const recent = at.getTime() >= cutoff;
    for (const ex of workout.exercises || []) {
      const muscle = getMuscleForExercise(ex.name, exercises);
      if (!muscle || !stats[muscle]) continue;
      const loggedSets = (ex.sets || []).filter(isLoggedSet).length || (ex.sets || []).length;
      if (recent) stats[muscle].weeklySets += loggedSets;
      if (!stats[muscle].lastTrainedAt || at > new Date(stats[muscle].lastTrainedAt)) {
        stats[muscle].lastTrainedAt = workout.completedAt;
      }
    }
  }
  return stats;
}

export function weeklyVolumeRows(workouts, now = new Date(), exercises = EXERCISES) {
  const stats = muscleTrainingStats(workouts, now, exercises);
  return MUSCLE_GROUPS.map((group) => ({
    id: group.id,
    label: group.label,
    sets: stats[group.id]?.weeklySets || 0,
  })).filter((row) => row.sets > 0);
}

function muscleNeedScore(stat, now) {
  const hours = stat.lastTrainedAt ? hoursBetween(stat.lastTrainedAt, now) : LOOKBACK_DAYS * 24;
  const recovering = hours < RECOVERY_HOURS;
  const recency = Math.min(hours / 24, LOOKBACK_DAYS);
  let score = recency * 10 - stat.weeklySets;
  if (recovering) score -= 50;
  return score;
}

export function buildPersonalizedWorkout(workouts, equipmentIds, now = new Date(), exercises = EXERCISES) {
  const stats = muscleTrainingStats(workouts, now, exercises);
  const ranked = MUSCLE_GROUPS.map((group) => ({
    ...group,
    ...stats[group.id],
    score: muscleNeedScore(stats[group.id], now),
  })).sort((a, b) => b.score - a.score);

  const TARGET_EXERCISES = 6;
  const used = new Set();
  const picked = [];
  const chosen = [];

  for (const target of ranked) {
    if (picked.length >= TARGET_EXERCISES) break;
    if (target.score <= -20) continue;
    const remaining = TARGET_EXERCISES - picked.length;
    const want = target.weeklySets < 10 && remaining >= 2 ? 2 : 1;
    let added = 0;
    while (added < want && picked.length < TARGET_EXERCISES) {
      const match = pickMatchingExercise(
        MUSCLE_PRIORITY[target.id],
        equipmentIds,
        used,
        exercises,
        target.id
      );
      if (!match) break;
      used.add(match.name);
      picked.push({ name: match.name, setCount: SETS_PER_EXERCISE });
      added += 1;
    }
    if (added) chosen.push(target);
  }

  const labels = chosen
    .slice(0, 4)
    .map((m) => m.label.toLowerCase())
    .join(", ");
  return {
    kind: "personalized",
    name: "Suggested session",
    reason: labels
      ? `Hypertrophy work is more effective at ~10–20 sets/muscle/week, trained ~2×/week, with ~48h between hard sessions. Right now ${labels} look most under-trained.`
      : "Hypertrophy work is more effective when each muscle is trained about twice a week. This session spreads compounds across lagging groups.",
    exercises: pairAntagonistSupersets(picked, exercises),
  };
}

export function suggestWorkouts(workouts, { equipmentIds, now = new Date(), exercises = EXERCISES } = {}) {
  const equipment = equipmentIds || defaultEquipmentIds();
  const cutoff = now.getTime() - LOOKBACK_DAYS * 24 * 3_600_000;
  const recent = (workouts || []).filter((w) => {
    if (!w?.completedAt) return false;
    const at = new Date(w.completedAt).getTime();
    return !Number.isNaN(at) && at >= cutoff;
  });

  const pack = (kind, name, reason) => ({
    kind,
    name,
    reason,
    exercises: buildSplitWorkout(kind, equipment, exercises),
  });

  if (recent.length === 0) {
    return [
      pack(
        "fullBody",
        "Full body",
        "No sessions in the last week. A full-body workout trains each muscle once, with antagonist and upper/lower supersets so rest time drops without cutting load."
      ),
      pack(
        "upper",
        "Upper body",
        "Push, pull, and arms as antagonist supersets. Pair with a lower-body day later in the week so each muscle can hit ~2 sessions."
      ),
      pack(
        "lower",
        "Lower body",
        "Squat/hinge, single-leg/glute, and curl/calf supersets. Frequency of 2x/week per muscle beats cramming all sets into one day."
      ),
    ].filter((item) => item.exercises.length > 0);
  }

  const personalized = buildPersonalizedWorkout(workouts, equipment, now, exercises);
  return personalized.exercises.length ? [personalized] : [
    pack("fullBody", "Full body", "Not enough matching exercises for a custom split with current equipment."),
  ];
}

export function exercisesFromSuggestion(suggestion, workouts = []) {
  return (suggestion?.exercises || []).map((item) =>
    createExercise(
      item.name,
      item.setCount || SETS_PER_EXERCISE,
      getPreviousSets(workouts, item.name),
      { supersetId: item.supersetId ?? null }
    )
  );
}

export function visibleLibraryItems(workouts, hiddenIds, templates) {
  const hidden = new Set(hiddenIds || []);
  const savedTemplates = (templates || []).map((item) => ({ ...item, kind: "template" }));
  const listed = (workouts || [])
    .filter((item) => item?.id && !hidden.has(item.id))
    .map((item) => ({ ...item, kind: "history" }));
  return [...savedTemplates, ...listed];
}

export function hideWorkoutFromLibrary(hiddenIds, id) {
  if (!id) return [...(hiddenIds || [])];
  if ((hiddenIds || []).includes(id)) return [...hiddenIds];
  return [...(hiddenIds || []), id];
}

export function saveSuggestionTemplate(templates, suggestion, now = new Date()) {
  const exercises = (suggestion?.exercises || []).map((item) => ({
    name: item.name,
    supersetId: item.supersetId ?? null,
    sets: Array.from({ length: item.setCount || SETS_PER_EXERCISE }, () => ({
      weight: null,
      reps: null,
    })),
  }));
  const template = {
    id: createId(),
    name: suggestion?.name || "Saved workout",
    savedAt: now.toISOString(),
    exercises,
  };
  return [template, ...(templates || [])];
}

export function removeTemplate(templates, id) {
  return (templates || []).filter((item) => item.id !== id);
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
    rpe: "",
    completed: false,
    source: null,
    weightSource: null,
    repsSource: null,
    previousWeight: previous?.weight ?? null,
    previousReps: previous?.reps ?? null,
    previousRpe: previous?.rpe ?? null,
  };
}

/**
 * @param {string} name
 * @param {number} [setCount]
 * @param {Array<{ weight: number|null, reps: number|null }> | null} [previousSets]
 */
export function createExercise(name, setCount = SETS_PER_EXERCISE, previousSets = null, extra = {}) {
  const count = Math.max(1, setCount);
  const sets = Array.from({ length: count }, (_, i) => createEmptySet(previousSets?.[i]));
  return {
    name,
    sets,
    previousSets: previousSets || null,
    supersetId: extra.supersetId ?? null,
    note: extra.note || "",
  };
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
export function collectWorkoutData(selectedExercises, unit = "lb") {
  return selectedExercises.map((item) => {
    const sets = item.sets.map((s, idx) => ({
      set: idx + 1,
      weight: weightLbFromDisplay(s.weight, unit),
      reps: isPresent(s.reps) ? Number(s.reps) : null,
      rpe: parseRpe(s.rpe),
    }));
    const note = typeof item.note === "string" ? item.note.trim() : "";
    return { name: item.name, sets, supersetId: item.supersetId ?? null, note };
  });
}

/**
 * @param {Array<{ name: string, sets: Array<unknown> }>} exercises
 */
export function summarizeExercises(exercises) {
  const list = exercises || [];
  const exerciseCount = list.length;
  const setCount = list.reduce((n, ex) => n + (ex.sets?.length || 0), 0);
  const parts = [];
  for (let i = 0; i < list.length; i++) {
    const ex = list[i];
    const n = ex.sets?.length || 0;
    const partner = findSupersetPartnerIndex(list, i);
    if (partner === i + 1) {
      const other = list[i + 1];
      const n2 = other.sets?.length || 0;
      parts.push(`${ex.name} + ${other.name} · ${n}/${n2} sets`);
      i += 1;
    } else {
      parts.push(`${ex.name} · ${n} set${n !== 1 ? "s" : ""}`);
    }
  }
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
        rpe: parseRpe(s.rpe),
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
      previousRpe: previousSets?.[i]?.rpe ?? null,
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
export function applyPreviousSet(setData, unit = "lb") {
  if (!hasPreviousSet(setData)) return false;
  if (isPresent(setData.previousWeight)) {
    setData.weight = displayWeightFromLb(setData.previousWeight, unit);
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
  if (field !== "weight" && field !== "reps") return false;
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
  const source = savedWorkout?.routine || savedWorkout?.exercises || [];
  const exercises = source.map((ex) =>
    createExercise(ex.name, Math.max(1, ex.sets?.length || SETS_PER_EXERCISE), null, {
      supersetId: ex.supersetId ?? null,
    })
  );
  return attachPreviousSets(exercises, allWorkouts);
}

export function exerciseStructure(exercises) {
  return (exercises || []).map((ex) => ({
    name: ex.name,
    setCount: Math.max(1, ex.sets?.length || SETS_PER_EXERCISE),
    supersetId: ex.supersetId ?? null,
  }));
}

export function structuresEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  return a.every(
    (item, i) =>
      item?.name === b[i]?.name &&
      item?.setCount === b[i]?.setCount &&
      (item?.supersetId || null) === (b[i]?.supersetId || null)
  );
}

export function toRoutineExercises(exercises) {
  return exerciseStructure(exercises).map((item) => ({
    name: item.name,
    supersetId: item.supersetId ?? null,
    sets: Array.from({ length: item.setCount }, () => ({ weight: null, reps: null })),
  }));
}

export function swapExerciseAt(exercises, index, newName, previousSets = null) {
  const list = exercises || [];
  if (index < 0 || index >= list.length || !newName) return list.slice();
  if (list.some((ex, i) => i !== index && ex.name === newName)) return list.slice();
  const setCount = Math.max(1, list[index].sets?.length || SETS_PER_EXERCISE);
  const next = list.slice();
  next[index] = createExercise(newName, setCount, previousSets, {
    supersetId: list[index].supersetId ?? null,
  });
  return next;
}

/**
 * Update the reusable routine for a saved workout.
 * Templates change in place. History sessions keep logged sets and store a `routine`
 * overlay so the next "Use workout" picks up the new exercises.
 */
export function updateSavedWorkoutRoutine(templates, workouts, source, exercises) {
  const routine = toRoutineExercises(exercises);
  if (!source?.id) return { templates: templates || [], workouts: workouts || [] };
  if (source.kind === "template") {
    return {
      templates: (templates || []).map((item) =>
        item.id === source.id ? { ...item, exercises: routine } : item
      ),
      workouts: workouts || [],
    };
  }
  return {
    templates: templates || [],
    workouts: (workouts || []).map((item) =>
      item.id === source.id ? { ...item, routine } : item
    ),
  };
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
export function formatLoad(weightLb, reps, unit = "lb") {
  const w = isPresent(weightLb) ? `${formatWeightNumber(weightLb, unit)} ${unitLabel(unit)}` : "—";
  const r = isPresent(reps) ? `${reps} reps` : "—";
  return `${w} × ${r}`;
}

export function parseStoredState(raw) {
  const empty = {
    workouts: [],
    hiddenIds: [],
    templates: [],
    settings: defaultSettings(),
  };
  if (!raw) return empty;
  try {
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!data || !Array.isArray(data.workouts)) return empty;
    return {
      workouts: data.workouts,
      hiddenIds: Array.isArray(data.hiddenIds) ? data.hiddenIds.filter((id) => typeof id === "string") : [],
      templates: Array.isArray(data.templates) ? data.templates : [],
      settings: normalizeSettings(data.settings),
    };
  } catch {
    return empty;
  }
}

export function serializeState(workoutsOrState) {
  if (Array.isArray(workoutsOrState)) {
    return JSON.stringify({
      workouts: workoutsOrState,
      hiddenIds: [],
      templates: [],
      settings: defaultSettings(),
    });
  }
  const settings = normalizeSettings(workoutsOrState?.settings);
  return JSON.stringify({
    workouts: workoutsOrState?.workouts || [],
    hiddenIds: workoutsOrState?.hiddenIds || [],
    templates: workoutsOrState?.templates || [],
    settings,
  });
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
    ...(Array.isArray(raw.routine) ? { routine: raw.routine } : {}),
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

export function buildExportPayload(workouts, exportedAt = new Date().toISOString(), extra = {}) {
  return {
    app: EXPORT_APP_ID,
    version: EXPORT_FORMAT_VERSION,
    exportedAt,
    workouts: (workouts || []).map(normalizeWorkout).filter(Boolean),
    hiddenIds: extra.hiddenIds || [],
    templates: extra.templates || [],
    settings: normalizeSettings(extra.settings),
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
    hiddenIds: Array.isArray(data?.hiddenIds) ? data.hiddenIds : [],
    templates: Array.isArray(data?.templates) ? data.templates : [],
    settings: data?.settings ? normalizeSettings(data.settings) : null,
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
