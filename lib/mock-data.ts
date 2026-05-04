export type MockEventDetail = {
  id: string;
  title: string;
  date: string;
  location: string;
  fee: number;
  capacity: number | null;
};

export type MockParticipantStatus = "applied" | "canceled";
export type MockPaymentStatus = "unpaid" | "paid";

export type MockParticipant = {
  id: string;
  name: string;
  email: string | null;
  status: MockParticipantStatus;
  attended: boolean;
  payment_status: MockPaymentStatus;
};

export type MockNotice = {
  id: string;
  content: string;
  created_at: string;
};

const mockEventDetail: MockEventDetail = {
  id: "mock-1",
  title: "5월 정기 모임",
  date: "2025-05-10T14:00:00",
  location: "강남역 스타벅스",
  fee: 10000,
  capacity: 15,
};

export const mockParticipants: MockParticipant[] = [
  {
    id: "p1",
    name: "김철수",
    email: "kim@example.com",
    status: "applied",
    attended: false,
    payment_status: "unpaid",
  },
  {
    id: "p2",
    name: "이영희",
    email: null,
    status: "applied",
    attended: true,
    payment_status: "paid",
  },
  {
    id: "p3",
    name: "박민수",
    email: "park@example.com",
    status: "canceled",
    attended: false,
    payment_status: "unpaid",
  },
  {
    id: "p4",
    name: "최지연",
    email: "choi@example.com",
    status: "applied",
    attended: false,
    payment_status: "paid",
  },
];

export const mockNotices: MockNotice[] = [
  {
    id: "n1",
    content: "준비물: 편한 복장",
    created_at: "2025-04-28T10:00:00",
  },
];

export function getMockEventDetail(eventId = mockEventDetail.id): MockEventDetail {
  return {
    ...mockEventDetail,
    id: eventId,
  };
}

export function getMockParticipantStats(participants = mockParticipants) {
  return {
    applied: participants.filter((p) => p.status === "applied").length,
    canceled: participants.filter((p) => p.status === "canceled").length,
    attended: participants.filter((p) => p.attended).length,
  };
}
