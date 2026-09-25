export const CATEGORIES = [
  "Food",
  "Transport",
  "Housing",
  "Bills",
  "Shopping",
  "Entertainment",
  "Health",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Expense = {
  id: string;
  amount: number;
  category: Category;
  note: string | null;
  spent_on: string; // YYYY-MM-DD
  created_at: string;
};

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: "bg-orange-500",
  Transport: "bg-sky-500",
  Housing: "bg-violet-500",
  Bills: "bg-amber-500",
  Shopping: "bg-pink-500",
  Entertainment: "bg-fuchsia-500",
  Health: "bg-emerald-500",
  Other: "bg-zinc-400",
};

export function isCategory(value: unknown): value is Category {
  return CATEGORIES.includes(value as Category);
}

// Change this to your local currency code, e.g. "EUR", "INR", "NPR".
const CURRENCY = "USD";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: CURRENCY,
});

export function formatMoney(amount: number) {
  return currencyFormatter.format(amount);
}

export function formatDate(isoDate: string) {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatMonth(month: string) {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function todayISO() {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function currentMonth() {
  return todayISO().slice(0, 7);
}

export function isMonth(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}

/** First day of the month and first day of the next month, as YYYY-MM-DD. */
export function monthRange(month: string) {
  const [y, m] = month.split("-").map(Number);
  const next = m === 12 ? `${y + 1}-01` : `${y}-${pad(m + 1)}`;
  return { start: `${month}-01`, end: `${next}-01` };
}

export function shiftMonth(month: string, delta: number) {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}
