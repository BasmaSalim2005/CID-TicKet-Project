export interface TicketStatusDetailsDTO {
  ticketId: number;
  status: string;   // current status
  createdAt: string | null;
  assignedAt: string | null;
  inProgressAt: string | null;
  solvedAt: string | null;
  approvedAt: string | null;
  closedAt: string | null;
  cancelledAt: string | null;
}
