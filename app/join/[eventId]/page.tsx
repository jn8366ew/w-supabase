"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MOCK_EVENT = {
  id: "mock-1",
  title: "5월 정기 모임",
  date: "2025-05-10T14:00:00",
  location: "강남역 스타벅스",
  fee: 10000,
  capacity: 15,
};

const MOCK_NOTICE = { content: "준비물: 편한 복장" };

export default function JoinPage() {
  const [step, setStep] = useState<"form" | "complete">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isEmailOptIn, setIsEmailOptIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("신청:", { name, email, isEmailOptIn });
    setStep("complete");
  };

  const handleCancel = () => {
    setStep("form");
    setName("");
    setEmail("");
    setIsEmailOptIn(false);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (!value) setIsEmailOptIn(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{MOCK_EVENT.title}</CardTitle>
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
            <span>회비 {MOCK_EVENT.fee.toLocaleString("ko-KR")}원</span>
            <span>정원 {MOCK_EVENT.capacity}명</span>
          </CardContent>
        </Card>

        {MOCK_NOTICE && (
          <div className="rounded-md bg-muted px-4 py-3 text-sm">
            📢 {MOCK_NOTICE.content}
          </div>
        )}

        {step === "form" ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">참여 신청</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">
                    이름 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름을 입력하세요"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">
                    이메일{" "}
                    <span className="text-muted-foreground text-xs">(선택)</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="emailOptIn"
                    checked={isEmailOptIn}
                    onCheckedChange={(v) => setIsEmailOptIn(Boolean(v))}
                    disabled={!email}
                  />
                  <Label
                    htmlFor="emailOptIn"
                    className={`text-sm cursor-pointer ${!email ? "text-muted-foreground" : ""}`}
                  >
                    공지 이메일 수신 동의
                  </Label>
                </div>
                <Button type="submit">신청하기</Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">신청이 완료되었습니다!</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="text-sm flex flex-col gap-1">
                <p>
                  <span className="text-muted-foreground">이름 </span>
                  {name}
                </p>
                {email && (
                  <p>
                    <span className="text-muted-foreground">이메일 </span>
                    {email}
                  </p>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                모임 당일 참석 부탁드립니다.
              </p>
              <Button variant="outline" onClick={handleCancel}>
                신청 취소
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
