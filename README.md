# Spendwise: Expense Tracker

A full-stack, mobile-friendly expense tracker built with **Next.js**, **TypeScript**, **Tailwind CSS** and **Supabase** (Postgres and Auth).

**Live demo:** _add your Vercel link here_. Click **Try the demo account** to look around without signing up.

<!-- Add a screenshot: save one as public/screenshot.png and uncomment the next line -->
<!-- ![Spendwise dashboard](public/screenshot.png) -->

## Features

- Email and password sign-up and login (Supabase Auth)
- Add, edit and delete expenses with an amount, category, date and note
- Monthly dashboard with the total spent, the number of transactions, the top category and a breakdown by category
- Filter by month and by category
- Responsive layout that works on phones, tablets and desktops, with dark mode
- **Row Level Security**: each user can only read and change their own data, and Postgres enforces this, not just the UI

## Tech stack

| Layer    | Tech                                                |
| -------- | --------------------------------------------------- |
| Frontend | Next.js 16 (App Router, Server Components), React 19 |
| Styling  | Tailwind CSS 4                                      |
| Backend  | Next.js Server Actions                              |
| Database | Supabase Postgres with Row Level Security           |
| Auth     | Supabase Auth (`@supabase/ssr`, cookie sessions)    |
| Hosting  | Vercel                                              |

## Run locally

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase **SQL Editor**, run [`supabase/schema.sql`](supabase/schema.sql).
3. Copy `.env.example` to `.env.local` and fill in the values from **Project Settings → API** (the publishable key or the legacy anon key both work):
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
   ```
4. Install and start the app:
   ```bash
   npm install
   npm run dev
   ```
5. Open http://localhost:3000.

> For quick testing, you can turn off **Authentication → Sign In / Providers → Email → Confirm email** in Supabase so new accounts can log in right away.

### Optional demo account

1. Sign up in the app with `demo@spendwise.app` and a password of your choice.
2. Run [`supabase/seed-demo.sql`](supabase/seed-demo.sql) to add sample data.
3. Add `DEMO_EMAIL` and `DEMO_PASSWORD` to `.env.local` (and to Vercel). A **Try the demo account** button then appears on the login page.

## Project structure

```
src/
  proxy.ts                 refreshes the session, redirects logged-out users
  app/page.tsx             dashboard (Server Component)
  app/actions.ts           add, update and delete expense Server Actions
  app/login/               login and sign-up page and auth actions
  components/              ExpenseForm, ExpenseList, Filters, SummaryCards
  lib/supabase/            browser and server Supabase clients
  lib/expenses.ts          categories, types and formatting helpers
supabase/schema.sql        table and RLS policies
```
