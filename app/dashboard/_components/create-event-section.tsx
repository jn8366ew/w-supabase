"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { CreateEventForm } from "./create-event-form";

export function CreateEventSection() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">내 모임</h1>
        <Button onClick={() => setShowForm(!showForm)}>+ 모임 만들기</Button>
      </div>
      {showForm && <CreateEventForm onCancel={() => setShowForm(false)} />}
    </>
  );
}
