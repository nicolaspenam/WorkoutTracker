# Workout Tracker

**[Open the app](https://nicolaspenam.github.io/WorkoutTracker/)** — https://nicolaspenam.github.io/WorkoutTracker/

A simple, mobile-friendly workout tracker built with vanilla HTML, CSS, and JavaScript. Workouts are saved in your browser (`localStorage`) so you can reuse them and track PRs over time.

## Features

- Build a workout from a dropdown, or reuse a previous session from **History**
- Filter the (expanded) exercise list by main muscle chips that wrap onto extra rows: chest, back, shoulders, arms, legs, glutes, calves, core
- Optional name for each workout (e.g. “Push Day”)
- Log weight and reps per set, with add/remove set controls
- See last time’s weight/reps for each set and tap **✓** to copy them
- Previous numbers stay in amber; values you type or confirm use a green style
- Rest timer starts when a set is completed
- Look up personal records (heaviest set, then most reps) from the **PRs** tab
- Finish a workout to save it and view a summary
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

Then open the URL in your phone or browser.

## Usage

1. Optionally name the workout, then add exercises — pick a muscle chip first to narrow the list, or open **History** and tap **Use workout**
2. Tap **Start Workout**
3. Enter weight and reps, or tap **✓** to fill last time’s numbers for that set
4. Use **+** / **−** to add or remove sets
5. **Finish Workout** saves the session and updates PRs
6. Search an exercise on the **PRs** tab (or filter by muscle) to see your best set
7. On **History**, use **Export backup** to download a JSON file (save it to Drive/iCloud). **Import backup** restores it — merge keeps existing sessions, replace overwrites this device

## Tests

```bash
node app.test.js
```
