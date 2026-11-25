import { memo } from 'react';
import Column from './Column.jsx';
import { COLUMNS } from '../utils/constants.js';

/** Lays out the four columns. Tasks are grouped by status, keeping their stored order. */
function Board({ tasksByColumn, dropTarget, draggingId, dragHandlers, onAddTask, onEditTask, onDeleteTask, onMoveTask }) {
  return (
    <div className="board">
      {COLUMNS.map((column) => (
        <Column
          key={column.id}
          column={column}
          tasks={tasksByColumn[column.id]}
          dropTarget={dropTarget}
          draggingId={draggingId}
          dragHandlers={dragHandlers}
          onAddTask={onAddTask}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onMoveTask={onMoveTask}
        />
      ))}
    </div>
  );
}

export default memo(Board);
