import { STORAGE_KEY } from './constants.js';

/** Reads saved tasks. Returns null when nothing valid is stored. */
export function loadTasks() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    // Corrupt JSON or blocked storage: fall back to seed data instead of crashing.
    return null;
  }
}

/** Saves tasks. Failures (quota, private mode) are reported but never thrown. */
export function saveTasks(tasks) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch {
    return false;
  }
}
