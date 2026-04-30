import Link from "next/link";

import { LogoutButton } from "@/components/logout-button";

export default function EventLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold">
          GroupMeet
        </Link>
        <LogoutButton />
      </header>
      {children}
    </div>
  );
}
