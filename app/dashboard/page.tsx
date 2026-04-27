"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MOCK_EVENTS = [
  {
    id: "mock-1",
    title: "5월 정기 모임",
    date: "2025-05-10T14:00:00",
    location: "강남역 스타벅스",
    fee: 10000,
    capacity: 15,
    participantCount: 8,
  },
  {
    id: "mock-2",
    title: "주말 등산 모임",
    date: "2025-05-17T08:00:00",
    location: "북한산 입구",
    fee: 5000,
    capacity: 10,
    participantCount: 5,
  },
];

export default function DashboardPage() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [fee, setFee] = useState("");
  const [capacity, setCapacity] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("모임 생성:", { title, date, location, fee, capacity });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold">GroupMeet</span>
        <Button variant="ghost">로그아웃</Button>
      </header>

      <main className="flex-1 w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">내 모임</h1>
          <Button onClick={() => setShowForm(!showForm)}>+ 모임 만들기</Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>모임 만들기</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">모임 제목</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">날짜/시간</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">장소</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fee">회비 (원)</Label>
                  <Input
                    id="fee"
                    type="number"
                    min="0"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="capacity">모집 인원</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    취소
                  </Button>
                  <Button type="submit">생성하기</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {MOCK_EVENTS.length === 0 ? (
          <div className="col-span-2 flex flex-col items-center justify-center py-16 text-center text-muted-foreground gap-2">
            <p className="text-lg font-medium">아직 모임이 없습니다</p>
            <p className="text-sm">+ 모임 만들기로 첫 모임을 시작해보세요</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {MOCK_EVENTS.map((event) => (
              <Link key={event.id} href={`/event/${event.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <span>
                      {new Date(event.date).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span>{event.location}</span>
                    <span>{event.fee.toLocaleString("ko-KR")}원</span>
                    <span>
                      {event.participantCount} / {event.capacity}명
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
