import { useAlert } from "@/hooks/useAlert";
import { useConfirmation } from "@/hooks/useConfirmation";
import type { PayrollRecord } from "@/interfaces/payroll-record";
import type { StaffMember } from "@/interfaces/staff-member";
import type { StaffPayrollConfig } from "@/interfaces/staff-payroll-config";
import { PayrollService } from "@/services/staff/admin/payroll";
import {
  ArrowBack,
  PictureAsPdf,
  Settings,
  Visibility,
  History,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type FC, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QKs } from "../../query-keys";
import { PageError } from "../../shared/page-error";
import { PageLayout } from "../../shared/page-layout";
import { PageLoader } from "../../shared/page-loader";

type StaffWithPayrolls = StaffMember & {
  payrollConfig: StaffPayrollConfig | null;
  payrollRecords: PayrollRecord[];
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const Admin_PayrollPage: FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useAlert();
  const { confirm: showConfirmation } = useConfirmation();
  const queryClient = useQueryClient();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffWithPayrolls | null>(
    null
  );
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PayrollRecord | null>(
    null
  );
  const [bonusAmount, setBonusAmount] = useState(0);
  const [notes, setNotes] = useState("");

  // Filters
  const [filterMonth, setFilterMonth] = useState<number | "all">("all");
  const [filterYear, setFilterYear] = useState<number>(
    new Date().getFullYear()
  );

  // Details dialog
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(
    null
  );

  // Payment History dialog
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [historyStaff, setHistoryStaff] = useState<StaffWithPayrolls | null>(null);
  const [historyFilterMonth, setHistoryFilterMonth] = useState<number | "all">("all");
  const [historyFilterYear, setHistoryFilterYear] = useState<number | "all">("all");

  // Fetch all staff with payroll data
  const {
    isPending,
    error,
    data: staffList = [],
  } = useQuery({
    queryKey: QKs.admin_payroll_records,
    queryFn: () => PayrollService.getAllPayrolls(),
  });

  // Create payroll mutation
  const createMutation = useMutation({
    mutationFn: (data: {
      staffMemberId: number;
      month: number;
      year: number;
    }) =>
      PayrollService.createPayrollRecord(
        data.staffMemberId,
        data.month,
        data.year
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QKs.admin_payroll_records });
      setCreateDialogOpen(false);
      setSelectedStaff(null);
      showSuccess("Payroll record created successfully");
    },
    onError: (error: any) => {
      showError(
        error.response?.data?.message || "Failed to create payroll record"
      );
    },
  });

  // Calculate mutation
  const calculateMutation = useMutation({
    mutationFn: (data: {
      recordId: number;
      bonusAmount?: number;
      notes?: string;
    }) =>
      PayrollService.calculateRecord(data.recordId, {
        bonusAmount: data.bonusAmount,
        notes: data.notes,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QKs.admin_payroll_records });
      setEditDialogOpen(false);
      setEditingRecord(null);
      setBonusAmount(0);
      setNotes("");
      showSuccess("Payroll calculated successfully");
    },
    onError: (error: any) => {
      showError(error.response?.data?.message || "Failed to calculate payroll");
    },
  });

  // Mark paid mutation
  const markPaidMutation = useMutation({
    mutationFn: (recordId: number) => PayrollService.markRecordAsPaid(recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QKs.admin_payroll_records });
      showSuccess("Payroll marked as paid");
    },
    onError: (error: any) => {
      showError(error.response?.data?.message || "Failed to mark as paid");
    },
  });

  const handleCreatePayroll = () => {
    if (!selectedStaff) return;
    createMutation.mutate({
      staffMemberId: selectedStaff.id,
      month: selectedMonth,
      year: selectedYear,
    });
  };

  const handleCalculate = (record: PayrollRecord) => {
    setEditingRecord(record);
    setBonusAmount(record.bonusAmount || 0);
    setNotes(record.notes || "");
    setEditDialogOpen(true);
  };

  const handleSaveCalculation = () => {
    if (!editingRecord) return;
    calculateMutation.mutate({
      recordId: editingRecord.id,
      bonusAmount,
      notes,
    });
  };

  const handleMarkPaid = async (record: PayrollRecord) => {
    const confirmed = await showConfirmation({
      title: "Confirm Payment",
      message: `Mark ${record.staffMember.name}'s ${MONTHS[record.month - 1]} ${
        record.year
      } payroll as paid? Net Pay: Rs. ${record.netPay?.toLocaleString()}`,
    });
    if (confirmed) {
      markPaidMutation.mutate(record.id);
    }
  };

  const handleManageConfigs = () => {
    navigate("/staff/admin/payroll/configs");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "default";
      case "Processed":
        return "warning";
      case "Paid":
        return "success";
      default:
        return "default";
    }
  };

  const getLatestRecord = (records: PayrollRecord[]): PayrollRecord | null => {
    if (records.length === 0) return null;
    return records.reduce((latest, current) => {
      if (current.year > latest.year) return current;
      if (current.year === latest.year && current.month > latest.month)
        return current;
      return latest;
    });
  };

  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  // Filter staff based on selected month/year
  const filteredStaffList = useMemo(() => {
    if (filterMonth === "all") {
      return staffList;
    }

    return staffList.map((staff) => ({
      ...staff,
      payrollRecords: staff.payrollRecords.filter(
        (record) => record.month === filterMonth && record.year === filterYear
      ),
    }));
  }, [staffList, filterMonth, filterYear]);

  // Get all paid records for selected month (for PDF export)
  const paidRecordsForMonth = useMemo(() => {
    if (filterMonth === "all") return [];

    const records: Array<{ staff: StaffWithPayrolls; record: PayrollRecord }> =
      [];
    staffList.forEach((staff) => {
      const record = staff.payrollRecords.find(
        (r) =>
          r.month === filterMonth &&
          r.year === filterYear &&
          r.status === "Paid"
      );
      if (record) {
        records.push({ staff, record });
      }
    });
    return records;
  }, [staffList, filterMonth, filterYear]);

  const handleViewDetails = (record: PayrollRecord) => {
    setSelectedRecord(record);
    setDetailsDialogOpen(true);
  };

  const handleExportPDF = () => {
    if (filterMonth === "all") {
      showError("Please select a specific month to export PDF");
      return;
    }

    if (paidRecordsForMonth.length === 0) {
      showError("No paid records found for the selected month");
      return;
    }

    // Generate PDF content
    const monthName = MONTHS[filterMonth - 1];
    let pdfContent = `
      <html>
        <head>
          <title>Payroll Report - ${monthName} ${filterYear}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #4CAF50; color: white; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            .total-row { font-weight: bold; background-color: #e8f5e9 !important; }
            .header-info { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>Payroll Report</h1>
          <div class="header-info">
            <p><strong>Period:</strong> ${monthName} ${filterYear}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Total Employees:</strong> ${
              paidRecordsForMonth.length
            }</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Role</th>
                <th>Basic Salary</th>
                <th>Allowances</th>
                <th>Bonus</th>
                <th>Gross Pay</th>
                <th>Deductions</th>
                <th>Net Pay</th>
                <th>Paid Date</th>
              </tr>
            </thead>
            <tbody>
    `;

    let totalGross = 0;
    let totalDeductions = 0;
    let totalNet = 0;

    paidRecordsForMonth.forEach(({ staff, record }) => {
      totalGross += record.grossPay || 0;
      totalDeductions += record.totalDeductions || 0;
      totalNet += record.netPay || 0;

      const allowances =
        (record.transportAllowance || 0) +
        (record.mealAllowance || 0) +
        (record.otherAllowance || 0);

      pdfContent += `
        <tr>
          <td>${staff.name}</td>
          <td>${staff.role}</td>
          <td>${formatCurrency(record.basicSalary || 0)}</td>
          <td>${formatCurrency(allowances)}</td>
          <td>${formatCurrency(record.bonusAmount || 0)}</td>
          <td>${formatCurrency(record.grossPay || 0)}</td>
          <td>${formatCurrency(record.totalDeductions || 0)}</td>
          <td>${formatCurrency(record.netPay || 0)}</td>
          <td>${
            record.paidAt ? new Date(record.paidAt).toLocaleDateString() : "-"
          }</td>
        </tr>
      `;
    });

    pdfContent += `
              <tr class="total-row">
                <td colspan="5">TOTAL</td>
                <td>${formatCurrency(totalGross)}</td>
                <td>${formatCurrency(totalDeductions)}</td>
                <td>${formatCurrency(totalNet)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `;

    // Open print dialog directly
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(pdfContent);
      printWindow.document.close();
      
      // Auto-trigger print and close after
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      };
    }
  };

  const handleDownloadEmployeePDF = (
    staff: StaffWithPayrolls,
    record: PayrollRecord
  ) => {
    const monthName = MONTHS[record.month - 1];

    const pdfContent = `
      <html>
        <head>
          <title>Payslip - ${staff.name} - ${monthName} ${record.year}</title>
          <style>
            @page {
              size: A4;
              margin: 15mm;
            }
            body {
              font-family: Arial, sans-serif;
              padding: 0;
              margin: 0;
              font-size: 11pt;
            }
            .header {
              text-align: center;
              margin-bottom: 15px;
              border-bottom: 2px solid #4CAF50;
              padding-bottom: 10px;
            }
            .company-name {
              font-size: 20pt;
              font-weight: bold;
              color: #333;
              margin: 0 0 5px 0;
            }
            .payslip-title {
              font-size: 14pt;
              color: #666;
              margin: 5px 0;
            }
            .status-badge {
              display: inline-block;
              padding: 3px 12px;
              border-radius: 12px;
              font-weight: bold;
              font-size: 9pt;
              margin-top: 5px;
              ${
                record.status === "Paid"
                  ? "background-color: #4CAF50; color: white;"
                  : record.status === "Processed"
                  ? "background-color: #FF9800; color: white;"
                  : "background-color: #9E9E9E; color: white;"
              }
            }
            .employee-info {
              background-color: #f5f5f5;
              padding: 12px;
              margin-bottom: 15px;
              border-radius: 4px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px;
            }
            .info-item {
              display: flex;
              gap: 8px;
            }
            .info-label {
              font-weight: bold;
              color: #555;
              min-width: 100px;
            }
            .info-value {
              color: #333;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 15px;
            }
            th, td {
              border: 1px solid #ccc;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #4CAF50;
              color: white;
              font-weight: bold;
              font-size: 10pt;
            }
            .section-title {
              background-color: #e8e8e8;
              font-weight: bold;
              color: #333;
              font-size: 10pt;
            }
            .amount {
              text-align: right;
            }
            .total-row {
              font-weight: bold;
              background-color: #e8f5e9;
            }
            .net-pay-row {
              font-weight: bold;
              background-color: #4CAF50;
              color: white;
              font-size: 11pt;
            }
            .notes-section {
              background-color: #fff8e1;
              padding: 10px;
              border-radius: 4px;
              border-left: 3px solid #ffc107;
              margin-bottom: 15px;
              font-size: 10pt;
            }
            .footer {
              margin-top: 15px;
              padding-top: 10px;
              border-top: 1px solid #ddd;
              text-align: center;
              color: #666;
              font-size: 9pt;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">RestoEase Restaurant</div>
            <div class="payslip-title">PAYSLIP</div>
            <div>
              <span class="status-badge">${record.status}</span>
            </div>
          </div>

          <div class="employee-info">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Employee:</span>
                <span class="info-value">${staff.name}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Role:</span>
                <span class="info-value">${staff.role}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Pay Period:</span>
                <span class="info-value">${monthName} ${record.year}</span>
              </div>
              ${
                record.paidAt
                  ? `<div class="info-item">
                  <span class="info-label">Payment Date:</span>
                  <span class="info-value">${new Date(
                    record.paidAt
                  ).toLocaleDateString()}</span>
                </div>`
                  : ""
              }
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th class="amount">Amount (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              <tr class="section-title">
                <td colspan="2">EARNINGS</td>
              </tr>
              <tr>
                <td>Basic Salary</td>
                <td class="amount">${(
                  record.basicSalary || 0
                ).toLocaleString()}</td>
              </tr>
              <tr>
                <td>Transport Allowance</td>
                <td class="amount">${(
                  record.transportAllowance || 0
                ).toLocaleString()}</td>
              </tr>
              <tr>
                <td>Meal Allowance</td>
                <td class="amount">${(
                  record.mealAllowance || 0
                ).toLocaleString()}</td>
              </tr>
              <tr>
                <td>Other Allowance</td>
                <td class="amount">${(
                  record.otherAllowance || 0
                ).toLocaleString()}</td>
              </tr>
              <tr>
                <td>Bonus</td>
                <td class="amount">${(
                  record.bonusAmount || 0
                ).toLocaleString()}</td>
              </tr>
              <tr class="total-row">
                <td>GROSS PAY</td>
                <td class="amount">${(
                  record.grossPay || 0
                ).toLocaleString()}</td>
              </tr>

              <tr class="section-title">
                <td colspan="2">DEDUCTIONS</td>
              </tr>
              <tr>
                <td>Tax (${staff.payrollConfig?.taxPercentage || 0}%)</td>
                <td class="amount">${(
                  record.taxAmount || 0
                ).toLocaleString()}</td>
              </tr>
              <tr>
                <td>EPF (${staff.payrollConfig?.epfPercentage || 0}%)</td>
                <td class="amount">${(
                  record.epfAmount || 0
                ).toLocaleString()}</td>
              </tr>
              <tr class="total-row">
                <td>TOTAL DEDUCTIONS</td>
                <td class="amount">${(
                  record.totalDeductions || 0
                ).toLocaleString()}</td>
              </tr>

              <tr class="net-pay-row">
                <td>NET PAY</td>
                <td class="amount">${(record.netPay || 0).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          ${
            record.notes
              ? `<div class="notes-section">
              <strong style="font-size: 10pt;">Notes:</strong><br>
              <span style="font-size: 9pt;">${record.notes}</span>
            </div>`
              : ""
          }

          <div class="footer">
            <div>This is a computer-generated payslip.</div>
            <div>Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
            ${
              record.processor
                ? `<div>Processed by: ${record.processor.name}</div>`
                : ""
            }
          </div>
        </body>
      </html>
    `;

    // Open print dialog directly
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(pdfContent);
      printWindow.document.close();
      
      // Auto-trigger print and close after
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      };
    }
  };

  const handleOpenHistory = (staff: StaffWithPayrolls) => {
    setHistoryStaff(staff);
    setHistoryFilterMonth("all");
    setHistoryFilterYear("all");
    setHistoryDialogOpen(true);
  };

  const handleDownloadHistoryPDF = (record: PayrollRecord) => {
    if (record.status !== "Paid") {
      showError("Only paid records can be downloaded as payment slips");
      return;
    }
    if (historyStaff) {
      handleDownloadEmployeePDF(historyStaff, record);
    }
  };

  const handleDownloadAllHistoryPDF = () => {
    if (!historyStaff) return;

    const filteredRecords = historyStaff.payrollRecords.filter((record) => {
      const monthMatch = historyFilterMonth === "all" || record.month === historyFilterMonth;
      const yearMatch = historyFilterYear === "all" || record.year === historyFilterYear;
      const isPaid = record.status === "Paid";
      return monthMatch && yearMatch && isPaid;
    });

    if (filteredRecords.length === 0) {
      showError("No paid records found for the selected period");
      return;
    }

    // Generate combined PDF for all filtered records
    const title = historyFilterMonth === "all" && historyFilterYear === "all"
      ? `Complete Payment History - ${historyStaff.name}`
      : historyFilterMonth === "all"
      ? `Payment History ${historyFilterYear} - ${historyStaff.name}`
      : `Payment History ${MONTHS[historyFilterMonth - 1]} ${historyFilterYear === "all" ? "" : historyFilterYear} - ${historyStaff.name}`;

    let pdfContent = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            @page {
              size: A4;
              margin: 15mm;
            }
            body {
              font-family: Arial, sans-serif;
              padding: 0;
              margin: 0;
              font-size: 10pt;
            }
            .header {
              text-align: center;
              margin-bottom: 15px;
              border-bottom: 2px solid #4CAF50;
              padding-bottom: 10px;
            }
            .company-name {
              font-size: 18pt;
              font-weight: bold;
              color: #333;
              margin: 0;
            }
            .report-title {
              font-size: 12pt;
              color: #666;
              margin: 5px 0 0 0;
            }
            .employee-info {
              background-color: #f5f5f5;
              padding: 10px 15px;
              margin-bottom: 15px;
              border-radius: 4px;
              font-size: 9pt;
              line-height: 1.6;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 15px;
              font-size: 9pt;
            }
            th, td {
              border: 1px solid #ccc;
              padding: 6px 8px;
              text-align: left;
            }
            th {
              background-color: #4CAF50;
              color: white;
              font-weight: bold;
              font-size: 9pt;
            }
            .amount {
              text-align: right;
            }
            .total-row {
              font-weight: bold;
              background-color: #fff8e0;
            }
            .summary {
              background-color: #e3f2fd;
              padding: 12px;
              border-radius: 4px;
              margin-top: 15px;
              page-break-inside: avoid;
            }
            .summary h3 {
              margin: 0 0 10px 0;
              font-size: 11pt;
              color: #333;
            }
            .summary-item {
              display: flex;
              justify-content: space-between;
              margin: 6px 0;
              font-size: 10pt;
            }
            .summary-label {
              font-weight: bold;
            }
            .grand-total {
              font-size: 12pt;
              color: #4CAF50;
              font-weight: bold;
              border-top: 2px solid #4CAF50;
              padding-top: 10px;
              margin-top: 10px;
            }
            .footer {
              margin-top: 15px;
              padding-top: 8px;
              border-top: 1px solid #ddd;
              text-align: center;
              color: #666;
              font-size: 8pt;
              page-break-inside: avoid;
            }
            @media print {
              .page-break {
                page-break-before: always;
              }
              tbody tr {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">RestoEase Restaurant</div>
            <div class="report-title">${title}</div>
          </div>

          <div class="employee-info">
            <strong>Employee:</strong> ${historyStaff.name} &nbsp;&nbsp;
            <strong>Role:</strong> ${historyStaff.role} &nbsp;&nbsp;
            <strong>Period:</strong> ${historyFilterMonth === "all" && historyFilterYear === "all" 
              ? "All Time" 
              : historyFilterMonth === "all" 
              ? `Year ${historyFilterYear}` 
              : historyFilterYear === "all"
              ? `${MONTHS[historyFilterMonth - 1]} - All Years`
              : `${MONTHS[historyFilterMonth - 1]} ${historyFilterYear}`} &nbsp;&nbsp;
            <strong>Records:</strong> ${filteredRecords.length}
          </div>

          <table>
            <thead>
              <tr>
                <th>Period</th>
                <th>Status</th>
                <th class="amount">Basic Salary</th>
                <th class="amount">Allowances</th>
                <th class="amount">Bonus</th>
                <th class="amount">Gross Pay</th>
                <th class="amount">Deductions</th>
                <th class="amount">Net Pay</th>
              </tr>
            </thead>
            <tbody>
    `;

    let totalGrossPay = 0;
    let totalDeductions = 0;
    let totalNetPay = 0;

    filteredRecords
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      })
      .forEach((record) => {
        const allowances = (record.transportAllowance || 0) + 
                          (record.mealAllowance || 0) + 
                          (record.otherAllowance || 0);
        
        totalGrossPay += record.grossPay || 0;
        totalDeductions += record.totalDeductions || 0;
        totalNetPay += record.netPay || 0;

        pdfContent += `
              <tr>
                <td>${MONTHS[record.month - 1]} ${record.year}</td>
                <td>${record.status}</td>
                <td class="amount">${(record.basicSalary || 0).toLocaleString()}</td>
                <td class="amount">${allowances.toLocaleString()}</td>
                <td class="amount">${(record.bonusAmount || 0).toLocaleString()}</td>
                <td class="amount">${(record.grossPay || 0).toLocaleString()}</td>
                <td class="amount">${(record.totalDeductions || 0).toLocaleString()}</td>
                <td class="amount">${(record.netPay || 0).toLocaleString()}</td>
              </tr>
        `;
      });

    pdfContent += `
              <tr class="total-row">
                <td colspan="5">TOTAL</td>
                <td class="amount">${totalGrossPay.toLocaleString()}</td>
                <td class="amount">${totalDeductions.toLocaleString()}</td>
                <td class="amount">${totalNetPay.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <div class="summary">
            <h3>Payment Summary</h3>
            <div class="summary-item">
              <span class="summary-label">Total Gross Pay:</span>
              <span>Rs. ${totalGrossPay.toLocaleString()}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Total Deductions:</span>
              <span>Rs. ${totalDeductions.toLocaleString()}</span>
            </div>
            <div class="summary-item grand-total">
              <span>Total Net Pay:</span>
              <span>Rs. ${totalNetPay.toLocaleString()}</span>
            </div>
          </div>

          <div class="footer">
            <div>Computer-generated report | Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(pdfContent);
      printWindow.document.close();
      
      // Auto-trigger print and close after
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      };
    }
  };

  if (isPending) {
    return <PageLoader />;
  }

  if (error) {
    return <PageError title="staff payroll data" error={error} />;
  }

  return (
    <PageLayout
      title="Staff Payroll Management"
      subtitle="Create and manage individual staff payroll records."
      button={{
        icon: <Settings />,
        text: "Salary Configs",
        onClick: handleManageConfigs,
      }}
    >
      {/* Back Button */}
      <Box sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/staff/admin")}
          variant="outlined"
          size="small"
        >
          Back to Dashboard
        </Button>
      </Box>

      {/* Filters and Export */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filter by Month</InputLabel>
                <Select
                  value={filterMonth}
                  label="Filter by Month"
                  onChange={(e) =>
                    setFilterMonth(e.target.value as number | "all")
                  }
                >
                  <MenuItem value="all">All Months</MenuItem>
                  {MONTHS.map((month, idx) => (
                    <MenuItem key={idx} value={idx + 1}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                fullWidth
                label="Filter by Year"
                type="number"
                value={filterYear}
                onChange={(e) => setFilterYear(Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<PictureAsPdf />}
                onClick={handleExportPDF}
                disabled={filterMonth === "all"}
              >
                Export PDF
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="caption" color="text.secondary">
                {filterMonth !== "all" && paidRecordsForMonth.length > 0
                  ? `${paidRecordsForMonth.length} paid record(s) for export`
                  : filterMonth !== "all"
                  ? "No paid records for selected month"
                  : "Select a month to export PDF"}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              <TableCell>Staff Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right">Basic Salary</TableCell>
              <TableCell>Latest Payroll</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Latest Net Pay</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStaffList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 4 }}
                  >
                    No staff members found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredStaffList.map((staff) => {
                const latestRecord = getLatestRecord(staff.payrollRecords);
                return (
                  <TableRow key={staff.id} hover>
                    <TableCell>{staff.name}</TableCell>
                    <TableCell>{staff.role}</TableCell>
                    <TableCell align="right">
                      {staff.payrollConfig
                        ? formatCurrency(staff.payrollConfig.basicSalary)
                        : "Not configured"}
                    </TableCell>
                    <TableCell>
                      {latestRecord
                        ? `${MONTHS[latestRecord.month - 1]} ${
                            latestRecord.year
                          }`
                        : "No records"}
                    </TableCell>
                    <TableCell>
                      {latestRecord ? (
                        <Chip
                          label={latestRecord.status}
                          color={getStatusColor(latestRecord.status) as any}
                          size="small"
                        />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {latestRecord?.netPay
                        ? formatCurrency(latestRecord.netPay)
                        : "-"}
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "flex-end",
                          flexWrap: "wrap",
                        }}
                      >
                        {latestRecord && (
                          <>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleViewDetails(latestRecord)}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            {latestRecord.status === "Paid" && (
                              <Tooltip title="Download Payslip PDF">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() =>
                                    handleDownloadEmployeePDF(staff, latestRecord)
                                  }
                                >
                                  <PictureAsPdf fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </>
                        )}

                        <Tooltip title="Payment History">
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => handleOpenHistory(staff)}
                          >
                            <History fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setSelectedStaff(staff);
                            setCreateDialogOpen(true);
                          }}
                          disabled={!staff.payrollConfig}
                        >
                          Create
                        </Button>

                        {latestRecord?.status === "Draft" && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleCalculate(latestRecord)}
                          >
                            Calculate
                          </Button>
                        )}

                        {latestRecord?.status === "Processed" && (
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleMarkPaid(latestRecord)}
                          >
                            Mark Paid
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Payroll Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create Payroll Record</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <Typography>
              Staff: <strong>{selectedStaff?.name}</strong>
            </Typography>

            <FormControl fullWidth>
              <InputLabel>Month</InputLabel>
              <Select
                value={selectedMonth}
                label="Month"
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {MONTHS.map((month, idx) => (
                  <MenuItem key={idx} value={idx + 1}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Year"
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreatePayroll}
            variant="contained"
            disabled={createMutation.isPending}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Calculate Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Calculate Payroll</DialogTitle>
        <DialogContent>
          {editingRecord && (
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {editingRecord.staffMember.name} -{" "}
                    {MONTHS[editingRecord.month - 1]} {editingRecord.year}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Basic Salary:{" "}
                    {formatCurrency(
                      editingRecord.staffMember.payrollConfig?.basicSalary || 0
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Transport:{" "}
                    {formatCurrency(
                      editingRecord.staffMember.payrollConfig
                        ?.transportAllowance || 0
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Meal:{" "}
                    {formatCurrency(
                      editingRecord.staffMember.payrollConfig?.mealAllowance ||
                        0
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Other:{" "}
                    {formatCurrency(
                      editingRecord.staffMember.payrollConfig?.otherAllowance ||
                        0
                    )}
                  </Typography>
                </CardContent>
              </Card>

              <TextField
                label="Bonus Amount (Rs.)"
                type="number"
                value={bonusAmount}
                onChange={(e) => setBonusAmount(Number(e.target.value))}
                fullWidth
              />

              <TextField
                label="Notes (Optional)"
                multiline
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                fullWidth
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSaveCalculation}
            variant="contained"
            disabled={calculateMutation.isPending}
          >
            Calculate & Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Payment Details</DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {selectedRecord.staffMember.name} -{" "}
                        {MONTHS[selectedRecord.month - 1]} {selectedRecord.year}
                      </Typography>
                      <Chip
                        label={selectedRecord.status}
                        color={getStatusColor(selectedRecord.status) as any}
                        size="small"
                        sx={{ mb: 2 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        color="primary"
                        gutterBottom
                      >
                        Earnings
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="body2">Basic Salary:</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(selectedRecord.basicSalary || 0)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="body2">
                            Transport Allowance:
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(
                              selectedRecord.transportAllowance || 0
                            )}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="body2">
                            Meal Allowance:
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(selectedRecord.mealAllowance || 0)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="body2">
                            Other Allowance:
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(selectedRecord.otherAllowance || 0)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="body2">Bonus:</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(selectedRecord.bonusAmount || 0)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            pt: 1,
                            borderTop: "1px solid #ddd",
                          }}
                        >
                          <Typography variant="body1" fontWeight="bold">
                            Gross Pay:
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            color="success.main"
                          >
                            {formatCurrency(selectedRecord.grossPay || 0)}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        color="error"
                        gutterBottom
                      >
                        Deductions
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="body2">
                            Tax (
                            {selectedRecord.staffMember.payrollConfig
                              ?.taxPercentage || 0}
                            %):
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(selectedRecord.taxAmount || 0)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="body2">
                            EPF (
                            {selectedRecord.staffMember.payrollConfig
                              ?.epfPercentage || 0}
                            %):
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(selectedRecord.epfAmount || 0)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            pt: 1,
                            borderTop: "1px solid #ddd",
                          }}
                        >
                          <Typography variant="body1" fontWeight="bold">
                            Total Deductions:
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            color="error.main"
                          >
                            {formatCurrency(
                              selectedRecord.totalDeductions || 0
                            )}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ bgcolor: "success.50" }}>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="h6">Net Pay:</Typography>
                        <Typography
                          variant="h5"
                          color="success.main"
                          fontWeight="bold"
                        >
                          {formatCurrency(selectedRecord.netPay || 0)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {selectedRecord.notes && (
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                          Notes:
                        </Typography>
                        <Typography variant="body2">
                          {selectedRecord.notes}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    {selectedRecord.processedAt && (
                      <Typography variant="caption" color="text.secondary">
                        Processed:{" "}
                        {new Date(selectedRecord.processedAt).toLocaleString()}
                        {selectedRecord.processor &&
                          ` by ${selectedRecord.processor.name}`}
                      </Typography>
                    )}
                    {selectedRecord.paidAt && (
                      <Typography variant="caption" color="text.secondary">
                        Paid: {new Date(selectedRecord.paidAt).toLocaleString()}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Payment History Dialog */}
      <Dialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Payment History - {historyStaff?.name}
          <Typography variant="caption" display="block" color="text.secondary">
            View and download payment slips for any period
          </Typography>
        </DialogTitle>
        <DialogContent>
          {historyStaff && (
            <Box>
              {/* Filters */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth>
                        <InputLabel>Month</InputLabel>
                        <Select
                          value={historyFilterMonth}
                          label="Month"
                          onChange={(e) =>
                            setHistoryFilterMonth(e.target.value as number | "all")
                          }
                        >
                          <MenuItem value="all">All Months</MenuItem>
                          {MONTHS.map((month, idx) => (
                            <MenuItem key={idx} value={idx + 1}>
                              {month}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth>
                        <InputLabel>Year</InputLabel>
                        <Select
                          value={historyFilterYear}
                          label="Year"
                          onChange={(e) =>
                            setHistoryFilterYear(e.target.value as number | "all")
                          }
                        >
                          <MenuItem value="all">All Years</MenuItem>
                          {Array.from(
                            new Set(
                              historyStaff.payrollRecords.map((r) => r.year)
                            )
                          )
                            .sort((a, b) => b - a)
                            .map((year) => (
                              <MenuItem key={year} value={year}>
                                {year}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<PictureAsPdf />}
                        onClick={handleDownloadAllHistoryPDF}
                        disabled={
                          historyStaff.payrollRecords.filter((record) => {
                            const monthMatch =
                              historyFilterMonth === "all" ||
                              record.month === historyFilterMonth;
                            const yearMatch =
                              historyFilterYear === "all" ||
                              record.year === historyFilterYear;
                            const isPaid = record.status === "Paid";
                            return monthMatch && yearMatch && isPaid;
                          }).length === 0
                        }
                      >
                        Download Summary PDF
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Records Table */}
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Period</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Basic Salary</TableCell>
                      <TableCell align="right">Gross Pay</TableCell>
                      <TableCell align="right">Deductions</TableCell>
                      <TableCell align="right">Net Pay</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {historyStaff.payrollRecords
                      .filter((record) => {
                        const monthMatch =
                          historyFilterMonth === "all" ||
                          record.month === historyFilterMonth;
                        const yearMatch =
                          historyFilterYear === "all" ||
                          record.year === historyFilterYear;
                        return monthMatch && yearMatch;
                      })
                      .sort((a, b) => {
                        if (b.year !== a.year) return b.year - a.year;
                        return b.month - a.month;
                      })
                      .map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            {MONTHS[record.month - 1]} {record.year}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={record.status}
                              size="small"
                              color={
                                record.status === "Paid"
                                  ? "success"
                                  : record.status === "Processed"
                                  ? "warning"
                                  : "default"
                              }
                            />
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(record.basicSalary || 0)}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(record.grossPay || 0)}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(record.totalDeductions || 0)}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(record.netPay || 0)}
                          </TableCell>
                          <TableCell align="right">
                            {record.status === "Paid" ? (
                              <Tooltip title="Download Payslip">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDownloadHistoryPDF(record)}
                                >
                                  <PictureAsPdf fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Only paid records can be downloaded">
                                <span>
                                  <IconButton
                                    size="small"
                                    disabled
                                  >
                                    <PictureAsPdf fontSize="small" />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    {historyStaff.payrollRecords.filter((record) => {
                      const monthMatch =
                        historyFilterMonth === "all" ||
                        record.month === historyFilterMonth;
                      const yearMatch =
                        historyFilterYear === "all" ||
                        record.year === historyFilterYear;
                      return monthMatch && yearMatch;
                    }).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Typography variant="body2" color="text.secondary">
                            No records found for the selected period
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
};
