import { useCallback, useState } from 'react';

const MIME_TYPE = 'text/plain';

/**
 * HTML5 drag-and-drop helper.
 * - Cards are draggable and carry their task ID.
 * - Columns accept drops (append to end).
 * - Cards accept drops (insert before that card).
 */
export default function useDragAndDrop(onMove) {
  const [draggingId, setDraggingId] = useState(null);
  const [dropTarget, setDropTarget] = useState(null); // { columnId, beforeTaskId }

  const handleDragStart = useCallback((event, taskId) => {
    event.dataTransfer.setData(MIME_TYPE, taskId);
    event.dataTransfer.effectAllowed = 'move';
    setDraggingId(taskId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    setDropTarget(null);
  }, []);

  const handleColumnDragOver = useCallback((event, columnId) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setDropTarget((current) =>
      current?.columnId === columnId && current.beforeTaskId === null
        ? current
        : { columnId, beforeTaskId: null }
    );
  }, []);

  const handleCardDragOver = useCallback((event, columnId, taskId) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
    setDropTarget((current) =>
      current?.columnId === columnId && current.beforeTaskId === taskId
        ? current
        : { columnId, beforeTaskId: taskId }
    );
  }, []);

  const handleDrop = useCallback(
    (event, columnId, beforeTaskId = null) => {
      event.preventDefault();
      event.stopPropagation();
      const taskId = event.dataTransfer.getData(MIME_TYPE) || draggingId;
      if (taskId && taskId !== beforeTaskId) {
        onMove(taskId, columnId, beforeTaskId);
      }
      setDraggingId(null);
      setDropTarget(null);
    },
    [draggingId, onMove]
  );

  return {
    draggingId,
    dropTarget,
    dragHandlers: {
      handleDragStart,
      handleDragEnd,
      handleColumnDragOver,
      handleCardDragOver,
      handleDrop,
    },
  };
}
