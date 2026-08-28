# Workout Tracker

**[Open the app](https://nicolaspenam.github.io/WorkoutTracker/)** — https://nicolaspenam.github.io/WorkoutTracker/

A simple, mobile-friendly workout tracker built with vanilla HTML, CSS, and JavaScript. Workouts are saved in your browser (`localStorage`) so you can reuse them and track PRs over time. On Android you can also **install it as an app** from the browser menu (Add to Home screen / Install app).

## Features

- Build a workout from a dropdown, or reuse a previous session from **History**
- Filter exercises by the **equipment you have** (all types on by default — tap Dumbbell or Bodyweight to limit the list)
- Filter the (expanded) exercise list by main muscle chips that wrap onto extra rows: chest, back, shoulders, arms, legs, glutes, calves, core
- **Suggested workouts** based on recent training: if you have not trained in about a week you get Full body, Upper, and Lower options; otherwise one session aimed at muscles that are due (hypertrophy targets of ~10–20 weekly sets, ~2×/week, ~48h recovery). Suggestions use **supersets by default** (antagonist or non-competing pairs so rest time drops without cutting load)
- Build your own supersets while assembling a workout; saved workouts keep order and pairing
- Rest timer starts when a set is completed — pick **1:00 / 1:30 / 2:00**, and nudge **±15s** while it runs. In a superset the timer waits until **both** lifts finish that set
- Optional **rest-over notification** (on by default): allow notifications and the phone will ping when rest hits 0:00, aimed at Android PWAs (iOS installed apps too when the OS allows it)
- Log weight and reps per set, with add/remove set controls
- **Swap** an exercise in the middle of a session (or add one). If you started from a saved workout, Finish asks whether to update it for next time — history and PRs stay as logged
- See last time’s weight/reps for each set and tap **✓** to copy them
- Previous numbers stay in amber; values you type or confirm use a green style
- Look up personal records (heaviest set, then most reps) from the **PRs** tab
- Finish a workout to save it and view a summary
- Remove a workout from the saved list without deleting history or PRs
- Save a suggestion to that list for later
- **Export / import** a JSON backup from History to move devices or keep a snapshot off-browser

## Live site

Production: **[https://nicolaspenam.github.io/WorkoutTracker/](https://nicolaspenam.github.io/WorkoutTracker/)**

Pull requests get a preview of the same site. A GitHub Action posts the link (and a QR code for your phone) on the PR:

`https://nicolaspenam.github.io/WorkoutTracker/pr-preview/pr-<number>/`

That needs **Read and write** permissions under **Settings → Actions → General → Workflow permissions**. Preview files live in `pr-preview/` on `main` and are removed when the PR is closed.

## Getting Started

Serve the folder (ES modules need a local server, not `file://`):

```bash
npx serve .
```

Then open the URL in your phone or browser. In Chrome on Android, use **Install app** / **Add to Home screen** to pin it.

## Usage

1. Optionally name the workout, then add exercises — pick equipment and/or a muscle chip first to narrow the list, use a suggestion, or open **History** and tap **Use workout**. Pair adjacent lifts with **Superset with next**
2. Allow rest notifications if prompted, then tap **Start Workout**
3. Enter weight and reps, or tap **✓** to fill last time’s numbers for that set
4. Use **+** / **−** to add or remove sets; rest defaults to 1:30 and can be changed or nudged ±15s. In a superset, rest starts after both sides finish that set
5. **Finish Workout** saves the session (including order and supersets) and updates PRs
6. Search an exercise on the **PRs** tab (or filter by muscle) to see your best set
7. On **History**, **Remove** hides a workout from the list only. Use **Export backup** to download a JSON file (save it to Drive/iCloud). **Import backup** restores it — merge keeps existing sessions, replace overwrites this device

## Tests

```bash
node app.test.js
```

GitHub Actions runs the same command on every pull request and on `main`.
