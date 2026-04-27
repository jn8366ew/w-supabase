"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function NoticeForm() {
  const [content, setContent] = useState("");
  const [sendEmail, setSendEmail] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("공지 등록:", { content, sendEmail });
    setContent("");
    setSendEmail(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="공지 내용을 입력하세요"
        rows={4}
        required
        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
      />
      <div className="flex items-center gap-2">
        <Checkbox
          id="sendEmail"
          checked={sendEmail}
          onCheckedChange={(v) => setSendEmail(Boolean(v))}
        />
        <Label htmlFor="sendEmail" className="text-sm cursor-pointer">
          이메일 동의 참여자에게 발송
        </Label>
      </div>
      <Button type="submit" disabled={!content.trim()}>
        공지 등록
      </Button>
    </form>
  );
}
