import Link from "next/link";

import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">← 대시보드</Link>
          </Button>
          <span className="font-bold text-lg">GroupMeet</span>
        </div>
        <LogoutButton />
      </header>
      <div className="flex-1 container mx-auto px-6 py-8 max-w-4xl">
        {children}
      </div>
    </div>
  );
}
