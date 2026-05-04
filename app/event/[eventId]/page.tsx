import { redirect } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyLinkButton } from "@/components/copy-link-button";
import { formatCurrency, formatDate } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

import { NoticeForm } from "./_components/notice-form";
import { createNotice } from "./actions";

type EventPageParams = Promise<{ eventId: string }>;

export default function EventPage({ params }: { params: EventPageParams }) {
  return (
    <Suspense
      fallback={
        <main className="flex-1 w-full p-6">
          <div className="text-sm text-muted-foreground">이벤트를 불러오는 중...</div>
        </main>
      }
    >
      <EventContent params={params} />
    </Suspense>
  );
}

async function EventContent({ params }: { params: EventPageParams }) {
  const { eventId } = await params;
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims) redirect("/auth/login");

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .eq("host_id", claimsData.claims.sub)
    .single();

  if (!event) redirect("/dashboard");

  const [{ data: participants }, { data: notices }] = await Promise.all([
    supabase
      .from("participants")
      .select("status, attended")
      .eq("event_id", eventId),
    supabase
      .from("notices")
      .select("id, content, created_at")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false }),
  ]);

  const stats = {
    applied: (participants ?? []).filter((p) => p.status === "applied").length,
    canceled: (participants ?? []).filter((p) => p.status === "canceled").length,
    attended: (participants ?? []).filter((p) => p.attended).length,
  };

  const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/join/${eventId}`;
  const boundCreateNotice = createNotice.bind(null, eventId);

  return (
    <main className="flex-1 w-full p-6 flex flex-col gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
          <CardTitle>{event.title}</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/event/${eventId}/manage`}>참여자 관리</Link>
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
          <span>{formatDate(event.date)}</span>
          <span>{event.location}</span>
          <span>{formatCurrency(event.fee)}</span>
          {event.capacity !== null && <span>정원 {event.capacity}명</span>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">초대 링크</CardTitle>
        </CardHeader>
        <CardContent>
          <CopyLinkButton url={inviteUrl} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">참여자 현황</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Badge variant="secondary">신청 {stats.applied}명</Badge>
          <Badge variant="outline">취소 {stats.canceled}명</Badge>
          <Badge>참석 {stats.attended}명</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">공지 작성</CardTitle>
        </CardHeader>
        <CardContent>
          <NoticeForm action={boundCreateNotice} />
        </CardContent>
      </Card>

      {(notices ?? []).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">공지 목록</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {(notices ?? []).map((notice) => (
              <div key={notice.id} className="border-b last:border-0 pb-3 last:pb-0">
                <p className="text-sm">{notice.content}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(notice.created_at).toLocaleDateString("ko-KR", {
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </main>
  );
}
