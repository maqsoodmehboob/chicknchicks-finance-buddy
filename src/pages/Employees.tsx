import { useState } from 'react';
import { Plus, Trash2, CreditCard, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/Modal';
import { StatusBadge } from '@/components/StatusBadge';
import { mockSalaries } from '@/lib/mock-data';
import { DEPARTMENTS, Salary, Department } from '@/lib/types';
import { formatPKR, formatDate, getPaymentStatus } from '@/lib/formatters';
import { toast } from 'sonner';

export default function Employees() {
  const [salaries, setSalaries] = useState<Salary[]>(mockSalaries);
  const [showForm, setShowForm] = useState(false);
  const [paymentModal, setPaymentModal] = useState<Salary | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));

  const [employeeName, setEmployeeName] = useState('');
  const [department, setDepartment] = useState<Department>('Kitchen');
  const [totalSalary, setTotalSalary] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeName || !totalSalary) { toast.error('Name and salary are required'); return; }

    const newSalary: Salary = {
      id: Date.now().toString(),
      employee_name: employeeName,
      department,
      total_salary: parseFloat(totalSalary),
      paid_amount: 0,
      remaining_salary: parseFloat(totalSalary),
      notes,
    };

    setSalaries([newSalary, ...salaries]);
    setShowForm(false);
    setEmployeeName(''); setTotalSalary(''); setNotes('');
    toast.success('Employee added');
  };

  const handlePayment = () => {
    if (!paymentModal || !paymentAmount) return;
    const amount = parseFloat(paymentAmount);
    setSalaries(salaries.map(s => {
      if (s.id !== paymentModal.id) return s;
      const newPaid = s.paid_amount + amount;
      return { ...s, paid_amount: newPaid, remaining_salary: s.total_salary - newPaid, payment_date: paymentDate };
    }));
    setPaymentModal(null);
    setPaymentAmount('');
    toast.success('Salary payment recorded');
  };

  const handleReset = (id: string) => {
    if (!confirm('Reset salary payment for this employee? Paid amount will be set to 0.')) return;
    setSalaries(salaries.map(s => {
      if (s.id !== id) return s;
      return { ...s, paid_amount: 0, remaining_salary: s.total_salary, payment_date: undefined };
    }));
    toast.success('Salary reset for new month');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this employee record?')) return;
    setSalaries(salaries.filter(s => s.id !== id));
    toast.success('Deleted');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="page-title lg:hidden">Employees</h2>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Employee
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-section grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Employee Name</label>
            <Input value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} placeholder="Full name" required />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Department</label>
            <select value={department} onChange={(e) => setDepartment(e.target.value as Department)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring">
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Monthly Salary (PKR)</label>
            <Input type="number" value={totalSalary} onChange={(e) => setTotalSalary(e.target.value)} placeholder="0" required />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Notes</label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Role, etc." />
          </div>
          <div className="sm:col-span-2 flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="bg-card rounded-lg border overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Total Salary</th>
              <th>Paid</th>
              <th>Remaining</th>
              <th>Status</th>
              <th>Last Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map(s => (
              <tr key={s.id}>
                <td className="font-medium">{s.employee_name}</td>
                <td>{s.department}</td>
                <td>{formatPKR(s.total_salary)}</td>
                <td>{formatPKR(s.paid_amount)}</td>
                <td>{formatPKR(s.remaining_salary)}</td>
                <td><StatusBadge status={getPaymentStatus(s.total_salary, s.paid_amount)} /></td>
                <td>{formatDate(s.payment_date || '')}</td>
                <td>
                  <div className="flex gap-1">
                    {s.remaining_salary > 0 && (
                      <Button size="sm" variant="outline" onClick={() => setPaymentModal(s)} className="gap-1 text-xs">
                        <CreditCard className="w-3 h-3" /> Pay
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleReset(s.id)} className="gap-1 text-xs" title="Reset for new month">
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(s.id)}>
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {salaries.length === 0 && (
              <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">No employees yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={!!paymentModal} onClose={() => setPaymentModal(null)} title="Pay Salary">
        {paymentModal && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {paymentModal.employee_name} — Remaining: <span className="font-semibold text-foreground">{formatPKR(paymentModal.remaining_salary)}</span>
            </p>
            <div>
              <label className="text-sm font-medium mb-1 block">Amount (PKR)</label>
              <Input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="Enter amount" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Payment Date</label>
              <Input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handlePayment}>Confirm</Button>
              <Button variant="outline" onClick={() => setPaymentModal(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
