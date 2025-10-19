import { staffBackend } from "@/backend";
import type { PayrollRecord } from "@/interfaces/payroll-record";
import type { StaffMember } from "@/interfaces/staff-member";
import type { StaffPayrollConfig } from "@/interfaces/staff-payroll-config";

export class PayrollService {
  // Staff configs
  static async getAllStaffConfigs() {
    const { data } = await staffBackend.get<StaffPayrollConfig[]>(
      "/admin/payroll/configs"
    );
    return data;
  }

  static async updateStaffConfig(
    staffId: number,
    payload: {
      basicSalary: number;
      transportAllowance: number;
      mealAllowance: number;
      otherAllowance: number;
      taxPercentage: number;
      epfPercentage: number;
    }
  ) {
    const { data } = await staffBackend.put<StaffPayrollConfig>(
      `/admin/payroll/config/${staffId}`,
      payload
    );
    return data;
  }

  // Payroll records
  static async getAllPayrolls() {
    const { data } = await staffBackend.get<
      Array<
        StaffMember & {
          payrollConfig: StaffPayrollConfig | null;
          payrollRecords: PayrollRecord[];
        }
      >
    >("/admin/payroll/records");
    return data;
  }

  static async createPayrollRecord(
    staffMemberId: number,
    month: number,
    year: number
  ) {
    const { data } = await staffBackend.post<PayrollRecord>(
      "/admin/payroll/record",
      {
        staffMemberId,
        month,
        year,
      }
    );
    return data;
  }

  static async calculateRecord(
    recordId: number,
    payload: {
      bonusAmount?: number;
      notes?: string;
    }
  ) {
    const { data } = await staffBackend.put<PayrollRecord>(
      `/admin/payroll/record/${recordId}`,
      payload
    );
    return data;
  }

  static async markRecordAsPaid(recordId: number) {
    const { data } = await staffBackend.post<PayrollRecord>(
      `/admin/payroll/record/${recordId}/mark-paid`
    );
    return data;
  }
}
