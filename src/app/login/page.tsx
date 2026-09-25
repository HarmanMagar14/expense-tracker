import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = { title: "Log in · Spendwise" };

export default function LoginPage() {
  const demoEnabled = Boolean(
    process.env.DEMO_EMAIL && process.env.DEMO_PASSWORD,
  );

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-2xl font-bold text-white">
            $
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Spendwise</h1>
          <p className="mt-1 text-sm text-muted">
            Track where your money goes.
          </p>
        </div>
        <AuthForm demoEnabled={demoEnabled} />
      </div>
    </main>
  );
}
