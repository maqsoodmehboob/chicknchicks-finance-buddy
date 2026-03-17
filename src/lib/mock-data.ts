import { Expense, Salary, Asset, Loan, DashboardData } from './types';

export const mockExpenses: Expense[] = [
  { id: '1', category: 'Vegetables', date: '2026-03-17', total_amount: 25000, paid_amount: 25000, remaining_amount: 0, status: 'Fully Paid', notes: 'Weekly vegetables purchase' },
  { id: '2', category: 'Meat', date: '2026-03-17', total_amount: 85000, paid_amount: 50000, remaining_amount: 35000, status: 'Partially Paid', notes: 'Chicken and beef' },
  { id: '3', category: 'Utilities', date: '2026-03-15', total_amount: 45000, paid_amount: 0, remaining_amount: 45000, status: 'Pending', notes: 'Electricity bill March' },
  { id: '4', category: 'Rent', date: '2026-03-01', total_amount: 150000, paid_amount: 150000, remaining_amount: 0, status: 'Fully Paid', notes: 'March rent' },
  { id: '5', category: 'Transport', date: '2026-03-16', total_amount: 12000, paid_amount: 12000, remaining_amount: 0, status: 'Fully Paid', notes: 'Delivery charges' },
  { id: '6', category: 'Miscellaneous', date: '2026-03-14', total_amount: 8000, paid_amount: 3000, remaining_amount: 5000, status: 'Partially Paid', notes: 'Cleaning supplies' },
];

export const mockSalaries: Salary[] = [
  { id: '1', employee_name: 'Ahmed Khan', department: 'Kitchen', total_salary: 45000, paid_amount: 45000, remaining_salary: 0, payment_date: '2026-03-01', notes: 'Head Chef' },
  { id: '2', employee_name: 'Sara Ali', department: 'Management', total_salary: 60000, paid_amount: 30000, remaining_salary: 30000, payment_date: '2026-03-01', notes: 'Manager' },
  { id: '3', employee_name: 'Usman Raza', department: 'Waitstaff', total_salary: 30000, paid_amount: 0, remaining_salary: 30000, notes: 'Waiter' },
  { id: '4', employee_name: 'Fatima Noor', department: 'Kitchen', total_salary: 35000, paid_amount: 35000, remaining_salary: 0, payment_date: '2026-03-01', notes: 'Sous Chef' },
  { id: '5', employee_name: 'Hassan Iqbal', department: 'Cleaning', total_salary: 25000, paid_amount: 0, remaining_salary: 25000, notes: 'Cleaning staff' },
];

export const mockAssets: Asset[] = [
  { id: '1', name: 'Commercial Oven', category: 'Kitchen Equipment', purchase_date: '2025-06-15', purchase_price: 350000, paid_amount: 350000, remaining_amount: 0, status: 'Fully Paid', notes: 'Industrial grade, 2-year warranty' },
  { id: '2', name: 'Dining Tables (Set of 10)', category: 'Furniture', purchase_date: '2025-01-20', purchase_price: 200000, paid_amount: 100000, remaining_amount: 100000, status: 'Partially Paid', notes: 'Wooden tables for main hall' },
  { id: '3', name: 'Delivery Bike', category: 'Vehicles', purchase_date: '2025-09-01', purchase_price: 180000, paid_amount: 0, remaining_amount: 180000, status: 'Pending', notes: 'Honda 125 for deliveries' },
  { id: '4', name: 'Cutlery Set (200 pcs)', category: 'Utensils', purchase_date: '2025-03-10', purchase_price: 45000, paid_amount: 45000, remaining_amount: 0, status: 'Fully Paid', notes: 'Stainless steel set' },
];

export const mockLoans: Loan[] = [
  { id: '1', type: 'taken', source: 'HBL Bank', total_amount: 2000000, paid_amount: 800000, remaining_amount: 1200000, installment_date: '2026-04-01', interest: 12.5, status: 'Active', notes: 'Restaurant renovation loan' },
  { id: '2', type: 'taken', source: 'Uncle Rashid', total_amount: 500000, paid_amount: 500000, remaining_amount: 0, installment_date: '2026-01-15', interest: 0, status: 'Cleared', notes: 'Family loan for initial setup' },
  { id: '3', type: 'taken', source: 'MCB Bank', total_amount: 800000, paid_amount: 200000, remaining_amount: 600000, installment_date: '2026-03-25', interest: 14, status: 'Active', notes: 'Kitchen equipment financing' },
  { id: '4', type: 'given', source: 'Ali (Staff)', total_amount: 50000, paid_amount: 20000, remaining_amount: 30000, installment_date: '2026-04-10', interest: 0, status: 'Active', notes: 'Advance salary loan to staff' },
  { id: '5', type: 'given', source: 'Supplier - Fresh Farms', total_amount: 100000, paid_amount: 100000, remaining_amount: 0, installment_date: '2026-02-01', interest: 0, status: 'Cleared', notes: 'Advance payment to supplier' },
];

export const mockDashboard: DashboardData = {
  today_expenses: 110000,
  monthly_expenses: 325000,
  total_salary_due: 85000,
  outstanding_loans: 1800000,
  expense_by_category: [
    { category: 'Vegetables', amount: 25000 },
    { category: 'Meat', amount: 85000 },
    { category: 'Utilities', amount: 45000 },
    { category: 'Rent', amount: 150000 },
    { category: 'Transport', amount: 12000 },
    { category: 'Miscellaneous', amount: 8000 },
  ],
  monthly_trend: [
    { month: 'Oct', amount: 280000 },
    { month: 'Nov', amount: 310000 },
    { month: 'Dec', amount: 420000 },
    { month: 'Jan', amount: 295000 },
    { month: 'Feb', amount: 340000 },
    { month: 'Mar', amount: 325000 },
  ],
};
