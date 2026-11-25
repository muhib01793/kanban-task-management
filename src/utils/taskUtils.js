import { VALIDATION, PRIORITIES, COLUMNS } from './constants.js';

const PRIORITY_RANK = Object.fromEntries(PRIORITIES.map((priority, index) => [priority.id, index]));

export const createTaskId = () =>
  `task-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const todayIso = () => {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10);
};

/**
 * Validates the task form. Returns an object of field errors;
 * an empty object means the task is valid.
 */
export function validateTask(values) {
  const errors = {};
  const title = values.title.trim();

  if (title.length < VALIDATION.titleMin) {
    errors.title = `Title needs at least ${VALIDATION.titleMin} characters.`;
  } else if (title.length > VALIDATION.titleMax) {
    errors.title = `Title can be at most ${VALIDATION.titleMax} characters.`;
  }

  if (values.description.length > VALIDATION.descriptionMax) {
    errors.description = `Description can be at most ${VALIDATION.descriptionMax} characters.`;
  }

  if (!values.dueDate) {
    errors.dueDate = 'Pick a due date.';
  }

  if (!PRIORITIES.some((priority) => priority.id === values.priority)) {
    errors.priority = 'Choose a valid priority.';
  }

  return errors;
}

export const isOverdue = (task) => task.status !== 'done' && task.dueDate < todayIso();

export const priorityRank = (priorityId) => PRIORITY_RANK[priorityId] ?? 0;

export const columnTitle = (columnId) =>
  COLUMNS.find((column) => column.id === columnId)?.title ?? columnId;

/** Human-friendly due date text, e.g. "Due today" or "3 days overdue". */
export function describeDueDate(task) {
  const today = new Date(`${todayIso()}T00:00:00Z`);
  const due = new Date(`${task.dueDate}T00:00:00Z`);
  const days = Math.round((due - today) / 86400000);

  if (task.status === 'done') return `Due ${task.dueDate}`;
  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `Due in ${days} days`;
}
