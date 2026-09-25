"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isCategory } from "@/lib/expenses";

export type ExpenseFormState = { error?: string; ok?: boolean; key?: number };

function parseExpense(formData: FormData) {
  const amount = Number(formData.get("amount"));
  const category = formData.get("category");
  const spentOn = String(formData.get("spent_on") ?? "");
  const note = String(formData.get("note") ?? "").trim();

  if (!Number.isFinite(amount) || amount <= 0)
    return { error: "Amount must be greater than 0." } as const;
  if (amount >= 100_000_000) return { error: "Amount is too large." } as const;
  if (!isCategory(category)) return { error: "Pick a category." } as const;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(spentOn) || isNaN(Date.parse(spentOn)))
    return { error: "Pick a valid date." } as const;
  if (note.length > 200)
    return { error: "Note must be 200 characters or fewer." } as const;

  return {
    data: {
      amount: Math.round(amount * 100) / 100,
      category,
      spent_on: spentOn,
      note: note || null,
    },
  } as const;
}

export async function addExpense(
  _prev: ExpenseFormState,
  formData: FormData,
): Promise<ExpenseFormState> {
  const parsed = parseExpense(formData);
  if ("error" in parsed) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase.from("expenses").insert(parsed.data);
  if (error) return { error: error.message };

  revalidatePath("/");
  // A new key tells the form to reset its fields.
  return { ok: true, key: Date.now() };
}

export async function updateExpense(
  _prev: ExpenseFormState,
  formData: FormData,
): Promise<ExpenseFormState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing expense id." };

  const parsed = parseExpense(formData);
  if ("error" in parsed) return { error: parsed.error };

  // Row Level Security makes sure users can only update their own rows.
  const supabase = await createClient();
  const { error } = await supabase
    .from("expenses")
    .update(parsed.data)
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/");
  return { ok: true, key: Date.now() };
}

export async function deleteExpense(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/");
  return { ok: true };
}
