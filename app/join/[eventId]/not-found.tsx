import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function JoinNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-bold">존재하지 않는 모임입니다</h1>
      <p className="text-muted-foreground text-sm">
        링크가 만료되었거나 모임이 삭제되었을 수 있습니다.
      </p>
      <Button variant="outline" asChild>
        <Link href="/">홈으로 이동</Link>
      </Button>
    </div>
  );
}
