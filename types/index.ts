export type ParticipantStatus = "applied" | "canceled";
export type PaymentStatus = "unpaid" | "paid";

export interface User {
  id: string;
  email: string;
  name: string | null;
  provider: string | null;
  created_at: string;
}

export interface Event {
  id: string;
  host_id: string;
  title: string;
  date: string;
  location: string;
  fee: number;
  capacity: number | null;
  created_at: string;
}

export interface Participant {
  id: string;
  event_id: string;
  name: string;
  email: string | null;
  is_email_opt_in: boolean;
  status: ParticipantStatus;
  attended: boolean | null;
  payment_status: PaymentStatus;
  created_at: string;
}

export interface Notice {
  id: string;
  event_id: string;
  content: string;
  send_email: boolean;
  created_at: string;
}

export interface EventWithStats extends Event {
  participant_count?: number;
}

export interface ParticipantStats {
  applied: number;
  canceled: number;
  attended: number;
}

export interface PaymentSummary {
  total: number;
  paid: number;
  unpaid: number;
  totalAmount: number;
}
