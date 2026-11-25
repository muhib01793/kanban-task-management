import { memo } from 'react';
import { PRIORITIES } from '../utils/constants.js';

const LABELS = Object.fromEntries(PRIORITIES.map((priority) => [priority.id, priority.label]));

function PriorityBadge({ priority }) {
  return <span className={`priority priority--${priority}`}>{LABELS[priority] ?? priority}</span>;
}

export default memo(PriorityBadge);
