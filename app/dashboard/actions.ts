"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createEventSchema } from "@/lib/validations";

export async function createEvent(formData: FormData) {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims) redirect("/auth/login");

  const raw = {
    title: formData.get("title"),
    date: formData.get("date"),
    location: formData.get("location"),
    fee: formData.get("fee"),
    capacity: formData.get("capacity") || null,
  };

  const parsed = createEventSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  let eventId: string;
  try {
    const { data, error } = await supabase
      .from("events")
      .insert({
        host_id: claimsData.claims.sub,
        title: parsed.data.title,
        date: parsed.data.date,
        location: parsed.data.location,
        fee: parsed.data.fee,
        capacity: parsed.data.capacity ?? null,
      })
      .select("id")
      .single();
    if (error || !data) throw new Error(error?.message ?? "모임 생성에 실패했습니다");
    eventId = data.id;
  } catch (e: unknown) {
    throw new Error(e instanceof Error ? e.message : "모임 생성에 실패했습니다");
  }

  redirect(`/event/${eventId}`);
}
