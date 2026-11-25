import { useContext } from 'react';
import { BoardContext } from '../context/BoardContext.jsx';

/** Access board state and actions. Must be used inside BoardProvider. */
export default function useBoard() {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used inside <BoardProvider>.');
  }
  return context;
}
