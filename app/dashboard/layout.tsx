import { LogoutButton } from "@/components/logout-button";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold">GroupMeet</span>
        <LogoutButton />
      </header>
      {children}
    </div>
  );
}
