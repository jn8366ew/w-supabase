import { Participant, PaymentSummary } from "@/types";

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString("ko-KR") + "원";
}

export function calcPaymentSummary(
  participants: Participant[],
  fee: number,
): PaymentSummary {
  const active = participants.filter((p) => p.status !== "canceled");
  const paid = active.filter((p) => p.payment_status === "paid").length;
  return {
    total: active.length,
    paid,
    unpaid: active.length - paid,
    totalAmount: paid * fee,
  };
}
