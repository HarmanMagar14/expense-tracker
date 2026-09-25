import {
  CATEGORIES,
  CATEGORY_COLORS,
  formatMoney,
  formatMonth,
  type Category,
  type Expense,
} from "@/lib/expenses";

export default function SummaryCards({
  expenses,
  month,
}: {
  expenses: Expense[];
  month: string;
}) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const byCategory = CATEGORIES.map((category) => ({
    category,
    amount: expenses
      .filter((e) => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0),
  }))
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const top = byCategory[0];

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Stat
          label={`Spent in ${formatMonth(month)}`}
          value={formatMoney(total)}
          className="col-span-2 lg:col-span-1"
        />
        <Stat label="Transactions" value={String(expenses.length)} />
        <Stat
          label="Top category"
          value={top ? top.category : "—"}
          sub={top ? formatMoney(top.amount) : undefined}
        />
      </div>

      {byCategory.length > 0 && (
        <div className="card p-4 sm:p-6">
          <h2 className="mb-4 text-sm font-medium text-muted">
            Spending by category
          </h2>
          <ul className="space-y-3">
            {byCategory.map(({ category, amount }) => (
              <CategoryBar
                key={category}
                category={category}
                amount={amount}
                share={total ? amount / total : 0}
              />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function Stat({
  label,
  value,
  sub,
  className = "",
}: {
  label: string;
  value: string;
  sub?: string;
  className?: string;
}) {
  return (
    <div className={`card p-4 sm:p-5 ${className}`}>
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-1 truncate text-2xl font-semibold tabular-nums tracking-tight">
        {value}
      </p>
      {sub && <p className="text-xs text-muted tabular-nums">{sub}</p>}
    </div>
  );
}

function CategoryBar({
  category,
  amount,
  share,
}: {
  category: Category;
  amount: number;
  share: number;
}) {
  return (
    <li>
      <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
        <span className="font-medium">{category}</span>
        <span className="tabular-nums text-muted">
          {formatMoney(amount)} · {Math.round(share * 100)}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-background">
        <div
          className={`h-full rounded-full ${CATEGORY_COLORS[category]}`}
          style={{ width: `${Math.max(share * 100, 2)}%` }}
        />
      </div>
    </li>
  );
}
