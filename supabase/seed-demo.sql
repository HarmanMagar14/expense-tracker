-- Optional: fill the demo account with sample expenses for this month and last month.
-- 1. Sign up in the app as the demo user (e.g. demo@spendwise.app).
-- 2. Change the email below if needed, then run this in the Supabase SQL Editor.

with demo as (
  select id from auth.users where email = 'demo@spendwise.app'
),
base as (
  select date_trunc('month', current_date)::date as this_month
)
insert into public.expenses (user_id, amount, category, note, spent_on)
select demo.id, v.amount, v.category, v.note, base.this_month + v.day_offset
from demo, base, (values
  (1450.00, 'Housing',       'Rent',                    0),
  (  62.40, 'Food',          'Groceries',               1),
  (  12.50, 'Food',          'Lunch with team',         2),
  (  45.00, 'Transport',     'Monthly bus pass',        2),
  (  89.99, 'Bills',         'Internet',                4),
  (  54.20, 'Bills',         'Electricity',             5),
  (  15.99, 'Entertainment', 'Streaming subscription',  6),
  (  38.75, 'Food',          'Dinner out',              7),
  (  74.00, 'Shopping',      'Running shoes (sale)',    9),
  (  25.00, 'Health',        'Pharmacy',               10),
  (  48.10, 'Food',          'Groceries',              11),
  (  22.00, 'Entertainment', 'Movie night',            12),
  (1450.00, 'Housing',       'Rent',                  -31),
  (  71.30, 'Food',          'Groceries',             -28),
  (  45.00, 'Transport',     'Monthly bus pass',      -27),
  (  89.99, 'Bills',         'Internet',              -25),
  ( 120.00, 'Shopping',      'Winter jacket',         -20),
  (  33.60, 'Food',          'Takeout',               -15),
  (  60.00, 'Health',        'Doctor visit',          -10)
) as v(amount, category, note, day_offset)
where base.this_month + v.day_offset <= current_date;
