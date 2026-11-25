import { memo } from 'react';
import { ALL, PRIORITIES } from '../utils/constants.js';

function Toolbar({ search, priority, onSearchChange, onPriorityChange, onNewTask, matchCount }) {
  return (
    <div className="toolbar">
      <div className="toolbar__filters">
        <label className="field toolbar__search">
          <span className="sr-only">Search tasks</span>
          <input
            type="search"
            placeholder="Search by title or description"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>

        <label className="field">
          <span className="sr-only">Filter by priority</span>
          <select value={priority} onChange={(event) => onPriorityChange(event.target.value)}>
            <option value={ALL}>All priorities</option>
            {PRIORITIES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <p className="toolbar__count">{matchCount} tasks shown</p>
      </div>

      <button type="button" className="btn btn--primary" onClick={onNewTask}>
        + New task
      </button>
    </div>
  );
}

export default memo(Toolbar);
