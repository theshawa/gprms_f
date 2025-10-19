export type PayrollRecordStatus = "Draft" | "Processed" | "Paid";

export interface PayrollRecord {
  id: number;
  staffMemberId: number;
  month: number; // 1-12
  year: number;
  basicSalary: number;
  transportAllowance: number;
  mealAllowance: number;
  otherAllowance: number;
  bonusAmount: number;
  grossPay: number;
  taxAmount: number;
  epfAmount: number;
  totalDeductions: number;
  netPay: number;
  status: PayrollRecordStatus;
  paidAt: string | null;
  notes: string;
  processedBy: number | null;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
  staffMember?: {
    id: number;
    name: string;
    username: string;
    role: string;
  };
  processor?: {
    id: number;
    name: string;
    username: string;
  };
}
