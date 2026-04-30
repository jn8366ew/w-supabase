import { Suspense } from "react";

import { CreateEventSection } from "./_components/create-event-section";
import { EventList } from "./_components/event-list";

export default function DashboardPage() {
  return (
    <main className="flex-1 w-full p-6">
      <CreateEventSection />
      <Suspense
        fallback={
          <div className="py-16 text-center text-muted-foreground">
            로딩 중...
          </div>
        }
      >
        <EventList />
      </Suspense>
    </main>
  );
}
