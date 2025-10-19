import { staffBackend } from "@/backend";
import type { PayrollRecord } from "@/interfaces/payroll-record";
import type { StaffPayrollConfig } from "@/interfaces/staff-payroll-config";

export class StaffPayrollService {
  static async getMyConfig() {
    const { data } = await staffBackend.get<StaffPayrollConfig | null>(
      "/payroll/my-config"
    );
    return data;
  }

  static async getMyPayrollHistory() {
    const { data } = await staffBackend.get<PayrollRecord[]>(
      "/payroll/my-history"
    );
    return data;
  }

  static async getMyPayslip(recordId: number) {
    const { data } = await staffBackend.get<PayrollRecord>(
      `/payroll/my-payslip/${recordId}`
    );
    return data;
  }
}
