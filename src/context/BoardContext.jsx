import { createContext, useEffect, useMemo, useReducer } from 'react';
import { seedTasks } from '../data/seedTasks.js';
import { loadTasks, saveTasks } from '../utils/storage.js';
import { boardReducer } from './boardReducer.js';

export const BoardContext = createContext(null);

export function BoardProvider({ children }) {
  const [tasks, dispatch] = useReducer(boardReducer, undefined, () => loadTasks() ?? seedTasks);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const actions = useMemo(
    () => ({
      addTask: (task) => dispatch({ type: 'ADD_TASK', task }),
      updateTask: (task) => dispatch({ type: 'UPDATE_TASK', task }),
      deleteTask: (taskId) => dispatch({ type: 'DELETE_TASK', taskId }),
      moveTask: (taskId, toStatus, beforeTaskId = null) =>
        dispatch({ type: 'MOVE_TASK', taskId, toStatus, beforeTaskId }),
    }),
    []
  );

  const value = useMemo(() => ({ tasks, ...actions }), [tasks, actions]);

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
}
