-- Expense Tracker schema. Run this once in the Supabase SQL Editor.

create table if not exists public.expenses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  amount      numeric(10, 2) not null check (amount > 0),
  category    text not null,
  note        text,
  spent_on    date not null default current_date,
  created_at  timestamptz not null default now()
);

create index if not exists expenses_user_spent_on_idx
  on public.expenses (user_id, spent_on desc);

-- Row Level Security: each user can only see and change their own rows.
alter table public.expenses enable row level security;

drop policy if exists "Users can read own expenses" on public.expenses;
create policy "Users can read own expenses"
  on public.expenses for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own expenses" on public.expenses;
create policy "Users can insert own expenses"
  on public.expenses for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own expenses" on public.expenses;
create policy "Users can update own expenses"
  on public.expenses for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own expenses" on public.expenses;
create policy "Users can delete own expenses"
  on public.expenses for delete
  to authenticated
  using ((select auth.uid()) = user_id);
