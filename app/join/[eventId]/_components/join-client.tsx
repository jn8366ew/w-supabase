"use client";

import { useState } from "react";

import { formatDate, formatCurrency } from "@/lib/format";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { applyToEvent, cancelParticipation } from "../actions";

type JoinClientProps = {
  event: {
    id: string;
    title: string;
    date: string;
    location: string;
    fee: number;
    capacity: number | null;
  };
  latestNotice: { content: string } | null;
};

export function JoinClient({ event, latestNotice }: JoinClientProps) {
  const [step, setStep] = useState<"form" | "complete">("form");
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isEmailOptIn, setIsEmailOptIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      formData.set("is_email_opt_in", isEmailOptIn ? "true" : "false");
      const result = await applyToEvent(event.id, formData);
      setParticipantId(result.participantId);
      setStep("complete");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "신청에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!participantId) return;
    setIsLoading(true);
    setError(null);
    try {
      await cancelParticipation(participantId);
      setStep("form");
      setParticipantId(null);
      setName("");
      setEmail("");
      setIsEmailOptIn(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "취소에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 모임 정보 카드 */}
      <Card>
        <CardHeader>
          <CardTitle>{event.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">일시</span>{" "}
            {formatDate(event.date)}
          </p>
          <p>
            <span className="font-medium text-foreground">장소</span>{" "}
            {event.location}
          </p>
          <p>
            <span className="font-medium text-foreground">참가비</span>{" "}
            {formatCurrency(event.fee)}
          </p>
          {event.capacity !== null && (
            <p>
              <span className="font-medium text-foreground">정원</span>{" "}
              {event.capacity}명
            </p>
          )}
        </CardContent>
      </Card>

      {/* 공지 표시 */}
      {latestNotice && (
        <div className="rounded-md bg-muted px-4 py-3 text-sm">
          📢 {latestNotice.content}
        </div>
      )}

      {/* 에러 표시 */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* 신청 폼 or 완료 화면 */}
      {step === "form" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">참여 신청</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">이름 *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="이름을 입력하세요"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="이메일을 입력하세요 (선택)"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (!e.target.value) setIsEmailOptIn(false);
                  }}
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="is_email_opt_in"
                  checked={isEmailOptIn}
                  onCheckedChange={(checked) =>
                    setIsEmailOptIn(checked === true)
                  }
                  disabled={!email}
                />
                <Label
                  htmlFor="is_email_opt_in"
                  className="text-sm font-normal cursor-pointer"
                >
                  이메일로 공지 수신에 동의합니다
                </Label>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "신청 중..." : "신청하기"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">신청이 완료되었습니다!</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">이름</span>{" "}
                {name}
              </p>
              {email && (
                <p>
                  <span className="font-medium text-foreground">이메일</span>{" "}
                  {email}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              disabled={isLoading}
              onClick={handleCancel}
              className="w-full"
            >
              {isLoading ? "취소 중..." : "신청 취소"}
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
}
