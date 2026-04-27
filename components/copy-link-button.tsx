"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-2">
      <Input value={url} readOnly className="flex-1" />
      <Button variant="outline" onClick={handleCopy}>
        {copied ? "복사됨!" : "링크 복사"}
      </Button>
    </div>
  );
}
