import { Suspense } from "react";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { JoinClient } from "./_components/join-client";

type JoinPageParams = Promise<{ eventId: string }>;

export default function JoinPage({ params }: { params: JoinPageParams }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-sm text-muted-foreground">모임 정보를 불러오는 중...</div>
        </div>
      }
    >
      <JoinContent params={params} />
    </Suspense>
  );
}

async function JoinContent({ params }: { params: JoinPageParams }) {
  const { eventId } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("id, title, date, location, fee, capacity")
    .eq("id", eventId)
    .single();

  if (!event) notFound();

  const { data: latestNotice } = await supabase
    .from("notices")
    .select("content")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col gap-4">
        <JoinClient event={event} latestNotice={latestNotice} />
      </div>
    </div>
  );
}
