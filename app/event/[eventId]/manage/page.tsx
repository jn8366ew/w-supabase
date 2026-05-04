"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  getMockEventDetail,
  mockParticipants,
  type MockParticipant,
} from "@/lib/mock-data";

const calcSummary = (participants: MockParticipant[], fee: number) => {
  const active = participants.filter((p) => p.status !== "canceled");
  const paid = active.filter((p) => p.payment_status === "paid").length;
  return {
    total: active.length,
    paid,
    unpaid: active.length - paid,
    totalAmount: paid * fee,
  };
};

type FilterTab = "all" | "applied" | "canceled";

export default function ManagePage() {
  const eventDetail = getMockEventDetail();
  const [participants, setParticipants] =
    useState<MockParticipant[]>(mockParticipants);
  const [filter, setFilter] = useState<FilterTab>("all");

  const toggleAttendance = (id: string) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, attended: !p.attended } : p))
    );
  };

  const togglePayment = (id: string) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, payment_status: p.payment_status === "paid" ? "unpaid" : "paid" }
          : p
      )
    );
  };

  const filtered = participants.filter((p) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  const summary = calcSummary(participants, eventDetail.fee);

  return (
    <main className="flex-1 w-full p-6 flex flex-col gap-6">
        <h1 className="text-2xl font-bold">참여자 관리</h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">정산 요약</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">신청 </span>
              <span className="font-medium">{summary.total}명</span>
            </div>
            <div>
              <span className="text-muted-foreground">입금 </span>
              <span className="font-medium">{summary.paid}명</span>
            </div>
            <div>
              <span className="text-muted-foreground">미입금 </span>
              <span className="font-medium">{summary.unpaid}명</span>
            </div>
            <div>
              <span className="text-muted-foreground">총 금액 </span>
              <span className="font-medium">{summary.totalAmount.toLocaleString("ko-KR")}원</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          {(["all", "applied", "canceled"] as FilterTab[]).map((tab) => (
            <Button
              key={tab}
              variant={filter === tab ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(tab)}
            >
              {tab === "all" ? "전체" : tab === "applied" ? "신청" : "취소"}
            </Button>
          ))}
        </div>

        <div className="rounded-md border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">이름</th>
                <th className="text-left px-4 py-3 font-medium">이메일</th>
                <th className="text-left px-4 py-3 font-medium">상태</th>
                <th className="text-center px-4 py-3 font-medium">참석</th>
                <th className="text-center px-4 py-3 font-medium">입금</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.email ?? "-"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={p.status === "applied" ? "secondary" : "outline"}>
                      {p.status === "applied" ? "신청" : "취소"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Checkbox
                      checked={p.attended}
                      onCheckedChange={() => toggleAttendance(p.id)}
                      disabled={p.status === "canceled"}
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => togglePayment(p.id)}
                      disabled={p.status === "canceled"}
                    >
                      <Badge
                        variant={p.payment_status === "paid" ? "default" : "outline"}
                      >
                        {p.payment_status === "paid" ? "입금" : "미입금"}
                      </Badge>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              참여자가 없습니다.
            </div>
          )}
        </div>
    </main>
  );
}
