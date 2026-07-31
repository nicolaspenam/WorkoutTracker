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
