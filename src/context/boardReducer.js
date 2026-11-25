/**
 * Pure reducer for board tasks. No React imports, so it can be tested directly in Node.
 *
 * Tasks live in one flat array. A task's column is its `status`, and its
 * position in the array decides its order within that column.
 */
export function boardReducer(tasks, action) {
  switch (action.type) {
    case 'ADD_TASK':
      return [...tasks, action.task];

    case 'UPDATE_TASK':
      return tasks.map((task) => (task.id === action.task.id ? { ...task, ...action.task } : task));

    case 'DELETE_TASK':
      return tasks.filter((task) => task.id !== action.taskId);

    case 'MOVE_TASK': {
      const moving = tasks.find((task) => task.id === action.taskId);
      if (!moving || action.taskId === action.beforeTaskId) return tasks;

      const remaining = tasks.filter((task) => task.id !== action.taskId);
      const moved = { ...moving, status: action.toStatus };

      if (action.beforeTaskId) {
        const insertAt = remaining.findIndex((task) => task.id === action.beforeTaskId);
        if (insertAt !== -1) {
          return [...remaining.slice(0, insertAt), moved, ...remaining.slice(insertAt)];
        }
      }
      return [...remaining, moved];
    }

    default:
      return tasks;
  }
}
