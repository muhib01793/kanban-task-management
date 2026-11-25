import { useState } from 'react';
import { PRIORITIES, VALIDATION } from '../utils/constants.js';
import { validateTask, todayIso } from '../utils/taskUtils.js';

const emptyValues = (task) => ({
  title: task?.title ?? '',
  description: task?.description ?? '',
  priority: task?.priority ?? 'medium',
  dueDate: task?.dueDate ?? todayIso(),
  status: task?.status ?? 'todo',
});

/**
 * Create or edit form. Validates on submit, then clears each field's error as the user types.
 */
export default function TaskForm({ initialTask, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => emptyValues(initialTask));
  const [errors, setErrors] = useState({});
  const isEditing = Boolean(initialTask);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => (previous[name] ? { ...previous, [name]: undefined } : previous));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateTask(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
    });
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <label className="field">
        <span className="field__label">Title</span>
        <input
          name="title"
          value={values.title}
          onChange={handleChange}
          maxLength={VALIDATION.titleMax + 20}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <span id="title-error" className="field__error" role="alert">
            {errors.title}
          </span>
        )}
      </label>

      <label className="field">
        <span className="field__label">Description</span>
        <textarea
          name="description"
          rows={4}
          value={values.description}
          onChange={handleChange}
          aria-invalid={Boolean(errors.description)}
        />
        <span className="field__hint">
          {values.description.length}/{VALIDATION.descriptionMax}
        </span>
        {errors.description && (
          <span className="field__error" role="alert">
            {errors.description}
          </span>
        )}
      </label>

      <div className="task-form__row">
        <label className="field">
          <span className="field__label">Priority</span>
          <select name="priority" value={values.priority} onChange={handleChange}>
            {PRIORITIES.map((priority) => (
              <option key={priority.id} value={priority.id}>
                {priority.label}
              </option>
            ))}
          </select>
          {errors.priority && (
            <span className="field__error" role="alert">
              {errors.priority}
            </span>
          )}
        </label>

        <label className="field">
          <span className="field__label">Due date</span>
          <input type="date" name="dueDate" value={values.dueDate} onChange={handleChange} />
          {errors.dueDate && (
            <span className="field__error" role="alert">
              {errors.dueDate}
            </span>
          )}
        </label>
      </div>

      <div className="task-form__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary">
          {isEditing ? 'Save changes' : 'Create task'}
        </button>
      </div>
    </form>
  );
}
