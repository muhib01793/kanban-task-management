# Project Documentation: Kanban Task Management Board

## 1. Purpose

This project is a Kanban board that shows how to manage a list of tasks with several interacting features (forms, validation, drag-and-drop, filters, and persistence) using React and no backend.

## 2. Architecture

| Layer | Location | Responsibility |
| --- | --- | --- |
| State | `context/BoardContext.jsx` | Holds the task list and exposes actions through a reducer |
| Access | `hooks/useBoard.js` | Safe access to the context |
| Interaction | `hooks/useDragAndDrop.js` | Drag state and drop logic, separate from rendering |
| Composition | `App.jsx` | Search and filter state, dialogs, and grouping tasks into columns |
| Presentation | `components/` | Pure UI: board, columns, cards, form, modal, toolbar |
| Support | `utils/` | Validation, date helpers, and safe LocalStorage access |

## 3. Data Model

```js
{
  id: 'task-lx2f8k-a1b2c',   // generated, unique
  title: 'Design the login screen',
  description: 'Wireframe the form.',
  priority: 'high',           // low | medium | high | urgent
  status: 'in-progress',      // todo | in-progress | review | done
  dueDate: '2026-11-27',      // ISO date, YYYY-MM-DD
}
```

A task's column is its `status`. Its position within the column is its index in the flat `tasks` array. Storing one flat array avoids keeping two copies of the order in sync.

## 4. Reducer Design

`boardReducer` handles four actions:

- `ADD_TASK` appends the new task.
- `UPDATE_TASK` merges changes into the matching task.
- `DELETE_TASK` removes the task.
- `MOVE_TASK` removes the task from its current position, sets its new `status`, and inserts it before `beforeTaskId`. If `beforeTaskId` is null, the task goes to the end.

The reducer lives in `context/boardReducer.js` with no React imports, so it can be tested without rendering any components. Moving a task onto itself returns the same array, so React skips the update.

## 5. Drag-and-Drop

The HTML5 Drag and Drop API is used, with no extra dependency.

- Cards are `draggable`, and `dragstart` stores the task ID in `dataTransfer`.
- Columns call `preventDefault` on `dragover` so they accept drops. The drop indicator is shown at the end of the column.
- Cards also accept drops and call `stopPropagation` so the column's handler doesn't run. The indicator is shown above the target card.
- `dropTarget` state drives the visual feedback. It is cleared on `dragend` and after a drop.

Keyboard users are covered by the move select on each card, which calls the same `moveTask` action.

## 6. Validation

`validateTask` returns an object of errors. Validation runs on submit, and the error for a field is cleared as soon as the user edits it. Errors are linked to their inputs with `aria-invalid` and shown with `role="alert"`.

## 7. Overdue Logic

`isOverdue(task)` is true when the task isn't done and its `dueDate` is before today. Dates are ISO strings, so string comparison is correct. `todayIso()` uses the local timezone offset so that "today" matches the user's date.

## 8. Persistence

`BoardProvider` saves the task array to LocalStorage on every change. `loadTasks` catches invalid JSON and blocked storage, and falls back to seed data. `saveTasks` returns `false` on failure instead of throwing, so the app keeps working in private browsing.

## 9. Accessibility

- Dialogs use `role="dialog"`, `aria-modal`, and a labelled title. They close on Escape, move focus into the dialog on open, and return focus to the trigger on close.
- Icon-only buttons have `aria-label`s that name the task.
- Columns are labelled with `aria-labelledby`.
- Each card has a move select with a visually hidden label.

## 10. Testing Notes

- Syntax and import checks were run on all source files.
- Reducer logic, validation, and date helpers are pure, so they can be checked in Node.
- Not yet verified in this environment: `npm install`, `npm run build`, and browser testing of drag-and-drop, which needs a real browser.

## 11. Known Limitations

- Drag-and-drop uses the HTML5 API, which doesn't work on most touch devices. The move select is the fallback on mobile.
- Tasks have no owner or assignee.
- There is no undo for deletes beyond the confirmation step.
- All data stays in one browser. Clearing site data removes the board.

## 12. Possible Extensions

- Add unit tests for the reducer and validation with a test runner such as Vitest.
- Add pointer-based drag for touch devices.
- Add an activity log and undo stack.
