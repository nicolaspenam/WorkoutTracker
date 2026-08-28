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
} from "./logic.js";

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

  test("returns an empty array for no exercises", () => {
    assert.deepEqual(collectWorkoutData([]), []);
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
    assert.deepEqual(prev[0], { weight: 185, reps: 5 });
    assert.deepEqual(prev[2], { weight: 175, reps: 6 });
  });

  test("getPreviousSets skips workouts that did not include the exercise", () => {
    const prev = getPreviousSets(history, "Squat");
    assert.equal(prev.length, 1);
    assert.deepEqual(prev[0], { weight: 225, reps: 5 });
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
