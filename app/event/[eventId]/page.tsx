import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyLinkButton } from "@/components/copy-link-button";

import { NoticeForm } from "./_components/notice-form";

const MOCK_EVENT = {
  id: "mock-1",
  title: "5월 정기 모임",
  date: "2025-05-10T14:00:00",
  location: "강남역 스타벅스",
  fee: 10000,
  capacity: 15,
};

const MOCK_STATS = { applied: 8, canceled: 2, attended: 0 };

const MOCK_NOTICES = [
  { id: "n1", content: "준비물: 편한 복장", created_at: "2025-04-28T10:00:00" },
];

export default function EventPage({ params }: { params: { eventId: string } }) {
  const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/join/${params.eventId}`;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold">
          GroupMeet
        </Link>
        <Button variant="ghost" asChild>
          <Link href="/dashboard">← 내 모임</Link>
        </Button>
      </header>

      <main className="flex-1 w-full p-6 flex flex-col gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
            <CardTitle>{MOCK_EVENT.title}</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/event/${params.eventId}/manage`}>참여자 관리</Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
            <span>
              {new Date(MOCK_EVENT.date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span>{MOCK_EVENT.location}</span>
            <span>{MOCK_EVENT.fee.toLocaleString("ko-KR")}원</span>
            <span>정원 {MOCK_EVENT.capacity}명</span>
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
            <Badge variant="secondary">신청 {MOCK_STATS.applied}명</Badge>
            <Badge variant="outline">취소 {MOCK_STATS.canceled}명</Badge>
            <Badge>참석 {MOCK_STATS.attended}명</Badge>
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

        {MOCK_NOTICES.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">공지 목록</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {MOCK_NOTICES.map((notice) => (
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
    </div>
  );
}
