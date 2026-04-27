import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(1, "모임 제목을 입력해주세요"),
  date: z.string().min(1, "날짜를 선택해주세요"),
  location: z.string().min(1, "장소를 입력해주세요"),
  fee: z.coerce.number().min(0).default(0),
  capacity: z.coerce.number().min(1).nullable().optional(),
});

export const applyParticipantSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  email: z.string().email("올바른 이메일 형식이 아닙니다").optional(),
  is_email_opt_in: z.boolean().default(false),
});

export const createNoticeSchema = z.object({
  content: z.string().min(1, "공지 내용을 입력해주세요"),
  send_email: z.boolean().default(false),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type ApplyParticipantInput = z.infer<typeof applyParticipantSchema>;
export type CreateNoticeInput = z.infer<typeof createNoticeSchema>;
