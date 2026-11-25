export const COLUMNS = [
  { id: 'todo', title: 'To do' },
  { id: 'in-progress', title: 'In progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

export const PRIORITIES = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
  { id: 'urgent', label: 'Urgent' },
];

export const VALIDATION = {
  titleMin: 3,
  titleMax: 80,
  descriptionMax: 300,
};

export const STORAGE_KEY = 'kanban-board-v1';

export const ALL = 'all';
