import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/login/actions";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import Filters from "@/components/Filters";
import SummaryCards from "@/components/SummaryCards";
import {
  currentMonth,
  formatMoney,
  isCategory,
  isMonth,
  monthRange,
  todayISO,
  type Expense,
} from "@/lib/expenses";

export default async function Dashboard({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const month = isMonth(params.month) ? params.month : currentMonth();
  const category = isCategory(params.category) ? params.category : "All";

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims) redirect("/login");
  const email = claims.claims.email as string | undefined;

  const { start, end } = monthRange(month);
  const { data, error } = await supabase
    .from("expenses")
    .select("id, amount, category, note, spent_on, created_at")
    .gte("spent_on", start)
    .lt("spent_on", end)
    .order("spent_on", { ascending: false })
    .order("created_at", { ascending: false });

  // Postgres numeric comes back as a string, so convert it.
  const monthExpenses: Expense[] = (data ?? []).map((e) => ({
    ...e,
    amount: Number(e.amount),
  }));
  const visible =
    category === "All"
      ? monthExpenses
      : monthExpenses.filter((e) => e.category === category);
  const visibleTotal = visible.reduce((sum, e) => sum + e.amount, 0);
  const today = todayISO();

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 font-bold text-white">
              $
            </span>
            <span className="font-semibold tracking-tight">Spendwise</span>
          </div>
          <div className="flex min-w-0 items-center gap-3">
            <span className="hidden truncate text-sm text-muted sm:block">
              {email}
            </span>
            <form action={logout}>
              <button type="submit" className="btn-secondary px-3 py-1.5">
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-6">
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300"
          >
            Couldn&apos;t load expenses: {error.message}
          </p>
        )}

        <Filters month={month} category={category} />

        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
            <section className="card p-4 sm:p-6">
              <h2 className="mb-4 font-semibold">Add expense</h2>
              <ExpenseForm today={today} />
            </section>
          </aside>

          <div className="min-w-0 space-y-6">
            <SummaryCards expenses={monthExpenses} month={month} />

            <section className="card overflow-hidden">
              <div className="flex items-baseline justify-between gap-2 border-b border-border px-4 py-3 sm:px-6">
                <h2 className="font-semibold">
                  {category === "All" ? "All expenses" : category}
                </h2>
                <span className="text-sm tabular-nums text-muted">
                  {visible.length} · {formatMoney(visibleTotal)}
                </span>
              </div>
              <ExpenseList expenses={visible} today={today} />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
