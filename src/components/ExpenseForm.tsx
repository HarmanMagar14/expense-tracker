"use client";

import { useActionState, useEffect } from "react";
import {
  addExpense,
  updateExpense,
  type ExpenseFormState,
} from "@/app/actions";
import { CATEGORIES, type Expense } from "@/lib/expenses";

type Props = {
  today: string;
  expense?: Expense;
  onDone?: () => void;
};

export default function ExpenseForm({ today, expense, onDone }: Props) {
  const isEdit = Boolean(expense);
  const [state, action, pending] = useActionState<ExpenseFormState, FormData>(
    isEdit ? updateExpense : addExpense,
    {},
  );

  useEffect(() => {
    if (state.ok) onDone?.();
  }, [state, onDone]);

  const idPrefix = expense ? `edit-${expense.id}` : "new";

  return (
    <form
      // Remount after a successful add so the inputs clear.
      key={isEdit ? undefined : state.key}
      action={action}
      className="grid grid-cols-2 gap-3"
    >
      {expense && <input type="hidden" name="id" value={expense.id} />}

      <div>
        <label htmlFor={`${idPrefix}-amount`} className="label">
          Amount
        </label>
        <input
          id={`${idPrefix}-amount`}
          name="amount"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0.01"
          required
          placeholder="0.00"
          defaultValue={expense?.amount}
          className="field"
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-date`} className="label">
          Date
        </label>
        <input
          id={`${idPrefix}-date`}
          name="spent_on"
          type="date"
          required
          defaultValue={expense?.spent_on ?? today}
          className="field"
        />
      </div>

      <div className="col-span-2">
        <label htmlFor={`${idPrefix}-category`} className="label">
          Category
        </label>
        <select
          id={`${idPrefix}-category`}
          name="category"
          required
          defaultValue={expense?.category ?? "Food"}
          className="field"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="col-span-2">
        <label htmlFor={`${idPrefix}-note`} className="label">
          Note <span className="font-normal">(optional)</span>
        </label>
        <input
          id={`${idPrefix}-note`}
          name="note"
          type="text"
          maxLength={200}
          placeholder="e.g. Lunch with team"
          defaultValue={expense?.note ?? ""}
          className="field"
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="col-span-2 text-sm text-red-600 dark:text-red-400"
        >
          {state.error}
        </p>
      )}

      <div className="col-span-2 flex gap-2">
        <button type="submit" disabled={pending} className="btn-primary flex-1">
          {pending ? "Saving…" : isEdit ? "Save changes" : "Add expense"}
        </button>
        {isEdit && (
          <button type="button" onClick={onDone} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
