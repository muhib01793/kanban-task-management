import { memo } from 'react';
import PriorityBadge from './PriorityBadge.jsx';
import { COLUMNS } from '../utils/constants.js';
import { describeDueDate, isOverdue } from '../utils/taskUtils.js';

function TaskCard({
  task,
  isDragging,
  isDropBefore,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onEdit,
  onDelete,
  onMove,
}) {
  const overdue = isOverdue(task);

  return (
    <article
      className={[
        'task-card',
        isDragging ? 'task-card--dragging' : '',
        isDropBefore ? 'task-card--drop-before' : '',
        overdue ? 'task-card--overdue' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      draggable
      onDragStart={(event) => onDragStart(event, task.id)}
      onDragEnd={onDragEnd}
      onDragOver={(event) => onDragOver(event, task.status, task.id)}
      onDrop={(event) => onDrop(event, task.status, task.id)}
      aria-label={`${task.title}, ${describeDueDate(task)}`}
    >
      <div className="task-card__top">
        <PriorityBadge priority={task.priority} />
        <div className="task-card__actions">
          <button type="button" className="icon-button" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`}>
            ✎
          </button>
          <button
            type="button"
            className="icon-button icon-button--danger"
            onClick={() => onDelete(task)}
            aria-label={`Delete ${task.title}`}
          >
            ×
          </button>
        </div>
      </div>

      <h3 className="task-card__title">{task.title}</h3>
      {task.description && <p className="task-card__description">{task.description}</p>}

      <div className="task-card__footer">
        <span className={`due ${overdue ? 'due--overdue' : ''}`.trim()}>{describeDueDate(task)}</span>

        <label className="task-card__move">
          <span className="sr-only">Move {task.title} to</span>
          <select value={task.status} onChange={(event) => onMove(task.id, event.target.value)}>
            {COLUMNS.map((column) => (
              <option key={column.id} value={column.id}>
                {column.title}
              </option>
            ))}
          </select>
        </label>
      </div>
    </article>
  );
}

export default memo(TaskCard);
