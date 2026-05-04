"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type NoticeFormState = { error: string | null; key: number };

type NoticeFormProps = {
  action: (formData: FormData) => Promise<void>;
};

export function NoticeForm({ action }: NoticeFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: NoticeFormState, formData: FormData): Promise<NoticeFormState> => {
      try {
        await action(formData);
        return { error: null, key: prevState.key + 1 };
      } catch (e: unknown) {
        return {
          error: e instanceof Error ? e.message : "공지 등록에 실패했습니다",
          key: prevState.key,
        };
      }
    },
    { error: null, key: 0 }
  );

  return (
    <form key={state.key} action={formAction} className="flex flex-col gap-4">
      <textarea
        name="content"
        placeholder="공지 내용을 입력하세요"
        rows={4}
        required
        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
      />
      <div className="flex items-center gap-2">
        <Checkbox id="sendEmail" name="send_email" value="true" />
        <Label htmlFor="sendEmail" className="text-sm cursor-pointer">
          이메일 동의 참여자에게 발송
        </Label>
      </div>
      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "등록 중..." : "공지 등록"}
      </Button>
    </form>
  );
}
