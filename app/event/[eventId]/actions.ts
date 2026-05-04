"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Resend } from "resend";

import { createClient } from "@/lib/supabase/server";
import { createNoticeSchema } from "@/lib/validations";

export async function createNotice(eventId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims) redirect("/auth/login");

  const { data: event } = await supabase
    .from("events")
    .select("id, title")
    .eq("id", eventId)
    .eq("host_id", claimsData.claims.sub)
    .single();

  if (!event) redirect("/dashboard");

  const parsed = createNoticeSchema.safeParse({
    content: formData.get("content"),
    send_email: formData.get("send_email") === "true",
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const { error: insertError } = await supabase.from("notices").insert({
    event_id: eventId,
    content: parsed.data.content,
    send_email: parsed.data.send_email,
  });

  if (insertError) throw new Error(insertError.message);

  if (parsed.data.send_email) {
    const { data: recipients } = await supabase
      .from("participants")
      .select("name, email")
      .eq("event_id", eventId)
      .eq("status", "applied")
      .eq("is_email_opt_in", true)
      .not("email", "is", null);

    if (recipients?.length) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await Promise.allSettled(
        recipients.map((p) =>
          resend.emails.send({
            from: "GroupMeet <noreply@groupmeet.app>",
            to: p.email!,
            subject: `[${event.title}] 새 공지가 등록되었습니다`,
            html: `<p>${p.name}님,</p><p>${parsed.data.content}</p><p>GroupMeet 드림</p>`,
          })
        )
      );
    }
  }

  revalidatePath(`/event/${eventId}`);
}
