/**
 * Starter tasks shown on first visit. Due dates are relative to today so the
 * demo always shows a mix of upcoming and overdue work.
 */

const isoDaysFromToday = (offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const offsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 10);
};

export const seedTasks = [
  {
    id: 'seed-1',
    title: 'Set up project repository',
    description: 'Create the repo, add the README, and configure the linting rules.',
    priority: 'medium',
    status: 'done',
    dueDate: isoDaysFromToday(-3),
  },
  {
    id: 'seed-2',
    title: 'Design the login screen',
    description: 'Wireframe the form, error states, and mobile layout.',
    priority: 'high',
    status: 'in-progress',
    dueDate: isoDaysFromToday(2),
  },
  {
    id: 'seed-3',
    title: 'Build the task card component',
    description: 'Show title, priority, due date, and quick actions.',
    priority: 'urgent',
    status: 'in-progress',
    dueDate: isoDaysFromToday(-1),
  },
  {
    id: 'seed-4',
    title: 'Review API error handling',
    description: 'Check that failed requests show a message and can be retried.',
    priority: 'medium',
    status: 'review',
    dueDate: isoDaysFromToday(1),
  },
  {
    id: 'seed-5',
    title: 'Write onboarding copy',
    description: 'Short, friendly text for the first-run experience.',
    priority: 'low',
    status: 'todo',
    dueDate: isoDaysFromToday(7),
  },
  {
    id: 'seed-6',
    title: 'Plan the sprint retrospective',
    description: '',
    priority: 'low',
    status: 'todo',
    dueDate: isoDaysFromToday(5),
  },
];
