"use client";

import { useActionState, useState } from "react";
import { demoLogin, login, signup, type AuthState } from "@/app/login/actions";

export default function AuthForm({ demoEnabled }: { demoEnabled: boolean }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loginState, loginAction, loginPending] = useActionState<
    AuthState,
    FormData
  >(login, {});
  const [signupState, signupAction, signupPending] = useActionState<
    AuthState,
    FormData
  >(signup, {});
  const [demoState, demoAction, demoPending] = useActionState<AuthState>(
    demoLogin,
    {},
  );

  const isLogin = mode === "login";
  const state = isLogin ? loginState : signupState;
  const pending = isLogin ? loginPending : signupPending;

  return (
    <div className="card p-6">
      <div className="mb-6 grid grid-cols-2 rounded-lg bg-background p-1 text-sm">
        {(["login", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-md py-1.5 font-medium transition ${
              mode === m ? "bg-card shadow-sm" : "text-muted"
            }`}
          >
            {m === "login" ? "Log in" : "Sign up"}
          </button>
        ))}
      </div>

      <form action={isLogin ? loginAction : signupAction} className="space-y-4">
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="field"
          />
        </div>
        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            minLength={6}
            required
            className="field"
          />
        </div>

        {state.error && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {state.error}
          </p>
        )}
        {state.message && (
          <p className="text-sm text-emerald-700 dark:text-emerald-400">
            {state.message}
          </p>
        )}

        <button type="submit" disabled={pending} className="btn-primary w-full">
          {pending
            ? "Please wait…"
            : isLogin
              ? "Log in"
              : "Create account"}
        </button>
      </form>

      {demoEnabled && (
        <form action={demoAction} className="mt-4 border-t border-border pt-4">
          <button
            type="submit"
            disabled={demoPending}
            className="btn-secondary w-full"
          >
            {demoPending ? "Opening demo…" : "Try the demo account"}
          </button>
          {demoState.error && (
            <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
              {demoState.error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
