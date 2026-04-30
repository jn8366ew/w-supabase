"use client";

import { useTransition } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { createEventSchema, type CreateEventInput } from "@/lib/validations";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createEvent } from "../actions";

interface CreateEventFormProps {
  onCancel: () => void;
}

export function CreateEventForm({ onCancel }: CreateEventFormProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof createEventSchema>, unknown, CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      fee: 0,
    },
  });

  const onSubmit: SubmitHandler<CreateEventInput> = (data) => {
    const formData = new FormData();
    formData.set("title", data.title);
    formData.set("date", data.date);
    formData.set("location", data.location);
    formData.set("fee", String(data.fee));
    if (data.capacity != null) {
      formData.set("capacity", String(data.capacity));
    }
    startTransition(() => {
      createEvent(formData);
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>모임 만들기</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">모임 제목</Label>
            <Input id="title" {...register("title")} disabled={isPending} />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date">날짜/시간</Label>
            <Input
              id="date"
              type="datetime-local"
              {...register("date")}
              disabled={isPending}
            />
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">장소</Label>
            <Input id="location" {...register("location")} disabled={isPending} />
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fee">회비 (원)</Label>
            <Input
              id="fee"
              type="number"
              min="0"
              {...register("fee")}
              disabled={isPending}
            />
            {errors.fee && (
              <p className="text-sm text-red-500">{errors.fee.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="capacity">모집 인원</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              {...register("capacity", { setValueAs: (v) => (v === "" ? null : Number(v)) })}
              disabled={isPending}
            />
            {errors.capacity && (
              <p className="text-sm text-red-500">{errors.capacity.message}</p>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
            >
              취소
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "생성 중..." : "생성하기"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
