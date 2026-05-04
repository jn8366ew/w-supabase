"use server";

import { createClient } from "@/lib/supabase/server";
import { applyParticipantSchema } from "@/lib/validations";

export async function applyToEvent(
  eventId: string,
  formData: FormData
): Promise<{ participantId: string }> {
  const parsed = applyParticipantSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email") || undefined,
    is_email_opt_in: formData.get("is_email_opt_in") === "true",
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  // Email not provided: force opt-in to false
  if (!parsed.data.email) parsed.data.is_email_opt_in = false;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("participants")
    .insert({
      event_id: eventId,
      name: parsed.data.name,
      email: parsed.data.email || null,
      is_email_opt_in: parsed.data.is_email_opt_in,
      status: "applied",
    })
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message ?? "신청에 실패했습니다");
  return { participantId: data.id };
}

export async function cancelParticipation(participantId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("participants")
    .update({ status: "canceled" })
    .eq("id", participantId);

  if (error) throw new Error(error.message);
}
