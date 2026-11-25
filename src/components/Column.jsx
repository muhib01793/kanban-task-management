import { memo } from 'react';
import TaskCard from './TaskCard.jsx';

function Column({
  column,
  tasks,
  dropTarget,
  draggingId,
  dragHandlers,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
}) {
  const isDropZone = dropTarget?.columnId === column.id;
  const dropAtEnd = isDropZone && dropTarget.beforeTaskId === null;

  return (
    <section
      className={`column ${isDropZone ? 'column--active' : ''}`.trim()}
      aria-labelledby={`column-${column.id}`}
      onDragOver={(event) => dragHandlers.handleColumnDragOver(event, column.id)}
      onDrop={(event) => dragHandlers.handleDrop(event, column.id, null)}
    >
      <header className="column__header">
        <h2 id={`column-${column.id}`} className="column__title">
          {column.title}
        </h2>
        <span className="column__count" aria-label={`${tasks.length} tasks`}>
          {tasks.length}
        </span>
      </header>

      <div className="column__body">
        {tasks.length === 0 && <p className="column__empty">Drop a task here or add one below.</p>}

        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isDragging={draggingId === task.id}
            isDropBefore={isDropZone && dropTarget.beforeTaskId === task.id}
            onDragStart={dragHandlers.handleDragStart}
            onDragEnd={dragHandlers.handleDragEnd}
            onDragOver={dragHandlers.handleCardDragOver}
            onDrop={dragHandlers.handleDrop}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onMove={onMoveTask}
          />
        ))}

        {dropAtEnd && <div className="drop-indicator" aria-hidden="true" />}
      </div>

      <footer className="column__footer">
        <button type="button" className="btn btn--ghost btn--block" onClick={() => onAddTask(column.id)}>
          + Add task
        </button>
      </footer>
    </section>
  );
}

export default memo(Column);
