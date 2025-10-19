export interface StaffPayrollConfig {
  id: number;
  staffMemberId: number;
  basicSalary: number;
  transportAllowance: number;
  mealAllowance: number;
  otherAllowance: number;
  taxPercentage: number;
  epfPercentage: number;
  createdAt: string;
  updatedAt: string;
  staffMember?: {
    id: number;
    name: string;
    username: string;
    role: string;
  };
}
