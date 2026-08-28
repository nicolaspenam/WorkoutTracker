/**
 * app.test.js – unit tests for WorkoutTracker using node:test
 * Run with: node --experimental-vm-modules app.test.js
 *       or: node app.test.js   (Node 18+)
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import {
  formatTime,
  handleSetCompletion,
  collectWorkoutData,
  pruneUnloggedExercises,
  DEFAULT_REST_SECONDS,
  SETS_PER_EXERCISE,
  createEmptySet,
  createExercise,
  isLoggedSet,
  summarizeExercises,
  displayWorkoutName,
  formatRelativeDate,
  getPreviousSets,
  attachPreviousSets,
  hasPreviousSet,
  applyPreviousSet,
  updateSetField,
  fieldInputSource,
  setInputSource,
  addSet,
  removeSet,
  workoutToExercises,
  exerciseStructure,
  structuresEqual,
  swapExerciseAt,
  updateSavedWorkoutRoutine,
  isBetterSet,
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
  EXPORT_FORMAT_VERSION,
  EXERCISES,
  MUSCLE_GROUPS,
  filterExercisesByMuscle,
  groupExercisesByMuscle,
  getMuscleForExercise,
  getMuscleLabel,
  filterRecordsByMuscle,
  EQUIPMENT,
  REST_PRESETS,
  LOOKBACK_DAYS,
  TIMER_ADJUST_SECONDS,
  defaultEquipmentIds,
  filterCatalog,
  filterExercisesByEquipment,
  toggleEquipmentId,
  hasAllEquipment,
  exerciseMatchesEquipment,
  adjustTimerSeconds,
  suggestWorkouts,
  buildSplitWorkout,
  applyRoleSupersets,
  pairAntagonistSupersets,
  findSupersetPartnerIndex,
  groupedWorkoutItems,
  togglePairWithNext,
  moveExercise,
  moveWorkoutBlock,
  swapSupersetPartners,
  dropWorkoutBlock,
  dropTargetIndex,
  dropPlaceFromOffset,
  canPairWithNext,
  normalizeSupersetAdjacency,
  shouldStartRestTimer,
  restNotificationPayload,
  formatExerciseLineup,
  notificationPermissionAction,
  saveSuggestionTemplate,
  removeTemplate,
  hideWorkoutFromLibrary,
  visibleLibraryItems,
  normalizeWeightUnit,
  normalizeSettings,
  roundToHalf,
  lbToKg,
  kgToLb,
  unitLabel,
  formatWeightNumber,
  displayWeightFromLb,
  weightLbFromDisplay,
  convertDisplayedWeight,
  convertLiveExerciseWeights,
  parseRpe,
  suggestProgression,
  formatProgressionHint,
  weeklyVolumeRows,
  remainingSeconds,
  restEndClockLabel,
  restStartNotificationPayload,
  TOP_REP_TARGET,
  PROGRESSION_LB,
  PROGRESSION_KG,
} from "./logic.js";
import { EXERCISE_GUIDES, getExerciseGuide, isGuideComplete } from "./guides.js";

// ─── formatTime ───────────────────────────────────────────────────────────────

describe("formatTime", () => {
  test("formats zero seconds as 0:00", () => {
    assert.equal(formatTime(0), "0:00");
  });

  test("pads single-digit seconds with a leading zero", () => {
    assert.equal(formatTime(65), "1:05");
  });

  test("formats exactly 90 seconds (default rest) as 1:30", () => {
    assert.equal(formatTime(DEFAULT_REST_SECONDS), "1:30");
  });

  test("formats whole minutes with :00", () => {
    assert.equal(formatTime(120), "2:00");
  });

  test("formats 59 seconds as 0:59", () => {
    assert.equal(formatTime(59), "0:59");
  });
});

// ─── handleSetCompletion ──────────────────────────────────────────────────────

describe("handleSetCompletion", () => {
  test("marks a set completed when both weight and reps are filled", () => {
    const set = { weight: "135", reps: "8", completed: false };
    const justCompleted = handleSetCompletion(set);
    assert.equal(set.completed, true);
    assert.equal(justCompleted, true, "should return true to signal rest-timer start");
  });

  test("does not fire again if the set was already completed", () => {
    const set = { weight: "135", reps: "8", completed: true };
    const justCompleted = handleSetCompletion(set);
    assert.equal(set.completed, true);
    assert.equal(justCompleted, false);
  });

  test("marks a set incomplete when weight is cleared", () => {
    const set = { weight: "", reps: "8", completed: true };
    handleSetCompletion(set);
    assert.equal(set.completed, false);
  });

  test("marks a set incomplete when reps is cleared", () => {
    const set = { weight: "135", reps: "", completed: true };
    handleSetCompletion(set);
    assert.equal(set.completed, false);
  });

  test("stays incomplete when both fields are empty", () => {
    const set = { weight: "", reps: "", completed: false };
    const justCompleted = handleSetCompletion(set);
    assert.equal(set.completed, false);
    assert.equal(justCompleted, false);
  });
});

// ─── collectWorkoutData ───────────────────────────────────────────────────────

describe("collectWorkoutData", () => {
  test("converts string weight/reps to numbers", () => {
    const exercises = [
      { name: "Squat", sets: [{ weight: "185", reps: "5" }] },
    ];
    const [ex] = collectWorkoutData(exercises);
    assert.equal(ex.sets[0].weight, 185);
    assert.equal(ex.sets[0].reps, 5);
  });

  test("uses null for empty weight or reps fields", () => {
    const exercises = [
      { name: "Bench Press", sets: [{ weight: "", reps: "" }] },
    ];
    const [ex] = collectWorkoutData(exercises);
    assert.equal(ex.sets[0].weight, null);
    assert.equal(ex.sets[0].reps, null);
  });

  test("numbers sets starting from 1", () => {
    const exercises = [
      {
        name: "Deadlift",
        sets: [
          { weight: "225", reps: "3" },
          { weight: "245", reps: "3" },
          { weight: "265", reps: "1" },
        ],
      },
    ];
    const [ex] = collectWorkoutData(exercises);
    assert.deepEqual(
      ex.sets.map((s) => s.set),
      [1, 2, 3]
    );
  });

  test("handles multiple exercises", () => {
    const exercises = [
      { name: "Squat", sets: [{ weight: "200", reps: "5" }] },
      { name: "OHP", sets: [{ weight: "95", reps: "8" }] },
    ];
    const result = collectWorkoutData(exercises);
    assert.equal(result.length, 2);
    assert.equal(result[0].name, "Squat");
    assert.equal(result[1].name, "OHP");
  });

  test("keeps superset ids on saved sets", () => {
    const exercises = [
      { name: "Squat", supersetId: "ss-1", sets: [{ weight: "200", reps: "5" }] },
      { name: "Bench Press", supersetId: "ss-1", sets: [{ weight: "135", reps: "8" }] },
    ];
    const result = collectWorkoutData(exercises);
    assert.equal(result[0].supersetId, "ss-1");
    assert.equal(result[1].supersetId, "ss-1");
  });

  test("returns an empty array for no exercises", () => {
    assert.deepEqual(collectWorkoutData([]), []);
  });

  test("stores live kg inputs as pounds and keeps optional RPE and notes", () => {
    const exercises = [
      {
        name: "Squat",
        note: " belt ",
        sets: [{ weight: "80", reps: "5", rpe: "8.5" }],
      },
    ];
    const [ex] = collectWorkoutData(exercises, "kg");
    assert.equal(ex.sets[0].weight, kgToLb(80));
    assert.equal(ex.sets[0].rpe, 8.5);
    assert.equal(ex.note, "belt");
  });

  test("pruneUnloggedExercises drops empty leftover sets and skipped lifts", () => {
    const data = collectWorkoutData([
      {
        name: "Bench Press",
        supersetId: "ss-1",
        sets: [
          { weight: "185", reps: "8" },
          { weight: "", reps: "" },
          { weight: "", reps: "" },
        ],
      },
      {
        name: "Squat",
        supersetId: "ss-1",
        sets: [
          { weight: "", reps: "" },
          { weight: "", reps: "" },
          { weight: "", reps: "" },
        ],
      },
    ]);
    const pruned = pruneUnloggedExercises(data);
    assert.equal(pruned.length, 1);
    assert.equal(pruned[0].name, "Bench Press");
    assert.equal(pruned[0].sets.length, 1);
    assert.equal(pruned[0].sets[0].set, 1);
    assert.equal(pruned[0].sets[0].weight, 185);
    assert.equal(pruned[0].supersetId, null);
  });
});

// ─── summarize / names ────────────────────────────────────────────────────────

describe("summarizeExercises", () => {
  test("counts exercises and sets and builds a brief summary", () => {
    const stats = summarizeExercises([
      { name: "Bench Press", sets: [{}, {}, {}] },
      { name: "Squat", sets: [{}, {}] },
    ]);
    assert.equal(stats.exerciseCount, 2);
    assert.equal(stats.setCount, 5);
    assert.equal(stats.summary, "Bench Press · 3 sets · Squat · 2 sets");
  });

  test("handles an empty workout", () => {
    const stats = summarizeExercises([]);
    assert.equal(stats.exerciseCount, 0);
    assert.equal(stats.setCount, 0);
    assert.equal(stats.summary, "");
  });

  test("groups paired lifts as one lineup entry", () => {
    const exercises = [
      { name: "Squat", supersetId: "ss-1", sets: [{}, {}, {}] },
      { name: "Bench Press", supersetId: "ss-1", sets: [{}, {}, {}] },
      { name: "Row", sets: [{}, {}] },
    ];
    const stats = summarizeExercises(exercises);
    assert.equal(stats.summary, "Squat + Bench Press · 3/3 sets · Row · 2 sets");
    assert.equal(formatExerciseLineup(exercises), "Squat + Bench Press · Row");
  });

  test("loggedOnly summary ignores planned sets that were never filled in", () => {
    const stats = summarizeExercises(
      [
        {
          name: "Bench Press",
          sets: [
            { weight: 185, reps: 8 },
            { weight: null, reps: null },
            { weight: null, reps: null },
          ],
        },
        {
          name: "Squat",
          sets: [
            { weight: null, reps: null },
            { weight: null, reps: null },
            { weight: null, reps: null },
          ],
        },
      ],
      { loggedOnly: true }
    );
    assert.equal(stats.exerciseCount, 1);
    assert.equal(stats.setCount, 1);
    assert.equal(stats.summary, "Bench Press · 1 set");
  });
});

describe("displayWorkoutName", () => {
  test("uses the user-given name when present", () => {
    assert.equal(displayWorkoutName({ name: "Push Day", completedAt: "2026-08-24T12:00:00Z" }), "Push Day");
  });

  test("falls back to a relative date for unnamed workouts", () => {
    const now = new Date("2026-08-24T18:00:00");
    assert.equal(
      displayWorkoutName({ name: "  ", completedAt: "2026-08-24T10:00:00" }, now),
      "Today"
    );
  });
});

describe("formatRelativeDate", () => {
  const now = new Date("2026-08-24T12:00:00");

  test("labels today, yesterday, and weekday", () => {
    assert.equal(formatRelativeDate("2026-08-24T08:00:00", now), "Today");
    assert.equal(formatRelativeDate("2026-08-23T08:00:00", now), "Yesterday");
  });
});

// ─── previous sets ────────────────────────────────────────────────────────────

describe("previous sets", () => {
  const history = [
    {
      id: "w2",
      name: "Push Day",
      completedAt: "2026-08-24T12:00:00Z",
      exercises: [
        {
          name: "Bench Press",
          sets: [
            { set: 1, weight: 185, reps: 5 },
            { set: 2, weight: 185, reps: 5 },
            { set: 3, weight: 175, reps: 6 },
          ],
        },
      ],
    },
    {
      id: "w1",
      name: "Push Day",
      completedAt: "2026-08-17T12:00:00Z",
      exercises: [
        {
          name: "Bench Press",
          sets: [
            { set: 1, weight: 175, reps: 6 },
            { set: 2, weight: 175, reps: 6 },
          ],
        },
        {
          name: "Squat",
          sets: [{ set: 1, weight: 225, reps: 5 }],
        },
      ],
    },
  ];

  test("getPreviousSets returns the most recent logged sets for an exercise", () => {
    const prev = getPreviousSets(history, "Bench Press");
    assert.equal(prev.length, 3);
    assert.deepEqual(prev[0], { weight: 185, reps: 5, rpe: null });
    assert.deepEqual(prev[2], { weight: 175, reps: 6, rpe: null });
  });

  test("getPreviousSets skips workouts that did not include the exercise", () => {
    const prev = getPreviousSets(history, "Squat");
    assert.equal(prev.length, 1);
    assert.deepEqual(prev[0], { weight: 225, reps: 5, rpe: null });
  });

  test("getPreviousSets returns null when the exercise has never been logged", () => {
    assert.equal(getPreviousSets(history, "Deadlift"), null);
  });

  test("attachPreviousSets copies previous numbers without filling live values", () => {
    const exercises = [createExercise("Bench Press", 3)];
    const [ex] = attachPreviousSets(exercises, history);
    assert.equal(ex.sets[0].weight, "");
    assert.equal(ex.sets[0].reps, "");
    assert.equal(ex.sets[0].previousWeight, 185);
    assert.equal(ex.sets[0].previousReps, 5);
    assert.equal(ex.sets[2].previousWeight, 175);
  });

  test("applyPreviousSet fills live fields and marks source as previous", () => {
    const set = createEmptySet({ weight: 135, reps: 8 });
    const justCompleted = applyPreviousSet(set);
    assert.equal(set.weight, "135");
    assert.equal(set.reps, "8");
    assert.equal(set.source, "previous");
    assert.equal(set.completed, true);
    assert.equal(justCompleted, true);
    assert.equal(setInputSource(set), "previous");
    assert.equal(fieldInputSource(set, "weight"), "previous");
    assert.equal(fieldInputSource(set, "reps"), "previous");
  });

  test("typing after autofill switches only that field to typed", () => {
    const set = createEmptySet({ weight: 135, reps: 8 });
    applyPreviousSet(set);
    updateSetField(set, "weight", "140");
    assert.equal(set.source, "typed");
    assert.equal(fieldInputSource(set, "weight"), "typed");
    assert.equal(fieldInputSource(set, "reps"), "previous");
    assert.equal(set.previousWeight, 135, "previous hint stays visible");
  });

  test("applyPreviousSet is a no-op without previous data", () => {
    const set = createEmptySet();
    assert.equal(hasPreviousSet(set), false);
    assert.equal(applyPreviousSet(set), false);
    assert.equal(set.weight, "");
    assert.equal(set.source, null);
  });
});

// ─── add / remove sets ────────────────────────────────────────────────────────

describe("addSet / removeSet", () => {
  test("starts with the default set count", () => {
    const ex = createExercise("Squat");
    assert.equal(ex.sets.length, SETS_PER_EXERCISE);
  });

  test("addSet appends an empty set and uses previous data when available", () => {
    const ex = createExercise("Squat", 2, [
      { weight: 225, reps: 5 },
      { weight: 225, reps: 5 },
      { weight: 245, reps: 3 },
    ]);
    addSet(ex);
    assert.equal(ex.sets.length, 3);
    assert.equal(ex.sets[2].weight, "");
    assert.equal(ex.sets[2].previousWeight, 245);
    assert.equal(ex.sets[2].previousReps, 3);
  });

  test("removeSet pops the last set but never goes below 1", () => {
    const ex = createExercise("Squat", 2);
    removeSet(ex);
    assert.equal(ex.sets.length, 1);
    removeSet(ex);
    assert.equal(ex.sets.length, 1);
  });
});

describe("workoutToExercises", () => {
  test("clones exercise names and set counts with empty live values", () => {
    const saved = {
      name: "Leg Day",
      exercises: [
        {
          name: "Squat",
          sets: [
            { set: 1, weight: 225, reps: 5 },
            { set: 2, weight: 245, reps: 3 },
          ],
        },
      ],
    };
    const [ex] = workoutToExercises(saved, [saved]);
    assert.equal(ex.name, "Squat");
    assert.equal(ex.sets.length, 2);
    assert.equal(ex.sets[0].weight, "");
    assert.equal(ex.sets[0].previousWeight, 225);
    assert.equal(ex.sets[1].previousReps, 3);
  });

  test("prefers a saved routine overlay when reusing a history session", () => {
    const saved = {
      name: "Push Day",
      exercises: [{ name: "Bench Press", sets: [{ weight: 185, reps: 5 }] }],
      routine: [{ name: "Dumbbell Bench Press", sets: [{ weight: null, reps: null }, { weight: null, reps: null }] }],
    };
    const [ex] = workoutToExercises(saved, [saved]);
    assert.equal(ex.name, "Dumbbell Bench Press");
    assert.equal(ex.sets.length, 2);
    assert.equal(ex.sets[0].previousWeight, null);
  });

  test("reusing a saved workout keeps order and superset ids", () => {
    const saved = {
      name: "Push",
      exercises: [
        { name: "Squat", supersetId: "ss-1", sets: [{ weight: 225, reps: 5 }] },
        { name: "Bench Press", supersetId: "ss-1", sets: [{ weight: 135, reps: 8 }] },
        { name: "Row", sets: [{ weight: 155, reps: 8 }] },
      ],
    };
    const loaded = workoutToExercises(saved, [saved]);
    assert.deepEqual(
      loaded.map((ex) => ({ name: ex.name, supersetId: ex.supersetId })),
      [
        { name: "Squat", supersetId: "ss-1" },
        { name: "Bench Press", supersetId: "ss-1" },
        { name: "Row", supersetId: null },
      ]
    );
    assert.equal(loaded[0].sets[0].weight, "");
    assert.equal(loaded[0].sets[0].previousWeight, 225);
  });
});

describe("swap / saved routine", () => {
  test("swapExerciseAt replaces the name and keeps the set count", () => {
    const current = [createExercise("Bench Press", 4)];
    const next = swapExerciseAt(current, 0, "Dumbbell Bench Press");
    assert.equal(next[0].name, "Dumbbell Bench Press");
    assert.equal(next[0].sets.length, 4);
    assert.equal(next[0].sets[0].weight, "");
    assert.equal(current[0].name, "Bench Press");
  });

  test("swapExerciseAt refuses a duplicate name", () => {
    const current = [createExercise("Bench Press"), createExercise("Squat")];
    const next = swapExerciseAt(current, 0, "Squat");
    assert.equal(next[0].name, "Bench Press");
  });

  test("structuresEqual detects name or set-count changes", () => {
    const original = exerciseStructure([createExercise("Bench Press", 3)]);
    assert.equal(structuresEqual(original, [{ name: "Bench Press", setCount: 3 }]), true);
    assert.equal(structuresEqual(original, [{ name: "Dumbbell Bench Press", setCount: 3 }]), false);
    assert.equal(structuresEqual(original, [{ name: "Bench Press", setCount: 4 }]), false);
  });

  test("structuresEqual and swap keep superset pairing", () => {
    const current = [
      createExercise("Bench Press", 3, null, { supersetId: "ss-1" }),
      createExercise("Barbell Row", 3, null, { supersetId: "ss-1" }),
    ];
    assert.equal(
      structuresEqual(exerciseStructure(current), [
        { name: "Bench Press", setCount: 3, supersetId: "ss-1" },
        { name: "Barbell Row", setCount: 3, supersetId: "ss-1" },
      ]),
      true
    );
    assert.equal(
      structuresEqual(exerciseStructure(current), [
        { name: "Bench Press", setCount: 3 },
        { name: "Barbell Row", setCount: 3 },
      ]),
      false,
      "unpaired structure is not the same as a superset"
    );
    const unpaired = [
      createExercise("Bench Press", 3),
      createExercise("Barbell Row", 3),
    ];
    assert.equal(structuresEqual(exerciseStructure(current), exerciseStructure(unpaired)), false);
    const swapped = swapExerciseAt(current, 0, "Dumbbell Bench Press");
    assert.equal(swapped[0].supersetId, "ss-1");
    assert.equal(swapped[1].supersetId, "ss-1");
  });

  test("updating a template replaces its exercises without touching history", () => {
    const templates = [{ id: "t1", name: "Upper", exercises: [{ name: "Bench Press", sets: [{}, {}, {}] }] }];
    const workouts = [{ id: "w1", name: "Upper", exercises: [{ name: "Bench Press", sets: [{ weight: 185, reps: 5 }] }] }];
    const next = updateSavedWorkoutRoutine(
      templates,
      workouts,
      { kind: "template", id: "t1" },
      [createExercise("Dumbbell Bench Press", 3)]
    );
    assert.equal(next.templates[0].exercises[0].name, "Dumbbell Bench Press");
    assert.equal(next.workouts[0].exercises[0].name, "Bench Press");
    assert.equal(next.workouts[0].exercises[0].sets[0].weight, 185);
  });

  test("updating a history session stores a routine overlay and keeps logged sets", () => {
    const workouts = [{
      id: "w1",
      name: "Push Day",
      exercises: [{ name: "Bench Press", sets: [{ weight: 185, reps: 5 }] }],
    }];
    const next = updateSavedWorkoutRoutine(
      [],
      workouts,
      { kind: "history", id: "w1" },
      [createExercise("Dumbbell Bench Press", 3)]
    );
    assert.equal(next.workouts[0].exercises[0].name, "Bench Press");
    assert.equal(next.workouts[0].exercises[0].sets[0].weight, 185);
    assert.equal(next.workouts[0].routine[0].name, "Dumbbell Bench Press");
    assert.equal(computePersonalRecords(next.workouts)["Bench Press"].weight, 185);
  });
});

// ─── personal records ─────────────────────────────────────────────────────────

describe("isBetterSet / computePersonalRecords", () => {
  test("higher weight wins even with fewer reps", () => {
    assert.equal(
      isBetterSet({ weight: 190, reps: 1 }, { weight: 185, reps: 8 }),
      true
    );
  });

  test("equal weight prefers more reps", () => {
    assert.equal(
      isBetterSet({ weight: 185, reps: 6 }, { weight: 185, reps: 5 }),
      true
    );
    assert.equal(
      isBetterSet({ weight: 185, reps: 4 }, { weight: 185, reps: 5 }),
      false
    );
  });

  test("ignores completely empty sets", () => {
    assert.equal(isLoggedSet({ weight: null, reps: null }), false);
    assert.equal(isBetterSet({ weight: null, reps: null }, { weight: 135, reps: 8 }), false);
  });

  test("computePersonalRecords tracks the best set per exercise", () => {
    const workouts = [
      {
        name: "A",
        completedAt: "2026-08-01T00:00:00Z",
        exercises: [
          {
            name: "Bench Press",
            sets: [
              { weight: 135, reps: 8 },
              { weight: 155, reps: 5 },
            ],
          },
        ],
      },
      {
        name: "B",
        completedAt: "2026-08-10T00:00:00Z",
        exercises: [
          {
            name: "Bench Press",
            sets: [{ weight: 175, reps: 3 }],
          },
          {
            name: "Squat",
            sets: [{ weight: 225, reps: 5 }],
          },
        ],
      },
    ];
    const prs = computePersonalRecords(workouts);
    assert.equal(prs["Bench Press"].weight, 175);
    assert.equal(prs["Bench Press"].reps, 3);
    assert.equal(prs["Bench Press"].workoutName, "B");
    assert.equal(prs.Squat.weight, 225);
  });

  test("queryPersonalRecords filters by name and sorts alphabetically", () => {
    const records = {
      Squat: { weight: 315, reps: 1, date: "2026-08-01" },
      "Bench Press": { weight: 185, reps: 5, date: "2026-08-02" },
      Deadlift: { weight: 405, reps: 1, date: "2026-08-03" },
    };
    const all = queryPersonalRecords(records, "");
    assert.deepEqual(all.map((r) => r.name), ["Bench Press", "Deadlift", "Squat"]);

    const filtered = queryPersonalRecords(records, "dead");
    assert.equal(filtered.length, 1);
    assert.equal(filtered[0].name, "Deadlift");
  });
});

describe("formatLoad", () => {
  test("formats weight and reps", () => {
    assert.equal(formatLoad(185, 5), "185 lbs × 5 reps");
  });

  test("uses dashes for missing values", () => {
    assert.equal(formatLoad(null, 12), "— × 12 reps");
  });
});

// ─── persistence helpers ──────────────────────────────────────────────────────

describe("storage helpers", () => {
  test("parseStoredState returns empty workouts for invalid input", () => {
    assert.deepEqual(parseStoredState(null).workouts, []);
    assert.deepEqual(parseStoredState("not-json").workouts, []);
    assert.deepEqual(parseStoredState("{}").workouts, []);
  });

  test("serialize then parse round-trips workouts", () => {
    const workouts = [{ id: "1", name: "Push", exercises: [] }];
    const parsed = parseStoredState(serializeState(workouts));
    assert.deepEqual(parsed.workouts, workouts);
  });

  test("saveCompletedWorkout prepends a named session", () => {
    const next = saveCompletedWorkout([], {
      id: "abc",
      name: " Push Day ",
      completedAt: "2026-08-24T00:00:00Z",
      exercises: [{ name: "Bench Press", sets: [] }],
    });
    assert.equal(next.length, 1);
    assert.equal(next[0].name, "Push Day");
    assert.equal(next[0].id, "abc");
  });

  test("renameWorkout updates only the matching session", () => {
    const workouts = [
      { id: "a", name: "Old" },
      { id: "b", name: "Keep" },
    ];
    const next = renameWorkout(workouts, "a", "New Name");
    assert.equal(next[0].name, "New Name");
    assert.equal(next[1].name, "Keep");
  });
});

describe("export / import", () => {
  const sample = [
    {
      id: "w1",
      name: "Push Day",
      completedAt: "2026-08-24T12:00:00Z",
      exercises: [{ name: "Bench Press", sets: [{ set: 1, weight: 135, reps: 8 }] }],
    },
  ];

  test("exportFilename uses a calendar date", () => {
    assert.equal(exportFilename(new Date("2026-08-25T15:00:00")), "workout-tracker-2026-08-25.json");
  });

  test("buildExportPayload wraps workouts with app metadata", () => {
    const payload = buildExportPayload(sample, "2026-08-25T00:00:00Z");
    assert.equal(payload.app, "workout-tracker");
    assert.equal(payload.version, EXPORT_FORMAT_VERSION);
    assert.equal(payload.exportedAt, "2026-08-25T00:00:00Z");
    assert.equal(payload.workouts[0].id, "w1");
  });

  test("parseImportPayload reads the backup format", () => {
    const json = JSON.stringify(buildExportPayload(sample, "2026-08-25T00:00:00Z"));
    const parsed = parseImportPayload(json);
    assert.equal(parsed.ok, true);
    assert.equal(parsed.workouts.length, 1);
    assert.equal(parsed.workouts[0].name, "Push Day");
  });

  test("parseImportPayload also accepts a raw { workouts } blob", () => {
    const parsed = parseImportPayload(JSON.stringify({ workouts: sample }));
    assert.equal(parsed.ok, true);
    assert.equal(parsed.workouts[0].id, "w1");
  });

  test("parseImportPayload rejects junk", () => {
    const badJson = parseImportPayload("{not json");
    assert.equal(badJson.ok, false);
    const wrongShape = parseImportPayload(JSON.stringify({ foo: 1 }));
    assert.equal(wrongShape.ok, false);
  });

  test("parseImportPayload assigns ids when a backup omitted them", () => {
    const parsed = parseImportPayload(
      JSON.stringify({
        workouts: [{ name: "Unnamed", exercises: [], completedAt: "2026-08-01T00:00:00Z" }],
      })
    );
    assert.equal(parsed.ok, true);
    assert.ok(parsed.workouts[0].id);
  });

  test("mergeWorkouts adds new ids and skips duplicates", () => {
    const existing = sample;
    const incoming = [
      sample[0],
      {
        id: "w2",
        name: "Leg Day",
        completedAt: "2026-08-25T12:00:00Z",
        exercises: [{ name: "Squat", sets: [{ set: 1, weight: 225, reps: 5 }] }],
      },
    ];
    const result = mergeWorkouts(existing, incoming);
    assert.equal(result.added, 1);
    assert.equal(result.skipped, 1);
    assert.equal(result.workouts.length, 2);
    assert.equal(result.workouts[0].id, "w2", "newest first");
  });
});

describe("exercise catalog / muscle filter", () => {
  test("keeps the original exercise names", () => {
    const names = EXERCISES.map((ex) => ex.name);
    for (const name of [
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
    ]) {
      assert.ok(names.includes(name), `missing ${name}`);
    }
  });

  test("every exercise has a known muscle group", () => {
    const ids = new Set(MUSCLE_GROUPS.map((g) => g.id));
    for (const ex of EXERCISES) {
      assert.ok(ids.has(ex.muscle), `${ex.name} has unknown muscle ${ex.muscle}`);
    }
  });

  test("exercise names are unique", () => {
    const names = EXERCISES.map((ex) => ex.name);
    assert.equal(names.length, new Set(names).size);
  });

  test("unknown muscle id yields no exercises", () => {
    assert.deepEqual(filterExercisesByMuscle(EXERCISES, "forearms"), []);
  });

  test("filterExercisesByMuscle returns only that muscle, or all when unset", () => {
    const chest = filterExercisesByMuscle(EXERCISES, "chest");
    assert.ok(chest.length > 0);
    assert.ok(chest.every((ex) => ex.muscle === "chest"));
    assert.ok(chest.some((ex) => ex.name === "Bench Press"));
    assert.equal(filterExercisesByMuscle(EXERCISES, null).length, EXERCISES.length);
  });

  test("groupExercisesByMuscle follows catalog order and sorts names", () => {
    const groups = groupExercisesByMuscle(EXERCISES);
    assert.equal(groups[0].id, "chest");
    const chestNames = groups[0].exercises.map((ex) => ex.name);
    assert.deepEqual(chestNames, [...chestNames].sort((a, b) => a.localeCompare(b)));
    assert.ok(MUSCLE_GROUPS.every((g) => groups.some((listed) => listed.id === g.id)));
  });

  test("getMuscleForExercise maps names to groups", () => {
    assert.equal(getMuscleForExercise("Squat"), "quads");
    assert.equal(getMuscleLabel("quads"), "Quads");
    assert.equal(getMuscleForExercise("Unknown Move"), null);
  });

  test("filterRecordsByMuscle keeps matching PR names", () => {
    const records = [
      { name: "Bench Press", weight: 185, reps: 5 },
      { name: "Squat", weight: 315, reps: 1 },
      { name: "Mystery Lift", weight: 90, reps: 10 },
    ];
    const chest = filterRecordsByMuscle(records, "chest");
    assert.deepEqual(chest.map((r) => r.name), ["Bench Press"]);
    assert.equal(filterRecordsByMuscle(records, null).length, 3);
  });
});

describe("equipment filter", () => {
  const allowed = new Set(EQUIPMENT.map((item) => item.id));

  test("every exercise has at least one known equipment tag", () => {
    for (const ex of EXERCISES) {
      assert.ok(Array.isArray(ex.equipment) && ex.equipment.length, `${ex.name} missing equipment`);
      assert.ok(ex.equipment.every((id) => allowed.has(id)), `${ex.name} has unknown equipment`);
    }
  });

  test("bodyweight-only catalog still includes push-ups and squats via bodyweight tags", () => {
    const filtered = filterExercisesByEquipment(EXERCISES, ["bodyweight"]);
    const names = filtered.map((ex) => ex.name);
    assert.ok(names.includes("Push-ups"));
    assert.ok(names.includes("Plank"));
    assert.ok(!names.includes("Bench Press"));
    assert.ok(!names.includes("Lat Pulldown"));
  });

  test("dumbbell-only keeps dumbbell bench and drops barbell bench", () => {
    const filtered = filterCatalog(EXERCISES, "chest", ["dumbbell"]);
    const names = filtered.map((ex) => ex.name);
    assert.ok(names.includes("Dumbbell Bench Press"));
    assert.ok(!names.includes("Bench Press"));
  });

  test("toggle from all isolates that type; never allows an empty selection", () => {
    const all = defaultEquipmentIds();
    assert.equal(hasAllEquipment(all), true);
    assert.deepEqual(toggleEquipmentId(all, "dumbbell"), ["dumbbell"]);
    assert.deepEqual(toggleEquipmentId(["dumbbell"], "bodyweight").sort(), ["bodyweight", "dumbbell"]);
    assert.deepEqual(toggleEquipmentId(["dumbbell"], "dumbbell"), all);
  });
});

describe("rest timer helpers", () => {
  test("presets are 1:00, 1:30, and 2:00", () => {
    assert.deepEqual(REST_PRESETS, [60, 90, 120]);
  });

  test("adjustTimerSeconds clamps and steps by 15", () => {
    assert.equal(adjustTimerSeconds(90, TIMER_ADJUST_SECONDS), 105);
    assert.equal(adjustTimerSeconds(10, -TIMER_ADJUST_SECONDS), 0);
    assert.equal(adjustTimerSeconds(590, 15), 600);
  });
});

describe("suggested workouts", () => {
  test("with no recent sessions offers full / upper / lower templates", () => {
    const suggestions = suggestWorkouts([], { now: new Date("2026-08-24T12:00:00Z") });
    assert.deepEqual(suggestions.map((s) => s.kind), ["fullBody", "upper", "lower"]);
    assert.ok(suggestions.every((s) => s.exercises.length >= 6));
  });

  const TEMPLATE_BY_EQUIPMENT = {
    all: {
      fullBody: ["Squat", "Bench Press", "Romanian Deadlift", "Barbell Row", "Overhead Press", "Plank"],
      upper: ["Bench Press", "Barbell Row", "Overhead Press", "Pull-ups", "Lateral Raise", "Dumbbell Curl", "Tricep Pushdown"],
      lower: ["Squat", "Romanian Deadlift", "Bulgarian Split Squat", "Hip Thrust", "Lying Leg Curl", "Standing Calf Raise"],
    },
    dumbbell: {
      fullBody: ["Goblet Squat", "Dumbbell Bench Press", "Dumbbell Romanian Deadlift", "Dumbbell Row", "Dumbbell Shoulder Press", "Dumbbell Sit-up"],
      upper: ["Dumbbell Bench Press", "Dumbbell Row", "Dumbbell Shoulder Press", "Dumbbell Pullover", "Lateral Raise", "Dumbbell Curl", "Overhead Tricep Extension"],
      lower: ["Goblet Squat", "Dumbbell Romanian Deadlift", "Bulgarian Split Squat", "Dumbbell Hip Thrust", "Single-Leg Romanian Deadlift", "Standing Calf Raise"],
    },
    bodyweight: {
      fullBody: ["Bulgarian Split Squat", "Push-ups", "Single-Leg Romanian Deadlift", "Inverted Row", "Pike Push-ups", "Plank"],
      upper: ["Push-ups", "Inverted Row", "Pike Push-ups", "Towel Row", "Prone Y Raise", "Towel Curl", "Tricep Dips"],
      lower: ["Bulgarian Split Squat", "Single-Leg Romanian Deadlift", "Walking Lunge", "Single-Leg Glute Bridge", "Nordic Curl", "Standing Calf Raise"],
    },
    barbell: {
      fullBody: ["Squat", "Bench Press", "Romanian Deadlift", "Barbell Row", "Overhead Press", "Barbell Rollout"],
      upper: ["Bench Press", "Barbell Row", "Overhead Press", "T-Bar Row", "Upright Row", "Barbell Curl", "Close-Grip Bench Press"],
      lower: ["Squat", "Romanian Deadlift", "Bulgarian Split Squat", "Hip Thrust", "Stiff-Leg Deadlift", "Standing Calf Raise"],
    },
    machine: {
      fullBody: ["Hack Squat", "Chest Press Machine", "Back Extension", "Machine Row", "Shoulder Press Machine", "Ab Crunch Machine"],
      upper: ["Chest Press Machine", "Machine Row", "Shoulder Press Machine", "Assisted Pull-up", "Machine Lateral Raise", "Machine Curl", "Machine Tricep Extension"],
      lower: ["Hack Squat", "Back Extension", "Leg Press", "Hip Abduction", "Lying Leg Curl", "Standing Calf Raise"],
    },
    cable: {
      fullBody: ["Cable Squat", "Cable Chest Press", "Cable Pull-Through", "Seated Cable Row", "Cable Shoulder Press", "Cable Crunch"],
      upper: ["Cable Chest Press", "Seated Cable Row", "Cable Shoulder Press", "Lat Pulldown", "Cable Lateral Raise", "Cable Curl", "Tricep Pushdown"],
      lower: ["Cable Squat", "Cable Pull-Through", "Cable Lunge", "Cable Kickback", "Cable Leg Curl", "Cable Calf Raise"],
    },
  };

  function equipmentFor(id) {
    return id === "all" ? defaultEquipmentIds() : [id];
  }

  function namesOf(kind, equipmentIds) {
    return buildSplitWorkout(kind, equipmentIds).map((ex) => ex.name);
  }

  for (const [filterId, expected] of Object.entries(TEMPLATE_BY_EQUIPMENT)) {
    test(`${filterId} filter keeps complete Full / Upper / Lower substitutions`, () => {
      const equipmentIds = equipmentFor(filterId);
      assert.deepEqual(namesOf("fullBody", equipmentIds), expected.fullBody);
      assert.deepEqual(namesOf("upper", equipmentIds), expected.upper);
      assert.deepEqual(namesOf("lower", equipmentIds), expected.lower);

      const suggestions = suggestWorkouts([], {
        equipmentIds,
        now: new Date("2026-08-24T12:00:00Z"),
      });
      assert.equal(suggestions.length, 3);
      assert.deepEqual(
        suggestions.map((item) => item.exercises.map((ex) => ex.name)),
        [expected.fullBody, expected.upper, expected.lower]
      );

      if (filterId === "all") return;
      for (const item of suggestions.flatMap((s) => s.exercises)) {
        const catalog = EXERCISES.find((ex) => ex.name === item.name);
        assert.ok(catalog, `missing catalog entry for ${item.name}`);
        assert.equal(
          exerciseMatchesEquipment(catalog, equipmentIds),
          true,
          `${item.name} is not valid for ${filterId}`
        );
      }
    });
  }

  test("bodyweight-only suggestions do not assume a pull-up bar", () => {
    const names = ["fullBody", "upper", "lower"].flatMap((kind) =>
      namesOf(kind, ["bodyweight"])
    );
    for (const banned of ["Pull-ups", "Chin-ups", "Hanging Leg Raise"]) {
      assert.ok(!names.includes(banned), `bodyweight suggestion should not include ${banned}`);
    }
    assert.ok(names.includes("Inverted Row"));
    assert.ok(names.includes("Towel Row"));
    const catalog = filterExercisesByEquipment(EXERCISES, ["bodyweight"]).map((ex) => ex.name);
    assert.ok(catalog.includes("Pull-ups"), "pull-ups stay in the bodyweight list for people who have a bar");
  });

  test("templates pair antagonist / non-competing supersets by default", () => {
    const upper = buildSplitWorkout("upper", defaultEquipmentIds());
    assert.equal(upper[0].supersetId, upper[1].supersetId, "horizontal push/pull");
    assert.equal(upper[2].supersetId, upper[3].supersetId, "vertical push/pull");
    assert.equal(upper[4].supersetId, null, "laterals stay standalone");
    assert.equal(upper[5].supersetId, upper[6].supersetId, "biceps/triceps");
    assert.ok(upper[0].supersetId !== upper[2].supersetId);

    const full = buildSplitWorkout("fullBody", defaultEquipmentIds());
    assert.equal(full[0].supersetId, full[1].supersetId, "squat + horizontal press");
    assert.equal(full[2].supersetId, full[3].supersetId, "hinge + row");
    assert.equal(full[4].supersetId, full[5].supersetId, "press + core");

    const lower = buildSplitWorkout("lower", defaultEquipmentIds());
    assert.equal(lower[0].supersetId, lower[1].supersetId);
    assert.equal(lower[2].supersetId, lower[3].supersetId);
    assert.equal(lower[4].supersetId, lower[5].supersetId);
  });

  test("personalized suggestions pair antagonist muscles", () => {
    const workouts = [
      {
        id: "w1",
        name: "Push",
        completedAt: "2026-08-23T18:00:00Z",
        exercises: [{ name: "Bench Press", sets: [{ weight: 135, reps: 8 }, { weight: 135, reps: 8 }, { weight: 135, reps: 8 }] }],
      },
    ];
    const suggestions = suggestWorkouts(workouts, { now: new Date("2026-08-24T12:00:00Z") });
    assert.equal(suggestions[0].kind, "personalized");
    const paired = suggestions[0].exercises.filter((ex) => ex.supersetId);
    assert.ok(paired.length >= 2);
    const ids = new Set(paired.map((ex) => ex.supersetId));
    for (const id of ids) {
      assert.equal(paired.filter((ex) => ex.supersetId === id).length, 2);
    }
  });

  test("restricted filters never keep a barbell-only compound", () => {
    for (const id of ["dumbbell", "bodyweight", "machine", "cable"]) {
      const names = ["fullBody", "upper", "lower"]
        .flatMap((kind) => namesOf(kind, [id]));
      for (const banned of ["Squat", "Bench Press", "Deadlift", "Barbell Row"]) {
        assert.ok(!names.includes(banned), `${id} should not include ${banned}`);
      }
    }
  });

  test("recent history yields one personalized session that skips a recovering muscle", () => {
    const workouts = [
      {
        id: "w1",
        name: "Push",
        completedAt: "2026-08-23T18:00:00Z",
        exercises: [
          {
            name: "Bench Press",
            sets: [
              { weight: 135, reps: 8 },
              { weight: 135, reps: 8 },
              { weight: 135, reps: 8 },
            ],
          },
        ],
      },
    ];
    const suggestions = suggestWorkouts(workouts, { now: new Date("2026-08-24T12:00:00Z") });
    assert.equal(suggestions.length, 1);
    assert.equal(suggestions[0].kind, "personalized");
    assert.ok(suggestions[0].exercises.length >= 4);
    assert.ok(!suggestions[0].exercises.some((ex) => ex.name === "Bench Press"));
  });

  test("sessions older than the lookback window still get the three templates", () => {
    const workouts = [
      {
        id: "old",
        completedAt: "2026-08-01T12:00:00Z",
        exercises: [{ name: "Squat", sets: [{ weight: 185, reps: 5 }] }],
      },
    ];
    const now = new Date("2026-08-24T12:00:00Z");
    const ageDays = (now - new Date(workouts[0].completedAt)) / 86400000;
    assert.ok(ageDays > LOOKBACK_DAYS);
    const suggestions = suggestWorkouts(workouts, { now });
    assert.equal(suggestions.length, 3);
  });
});

describe("supersets and rest-timer gating", () => {
  test("togglePairWithNext pairs then unpairs adjacent lifts", () => {
    const paired = togglePairWithNext(
      [createExercise("Squat"), createExercise("Bench Press"), createExercise("Row")],
      0
    );
    assert.ok(paired[0].supersetId);
    assert.equal(paired[0].supersetId, paired[1].supersetId);
    assert.equal(paired[2].supersetId, null);
    const unpaired = togglePairWithNext(paired, 0);
    assert.equal(unpaired[0].supersetId, null);
    assert.equal(unpaired[1].supersetId, null);
  });

  test("pairing a lift already in a superset breaks the old pair", () => {
    let list = togglePairWithNext(
      [createExercise("A"), createExercise("B"), createExercise("C")],
      0
    );
    list = togglePairWithNext(list, 1);
    assert.equal(list[0].supersetId, null);
    assert.equal(list[1].supersetId, list[2].supersetId);
    assert.ok(list[1].supersetId);
  });

  test("moving a standalone skips over a superset without unpairing", () => {
    const list = moveWorkoutBlock(
      [
        createExercise("Row"),
        createExercise("Squat", 3, null, { supersetId: "ss-1" }),
        createExercise("Bench Press", 3, null, { supersetId: "ss-1" }),
      ],
      0,
      1
    );
    assert.deepEqual(
      list.map((ex) => ex.name),
      ["Squat", "Bench Press", "Row"]
    );
    assert.equal(list[0].supersetId, "ss-1");
    assert.equal(list[1].supersetId, "ss-1");
    assert.equal(list[2].supersetId, null);
  });

  test("moving a superset block past a standalone keeps the pair", () => {
    const list = moveWorkoutBlock(
      [
        createExercise("Squat", 3, null, { supersetId: "ss-1" }),
        createExercise("Bench Press", 3, null, { supersetId: "ss-1" }),
        createExercise("Row"),
      ],
      0,
      1
    );
    assert.deepEqual(
      list.map((ex) => ex.name),
      ["Row", "Squat", "Bench Press"]
    );
    assert.equal(list[1].supersetId, list[2].supersetId);
    assert.equal(list[0].supersetId, null);
  });

  test("moveExercise on either lift in a pair moves the whole block", () => {
    const start = [
      createExercise("Row"),
      createExercise("Squat", 3, null, { supersetId: "ss-1" }),
      createExercise("Bench Press", 3, null, { supersetId: "ss-1" }),
    ];
    const fromFirst = moveExercise(start, 1, -1);
    const fromSecond = moveExercise(start, 2, -1);
    assert.deepEqual(
      fromFirst.map((ex) => ex.name),
      ["Squat", "Bench Press", "Row"]
    );
    assert.deepEqual(
      fromSecond.map((ex) => ex.name),
      ["Squat", "Bench Press", "Row"]
    );
    assert.equal(fromFirst[0].supersetId, fromFirst[1].supersetId);
    assert.equal(fromFirst[2].supersetId, null);
  });

  test("swapSupersetPartners flips order inside the pair", () => {
    const list = swapSupersetPartners(
      [
        createExercise("Squat", 3, null, { supersetId: "ss-1" }),
        createExercise("Bench Press", 3, null, { supersetId: "ss-1" }),
        createExercise("Row"),
      ],
      0
    );
    assert.deepEqual(
      list.map((ex) => ex.name),
      ["Bench Press", "Squat", "Row"]
    );
    assert.equal(list[0].supersetId, "ss-1");
    assert.equal(list[1].supersetId, "ss-1");
  });

  test("dropTargetIndex inserts before or after without splitting blocks", () => {
    assert.equal(dropTargetIndex(0, 2, "after"), 2);
    assert.equal(dropTargetIndex(0, 2, "before"), 1);
    assert.equal(dropTargetIndex(2, 0, "before"), 0);
    assert.equal(dropTargetIndex(2, 0, "after"), 1);
    assert.equal(dropTargetIndex(1, 1, "after"), 1);
  });

  test("dropPlaceFromOffset uses the hovered half of a block", () => {
    assert.equal(dropPlaceFromOffset(10, 100), "before");
    assert.equal(dropPlaceFromOffset(60, 100), "after");
  });

  test("dropWorkoutBlock can drag a pair past a standalone as one unit", () => {
    const list = dropWorkoutBlock(
      [
        createExercise("Squat", 3, null, { supersetId: "ss-1" }),
        createExercise("Bench Press", 3, null, { supersetId: "ss-1" }),
        createExercise("Row"),
      ],
      0,
      1,
      "after"
    );
    assert.deepEqual(
      list.map((ex) => ex.name),
      ["Row", "Squat", "Bench Press"]
    );
    assert.equal(list[1].supersetId, list[2].supersetId);
  });

  test("reordering and pairing keep logged set values", () => {
    const squat = createExercise("Squat", 2, null, { supersetId: "ss-1" });
    squat.sets[0].weight = "225";
    squat.sets[0].reps = "5";
    squat.sets[0].completed = true;
    const bench = createExercise("Bench Press", 2, null, { supersetId: "ss-1" });
    bench.sets[0].weight = "135";
    const row = createExercise("Row");
    row.sets[0].weight = "155";
    const moved = moveWorkoutBlock([squat, bench, row], 0, 1);
    assert.equal(moved[1].name, "Squat");
    assert.equal(moved[1].sets[0].weight, "225");
    assert.equal(moved[1].sets[0].completed, true);
    assert.equal(moved[0].sets[0].weight, "155");
    const unpaired = togglePairWithNext(moved, 1);
    assert.equal(unpaired[1].sets[0].weight, "225");
    assert.equal(unpaired[1].supersetId, null);
    assert.equal(canPairWithNext(unpaired, 1), true);
    assert.equal(canPairWithNext(moved, 1), false);
  });

  test("normalizeSupersetAdjacency drops orphan ids", () => {
    const cleaned = normalizeSupersetAdjacency([
      createExercise("Squat", 3, null, { supersetId: "ss-1" }),
      createExercise("Row"),
      createExercise("Bench Press", 3, null, { supersetId: "ss-1" }),
    ]);
    assert.equal(cleaned[0].supersetId, null);
    assert.equal(cleaned[2].supersetId, null);
  });

  test("groupedWorkoutItems yields adjacent pairs", () => {
    const groups = groupedWorkoutItems([
      createExercise("Squat", 3, null, { supersetId: "ss-1" }),
      createExercise("Bench Press", 3, null, { supersetId: "ss-1" }),
      createExercise("Row"),
    ]);
    assert.equal(groups.length, 2);
    assert.equal(groups[0].kind, "superset");
    assert.deepEqual(groups[0].indices, [0, 1]);
    assert.equal(groups[1].kind, "single");
  });

  test("standalone completed sets start rest immediately", () => {
    const squat = createExercise("Squat");
    squat.sets[0].completed = true;
    assert.equal(shouldStartRestTimer([squat], 0, 0), true);
    squat.sets[0].completed = false;
    assert.equal(shouldStartRestTimer([squat], 0, 0), false);
  });

  test("superset rest waits until both partners finish that set", () => {
    const squat = createExercise("Squat", 2, null, { supersetId: "ss-1" });
    const bench = createExercise("Bench Press", 2, null, { supersetId: "ss-1" });
    squat.sets[0].completed = true;
    assert.equal(shouldStartRestTimer([squat, bench], 0, 0), false);
    bench.sets[0].completed = true;
    assert.equal(shouldStartRestTimer([squat, bench], 0, 0), true);
    assert.equal(shouldStartRestTimer([squat, bench], 1, 0), true);
    squat.sets[1].completed = true;
    assert.equal(shouldStartRestTimer([squat, bench], 0, 1), false);
  });

  test("rest notification copy names the next round", () => {
    const squat = createExercise("Squat", 2, null, { supersetId: "ss-1" });
    const bench = createExercise("Bench Press", 2, null, { supersetId: "ss-1" });
    const mid = restNotificationPayload([squat, bench], 1, 0);
    assert.equal(mid.title, "Rest over");
    assert.equal(mid.body, "Next round: Squat + Bench Press.");
    const last = restNotificationPayload([squat, bench], 0, 1);
    assert.match(last.body, /Squat \+ Bench Press is done/);
    const solo = restNotificationPayload([createExercise("Row", 3)], 0, 0);
    assert.equal(solo.body, "Time for Row, set 2.");
  });

  test("notificationPermissionAction only requests when enabled and undecided", () => {
    assert.equal(notificationPermissionAction("default", true), "request");
    assert.equal(notificationPermissionAction("granted", true), "notify");
    assert.equal(notificationPermissionAction("denied", true), "blocked");
    assert.equal(notificationPermissionAction("default", false), "skip");
  });

  test("saving a suggestion keeps superset structure", () => {
    const suggestion = {
      name: "Upper",
      exercises: [
        { name: "Bench Press", setCount: 3, supersetId: "ss-1" },
        { name: "Barbell Row", setCount: 3, supersetId: "ss-1" },
        { name: "Lateral Raise", setCount: 3 },
      ],
    };
    const [template] = saveSuggestionTemplate([], suggestion, new Date("2026-08-24T12:00:00Z"));
    assert.equal(template.exercises[0].supersetId, "ss-1");
    assert.equal(template.exercises[1].supersetId, "ss-1");
    assert.equal(template.exercises[2].supersetId, null);
    const loaded = workoutToExercises(template, []);
    assert.equal(loaded[0].supersetId, loaded[1].supersetId);
  });
});

describe("saved library hide / templates", () => {
  const history = [
    {
      id: "w1",
      name: "Push Day",
      completedAt: "2026-08-20T12:00:00Z",
      exercises: [{ name: "Bench Press", sets: [{ weight: 135, reps: 8 }] }],
    },
  ];

  test("hiding a workout removes it from the library but not from the history array", () => {
    const hidden = hideWorkoutFromLibrary([], "w1");
    const listed = visibleLibraryItems(history, hidden, []);
    assert.equal(listed.length, 0);
    assert.equal(history.length, 1);
    assert.equal(computePersonalRecords(history)["Bench Press"].weight, 135);
  });

  test("saving a suggestion adds a template that can be removed without touching history", () => {
    const suggestion = {
      name: "Full body",
      exercises: [{ name: "Push-ups", setCount: 3 }],
    };
    const templates = saveSuggestionTemplate([], suggestion, new Date("2026-08-24T12:00:00Z"));
    assert.equal(templates.length, 1);
    assert.equal(templates[0].name, "Full body");
    assert.equal(templates[0].exercises[0].sets.length, 3);
    const listed = visibleLibraryItems(history, [], templates);
    assert.equal(listed[0].kind, "template");
    assert.equal(visibleLibraryItems(history, [], removeTemplate(templates, templates[0].id)).length, 1);
  });
});

describe("storage extras", () => {
  test("serializeState keeps hidden ids, templates, and rest settings", () => {
    const parsed = parseStoredState(
      serializeState({
        workouts: [{ id: "1", name: "Push", exercises: [] }],
        hiddenIds: ["1"],
        templates: [{ id: "t1", name: "Upper", exercises: [] }],
        settings: { restSeconds: 120, equipmentIds: ["dumbbell"] },
      })
    );
    assert.deepEqual(parsed.hiddenIds, ["1"]);
    assert.equal(parsed.templates[0].id, "t1");
    assert.equal(parsed.settings.restSeconds, 120);
    assert.deepEqual(parsed.settings.equipmentIds, ["dumbbell"]);
    assert.equal(parsed.settings.notifyRest, true);
    assert.equal(parsed.settings.weightUnit, "lb");
  });

  test("weightUnit persists and unknown values fall back to lb", () => {
    const parsed = parseStoredState(
      serializeState({
        workouts: [],
        settings: { restSeconds: 90, equipmentIds: ["dumbbell"], weightUnit: "kg" },
      })
    );
    assert.equal(parsed.settings.weightUnit, "kg");
    const legacy = parseStoredState(JSON.stringify({ workouts: [], settings: { restSeconds: 90 } }));
    assert.equal(legacy.settings.weightUnit, "lb");
  });

  test("notifyRest can be turned off and missing values default on", () => {
    const parsed = parseStoredState(
      serializeState({
        workouts: [],
        settings: { restSeconds: 90, equipmentIds: ["dumbbell"], notifyRest: false },
      })
    );
    assert.equal(parsed.settings.notifyRest, false);
    const legacy = parseStoredState(JSON.stringify({ workouts: [], settings: { restSeconds: 90 } }));
    assert.equal(legacy.settings.notifyRest, true);
  });

  test("unknown rest values fall back to the 90s default", () => {
    const parsed = parseStoredState(
      JSON.stringify({ workouts: [], settings: { restSeconds: 45, equipmentIds: ["laser"] } })
    );
    assert.equal(parsed.settings.restSeconds, 90);
    assert.deepEqual(parsed.settings.equipmentIds, defaultEquipmentIds());
  });
});

describe("exercise form guides", () => {
  test("every catalog lift has a complete guide", () => {
    const names = EXERCISES.map((ex) => ex.name);
    assert.equal(Object.keys(EXERCISE_GUIDES).length, names.length);
    for (const name of names) {
      const guide = getExerciseGuide(name);
      assert.ok(guide, `missing guide for ${name}`);
      assert.equal(isGuideComplete(guide), true, `incomplete guide for ${name}`);
    }
  });

  test("unknown names have no guide", () => {
    assert.equal(getExerciseGuide("Laser Curl"), null);
    assert.equal(getExerciseGuide(""), null);
  });

  test("bench press covers a tucked-elbow path and no bounce", () => {
    const guide = getExerciseGuide("Bench Press");
    assert.match(guide.summary, /chest/i);
    assert.ok(guide.steps.some((step) => /45|tuck|elbow/i.test(step)));
    assert.ok(guide.mistakes.some((item) => /bounc/i.test(item)));
  });
});

describe("weight units", () => {
  test("defaults to pounds and accepts kg", () => {
    assert.equal(normalizeWeightUnit("kg"), "kg");
    assert.equal(normalizeWeightUnit("lb"), "lb");
    assert.equal(normalizeWeightUnit("stones"), "lb");
    assert.equal(normalizeSettings({}).weightUnit, "lb");
    assert.equal(normalizeSettings({ weightUnit: "kg" }).weightUnit, "kg");
  });

  test("round-trips common gym loads through kg", () => {
    assert.equal(roundToHalf(83.9), 84);
    assert.equal(lbToKg(185), 84);
    assert.equal(kgToLb(80), 176.5);
    assert.equal(lbToKg(kgToLb(80)), 80);
    assert.equal(kgToLb(lbToKg(185)), 185);
    assert.equal(unitLabel("kg"), "kg");
    assert.equal(unitLabel("lb"), "lbs");
    assert.equal(formatWeightNumber(185, "lb"), "185");
    assert.equal(formatWeightNumber(185, "kg"), "84");
    assert.equal(displayWeightFromLb(135, "kg"), "61");
    assert.equal(weightLbFromDisplay("80", "kg"), 176.5);
    assert.equal(weightLbFromDisplay("185", "lb"), 185);
  });

  test("converts a live typed weight when switching units", () => {
    assert.equal(convertDisplayedWeight("185", "lb", "kg"), "84");
    assert.equal(convertDisplayedWeight("80", "kg", "lb"), "176.5");
    assert.equal(convertDisplayedWeight("", "lb", "kg"), "");
    const [ex] = convertLiveExerciseWeights(
      [{ name: "Squat", sets: [{ weight: "185", reps: "5" }] }],
      "lb",
      "kg"
    );
    assert.equal(ex.sets[0].weight, "84");
    assert.equal(ex.sets[0].reps, "5");
  });

  test("formatLoad can show kilograms without changing stored pounds", () => {
    assert.equal(formatLoad(185, 5), "185 lbs × 5 reps");
    assert.equal(formatLoad(185, 5, "kg"), "84 kg × 5 reps");
  });

  test("applyPreviousSet converts previous pounds into the live unit", () => {
    const set = createEmptySet({ weight: 135, reps: 8 });
    applyPreviousSet(set, "kg");
    assert.equal(set.weight, "61");
    assert.equal(set.reps, "8");
    assert.equal(set.source, "previous");
  });
});

describe("progression hints", () => {
  test("adds a small load bump after hitting the top of the rep range", () => {
    const next = suggestProgression(185, TOP_REP_TARGET, "lb");
    assert.equal(next.bumped, "weight");
    assert.equal(next.weightLb, 185 + PROGRESSION_LB);
    assert.equal(next.reps, 8);
    assert.equal(formatProgressionHint(next, "lb"), "Try 190 lbs × 8 reps");
  });

  test("adds a rep when last time was under the top of the range", () => {
    const next = suggestProgression(185, 6, "lb");
    assert.equal(next.bumped, "reps");
    assert.equal(next.weightLb, 185);
    assert.equal(next.reps, 7);
  });

  test("bumps 2.5 kg when the display unit is kilograms", () => {
    const next = suggestProgression(kgToLb(80), 8, "kg");
    assert.equal(next.bumped, "weight");
    assert.equal(lbToKg(next.weightLb), 80 + PROGRESSION_KG);
    assert.match(formatProgressionHint(next, "kg"), /82\.5 kg × 8 reps/);
  });

  test("returns null without a previous load", () => {
    assert.equal(suggestProgression(null, 8, "lb"), null);
    assert.equal(formatProgressionHint(null), "");
  });
});

describe("weekly volume", () => {
  test("counts logged sets per muscle in the last 7 days", () => {
    const now = new Date("2026-08-28T12:00:00Z");
    const rows = weeklyVolumeRows(
      [
        {
          completedAt: "2026-08-27T12:00:00Z",
          exercises: [
            { name: "Bench Press", sets: [{ weight: 185, reps: 5 }, { weight: 185, reps: 5 }] },
            { name: "Squat", sets: [{ weight: 225, reps: 5 }] },
          ],
        },
        {
          completedAt: "2026-08-01T12:00:00Z",
          exercises: [{ name: "Deadlift", sets: [{ weight: 315, reps: 3 }] }],
        },
      ],
      now
    );
    const byId = Object.fromEntries(rows.map((row) => [row.id, row.sets]));
    assert.equal(byId.chest, 2);
    assert.equal(byId.quads, 1);
    assert.equal(byId.back, undefined);
  });

  test("unlogged leftover sets and skipped exercises do not count as volume", () => {
    const now = new Date("2026-08-28T12:00:00Z");
    const rows = weeklyVolumeRows(
      [
        {
          completedAt: "2026-08-27T12:00:00Z",
          exercises: [
            {
              name: "Bench Press",
              sets: [
                { weight: 185, reps: 5 },
                { weight: null, reps: null },
                { weight: null, reps: null },
              ],
            },
            {
              name: "Squat",
              sets: [
                { weight: null, reps: null },
                { weight: null, reps: null },
                { weight: null, reps: null },
              ],
            },
          ],
        },
      ],
      now
    );
    const byId = Object.fromEntries(rows.map((row) => [row.id, row.sets]));
    assert.equal(byId.chest, 1);
    assert.equal(byId.quads, undefined);
  });
});

describe("RPE parsing", () => {
  test("accepts half steps inside 1–10 and rejects the rest", () => {
    assert.equal(parseRpe("8.5"), 8.5);
    assert.equal(parseRpe("8.7"), 8.5);
    assert.equal(parseRpe(""), null);
    assert.equal(parseRpe("0"), null);
    assert.equal(parseRpe("11"), null);
  });

  test("getPreviousSets keeps last time's RPE as a hint", () => {
    const prev = getPreviousSets(
      [
        {
          exercises: [
            { name: "Bench Press", sets: [{ weight: 185, reps: 5, rpe: 8 }] },
          ],
        },
      ],
      "Bench Press"
    );
    assert.equal(prev[0].rpe, 8);
    const set = createEmptySet(prev[0]);
    assert.equal(set.rpe, "");
    assert.equal(set.previousRpe, 8);
  });
});

describe("rest timer wall clock", () => {
  test("remainingSeconds catches up after a freeze and never goes negative", () => {
    assert.equal(remainingSeconds(10_000, 1_000), 9);
    assert.equal(remainingSeconds(10_000, 10_000), 0);
    assert.equal(remainingSeconds(10_000, 15_000), 0);
    assert.equal(remainingSeconds(null, 1_000), 0);
  });

  test("restEndClockLabel uses local 12-hour time", () => {
    const evening = new Date(2026, 7, 28, 20, 4, 0);
    assert.equal(restEndClockLabel(evening.getTime()), "8:04 PM");
    const midnight = new Date(2026, 7, 28, 0, 5, 0);
    assert.equal(restEndClockLabel(midnight.getTime()), "12:05 AM");
  });

  test("start notification names the clock time instead of ticking", () => {
    const ends = new Date(2026, 7, 28, 8, 4, 0).getTime();
    const payload = restStartNotificationPayload(ends);
    assert.equal(payload.title, "Resting");
    assert.match(payload.body, /Up at 8:04 AM/);
    assert.equal(payload.silent, true);
  });
});
