import { Suspense } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { ManageClient } from "./_components/manage-client";

type ManagePageParams = Promise<{ eventId: string }>;

export default function ManagePage({ params }: { params: ManagePageParams }) {
  return (
    <Suspense
      fallback={
        <main className="flex-1 w-full p-6">
          <div className="text-sm text-muted-foreground">참여자 목록을 불러오는 중...</div>
        </main>
      }
    >
      <ManageContent params={params} />
    </Suspense>
  );
}

async function ManageContent({ params }: { params: ManagePageParams }) {
  const { eventId } = await params;
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims) redirect("/auth/login");

  const { data: event } = await supabase
    .from("events")
    .select("fee")
    .eq("id", eventId)
    .eq("host_id", claimsData.claims.sub)
    .single();

  if (!event) redirect("/dashboard");

  const { data: participants } = await supabase
    .from("participants")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: true });

  return (
    <main className="flex-1 w-full p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">참여자 관리</h1>
      <ManageClient participants={participants ?? []} fee={event.fee} />
    </main>
  );
}
