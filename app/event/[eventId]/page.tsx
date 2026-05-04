import { Suspense } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyLinkButton } from "@/components/copy-link-button";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  getMockEventDetail,
  getMockParticipantStats,
  mockNotices,
} from "@/lib/mock-data";

import { NoticeForm } from "./_components/notice-form";

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
  const eventDetail = getMockEventDetail(eventId);
  const participantStats = getMockParticipantStats();
  const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/join/${eventId}`;

  return (
    <main className="flex-1 w-full p-6 flex flex-col gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
            <CardTitle>{eventDetail.title}</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/event/${eventId}/manage`}>참여자 관리</Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
            <span>{formatDate(eventDetail.date)}</span>
            <span>{eventDetail.location}</span>
            <span>{formatCurrency(eventDetail.fee)}</span>
            {eventDetail.capacity !== null && <span>정원 {eventDetail.capacity}명</span>}
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
            <Badge variant="secondary">신청 {participantStats.applied}명</Badge>
            <Badge variant="outline">취소 {participantStats.canceled}명</Badge>
            <Badge>참석 {participantStats.attended}명</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">공지 작성</CardTitle>
          </CardHeader>
          <CardContent>
            <NoticeForm />
          </CardContent>
        </Card>

        {mockNotices.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">공지 목록</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {mockNotices.map((notice) => (
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
