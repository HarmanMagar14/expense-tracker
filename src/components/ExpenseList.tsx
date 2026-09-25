"use client";

import { useState, useTransition } from "react";
import { deleteExpense } from "@/app/actions";
import ExpenseForm from "@/components/ExpenseForm";
import {
  CATEGORY_COLORS,
  formatDate,
  formatMoney,
  type Expense,
} from "@/lib/expenses";

export default function ExpenseList({
  expenses,
  today,
}: {
  expenses: Expense[];
  today: string;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (expenses.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="font-medium">No expenses here yet</p>
        <p className="mt-1 text-sm text-muted">
          Add one with the form, or pick a different month or category.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {expenses.map((expense) =>
        editingId === expense.id ? (
          <li key={expense.id} className="bg-background/60 p-4 sm:px-6">
            <ExpenseForm
              today={today}
              expense={expense}
              onDone={() => setEditingId(null)}
            />
          </li>
        ) : (
          <ExpenseRow
            key={expense.id}
            expense={expense}
            onEdit={() => setEditingId(expense.id)}
          />
        ),
      )}
    </ul>
  );
}

function ExpenseRow({
  expense,
  onEdit,
}: {
  expense: Expense;
  onEdit: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    if (!confirm("Delete this expense?")) return;
    startTransition(async () => {
      const result = await deleteExpense(expense.id);
      if (result.error) setError(result.error);
    });
  }

  return (
    <li
      className={`flex items-center gap-3 px-4 py-3 transition sm:px-6 ${
        pending ? "opacity-50" : ""
      }`}
    >
      <span
        className={`h-9 w-1.5 shrink-0 rounded-full ${CATEGORY_COLORS[expense.category]}`}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">
          {expense.note || expense.category}
        </p>
        <p className="text-xs text-muted">
          {expense.category} · {formatDate(expense.spent_on)}
        </p>
        {error && (
          <p role="alert" className="text-xs text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
      <p className="shrink-0 font-semibold tabular-nums">
        {formatMoney(expense.amount)}
      </p>
      <div className="flex shrink-0">
        <button
          type="button"
          onClick={onEdit}
          disabled={pending}
          aria-label="Edit expense"
          className="rounded-md p-2 text-muted transition hover:bg-background hover:text-foreground"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M13.6 3.2a2 2 0 0 1 2.8 2.8l-8.5 8.5-3.6.8.8-3.6 8.5-8.5Z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          aria-label="Delete expense"
          className="rounded-md p-2 text-muted transition hover:bg-red-500/10 hover:text-red-600"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M8 2a1 1 0 0 0-1 1v1H4a1 1 0 0 0 0 2h.1l.8 10.1A2 2 0 0 0 6.9 18h6.2a2 2 0 0 0 2-1.9L15.9 6h.1a1 1 0 1 0 0-2h-3V3a1 1 0 0 0-1-1H8Zm1 6a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1Zm3 1a1 1 0 1 0-2 0v5a1 1 0 1 0 2 0V9Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </li>
  );
}
