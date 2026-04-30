import { redirect } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { formatDate, formatCurrency } from "@/lib/format";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type EventRow = {
  id: string;
  title: string;
  date: string;
  location: string;
  fee: number;
  capacity: number | null;
  participants: { count: number }[];
};

export async function EventList() {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims) redirect("/auth/login");

  const { data: events } = await supabase
    .from("events")
    .select("*, participants(count)")
    .eq("host_id", claimsData.claims.sub)
    .order("date", { ascending: true });

  const eventList = (events as EventRow[]) ?? [];

  if (eventList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground gap-2">
        <p className="text-lg font-medium">아직 모임이 없습니다</p>
        <p className="text-sm">+ 모임 만들기로 첫 모임을 시작해보세요</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {eventList.map((event) => (
        <Link key={event.id} href={`/event/${event.id}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="text-lg">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
              <span>{formatDate(event.date)}</span>
              <span>{event.location}</span>
              <span>{formatCurrency(event.fee)}</span>
              <span>{event.participants[0]?.count ?? 0}명 신청</span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
