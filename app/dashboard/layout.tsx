import Link from "next/link";

import { LogoutButton } from "@/components/logout-button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="font-bold text-lg">
          GroupMeet
        </Link>
        <LogoutButton />
      </header>
      <div className="flex-1 container mx-auto px-6 py-8 max-w-4xl">
        {children}
      </div>
    </div>
  );
}
