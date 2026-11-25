import { useCallback, useMemo, useState } from 'react';
import useBoard from './hooks/useBoard.js';
import useDragAndDrop from './hooks/useDragAndDrop.js';
import Board from './components/Board.jsx';
import Toolbar from './components/Toolbar.jsx';
import Modal from './components/Modal.jsx';
import TaskForm from './components/TaskForm.jsx';
import { ALL, COLUMNS } from './utils/constants.js';
import { createTaskId } from './utils/taskUtils.js';

export default function App() {
  const { tasks, addTask, updateTask, deleteTask, moveTask } = useBoard();

  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState(ALL);
  // dialog: null | { mode: 'create', status } | { mode: 'edit', task }
  const [dialog, setDialog] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const handleMove = useCallback(
    (taskId, toStatus, beforeTaskId) => moveTask(taskId, toStatus, beforeTaskId),
    [moveTask]
  );

  const { draggingId, dropTarget, dragHandlers } = useDragAndDrop(handleMove);

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tasks.filter((task) => {
      if (priority !== ALL && task.priority !== priority) return false;
      if (!query) return true;
      return `${task.title} ${task.description}`.toLowerCase().includes(query);
    });
  }, [tasks, search, priority]);

  // Group visible tasks by column. Each column keeps the stored order, so drag-and-drop
  // placement is preserved. Priority is shown on each card rather than used for sorting.
  const tasksByColumn = useMemo(() => {
    const groups = Object.fromEntries(COLUMNS.map((column) => [column.id, []]));
    for (const task of visibleTasks) {
      groups[task.status]?.push(task);
    }
    return groups;
  }, [visibleTasks]);

  const handleSaveTask = useCallback(
    (values) => {
      if (dialog?.mode === 'edit') {
        updateTask({ ...dialog.task, ...values });
      } else {
        addTask({ ...values, id: createTaskId() });
      }
      setDialog(null);
    },
    [dialog, addTask, updateTask]
  );

  const openCreate = useCallback((status = 'todo') => setDialog({ mode: 'create', status }), []);
  const openEdit = useCallback((task) => setDialog({ mode: 'edit', task }), []);
  const closeDialog = useCallback(() => setDialog(null), []);
  const cancelDelete = useCallback(() => setPendingDelete(null), []);

  const confirmDelete = useCallback(() => {
    if (pendingDelete) deleteTask(pendingDelete.id);
    setPendingDelete(null);
  }, [pendingDelete, deleteTask]);

  const totalCount = tasks.length;
  const doneCount = tasks.filter((task) => task.status === 'done').length;

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <p className="app-header__eyebrow">Team board</p>
          <h1 className="app-header__title">Kanban task board</h1>
          <p className="app-header__subtitle">
            {doneCount} of {totalCount} tasks done. Drag cards between columns or use the move menu.
          </p>
        </div>
      </header>

      <Toolbar
        search={search}
        priority={priority}
        onSearchChange={setSearch}
        onPriorityChange={setPriority}
        onNewTask={() => openCreate('todo')}
        matchCount={visibleTasks.length}
      />

      <Board
        tasksByColumn={tasksByColumn}
        dropTarget={dropTarget}
        draggingId={draggingId}
        dragHandlers={dragHandlers}
        onAddTask={openCreate}
        onEditTask={openEdit}
        onDeleteTask={setPendingDelete}
        onMoveTask={handleMove}
      />

      {dialog && (
        <Modal title={dialog.mode === 'edit' ? 'Edit task' : 'New task'} onClose={closeDialog}>
          <TaskForm
            initialTask={dialog.mode === 'edit' ? dialog.task : { status: dialog.status }}
            onSubmit={handleSaveTask}
            onCancel={closeDialog}
          />
        </Modal>
      )}

      {pendingDelete && (
        <Modal title="Delete task?" onClose={cancelDelete}>
          <div className="confirm">
            <p>
              <strong>{pendingDelete.title}</strong> will be removed from the board. This can't be undone.
            </p>
            <div className="task-form__actions">
              <button type="button" className="btn btn--ghost" onClick={cancelDelete}>
                Keep task
              </button>
              <button type="button" className="btn btn--danger" onClick={confirmDelete}>
                Delete task
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
