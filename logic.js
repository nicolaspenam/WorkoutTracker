/**
 * logic.js – pure functions shared between app.js and the test suite.
 * No DOM access here so these can be imported directly by Node.js tests.
 */

export const SETS_PER_EXERCISE = 3;
export const DEFAULT_REST_SECONDS = 90;

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
    // newly completed → caller should start rest timer
    return true;
  } else if (!isFilled && setData.completed) {
    setData.completed = false;
  }
  return false;
}

/**
 * Convert the internal selectedExercises array into the serialisable
 * workout-data structure used for the summary screen.
 *
 * @param {Array<{ name: string, sets: Array<{ weight: string|number, reps: string|number }> }>} selectedExercises
 * @returns {Array<{ name: string, sets: Array<{ set: number, weight: number|null, reps: number|null }> }>}
 */
export function collectWorkoutData(selectedExercises) {
  return selectedExercises.map((item) => {
    const sets = item.sets.map((s, idx) => ({
      set: idx + 1,
      weight: s.weight !== "" && s.weight !== null ? Number(s.weight) : null,
      reps: s.reps !== "" && s.reps !== null ? Number(s.reps) : null,
    }));
    return { name: item.name, sets };
  });
}
