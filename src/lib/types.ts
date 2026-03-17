export interface Expense {
  id: string;
  category: ExpenseCategory;
  date: string;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  status: PaymentStatus;
  bill_image?: string;
  notes?: string;
  created_at?: string;
}

export interface Salary {
  id: string;
  employee_name: string;
  department: Department;
  total_salary: number;
  paid_amount: number;
  remaining_salary: number;
  payment_date?: string;
  notes?: string;
  created_at?: string;
}

export interface SalaryPayment {
  id: string;
  salary_id: string;
  amount: number;
  payment_date: string;
  notes?: string;
  created_at?: string;
}

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  purchase_date: string;
  purchase_price: number;
  paid_amount: number;
  remaining_amount: number;
  status: PaymentStatus;
  bill_image?: string;
  notes?: string;
  created_at?: string;
}

export interface Loan {
  id: string;
  type: LoanType;
  source: string;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  installment_date: string;
  interest: number;
  status: LoanStatus;
  notes?: string;
  created_at?: string;
}

export interface DashboardData {
  today_expenses: number;
  monthly_expenses: number;
  total_salary_due: number;
  outstanding_loans: number;
  expense_by_category: { category: string; amount: number }[];
  monthly_trend: { month: string; amount: number }[];
}

export type ExpenseCategory = 'Vegetables' | 'Meat' | 'Utilities' | 'Rent' | 'Transport' | 'Miscellaneous';
export type Department = 'Kitchen' | 'Waitstaff' | 'Management' | 'Cleaning' | 'Other';
export type AssetCategory = 'Kitchen Equipment' | 'Furniture' | 'Vehicles' | 'Utensils';
export type PaymentStatus = 'Fully Paid' | 'Partially Paid' | 'Pending';
export type LoanStatus = 'Active' | 'Cleared';
export type LoanType = 'taken' | 'given';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = ['Vegetables', 'Meat', 'Utilities', 'Rent', 'Transport', 'Miscellaneous'];
export const DEPARTMENTS: Department[] = ['Kitchen', 'Waitstaff', 'Management', 'Cleaning', 'Other'];
export const ASSET_CATEGORIES: AssetCategory[] = ['Kitchen Equipment', 'Furniture', 'Vehicles', 'Utensils'];
