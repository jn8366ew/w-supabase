"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { PaymentStatus } from "@/types";

export async function updateAttendance(participantId: string, attended: boolean) {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims) redirect("/auth/login");

  const { error } = await supabase
    .from("participants")
    .update({ attended })
    .eq("id", participantId);

  if (error) throw new Error(error.message);
}

export async function updatePaymentStatus(participantId: string, paymentStatus: PaymentStatus) {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims) redirect("/auth/login");

  const { error } = await supabase
    .from("participants")
    .update({ payment_status: paymentStatus })
    .eq("id", participantId);

  if (error) throw new Error(error.message);
}
