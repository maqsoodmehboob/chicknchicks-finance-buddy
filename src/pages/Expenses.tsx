import { useState } from 'react';
import { Plus, Eye, Trash2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/Modal';
import { StatusBadge } from '@/components/StatusBadge';
import { mockExpenses } from '@/lib/mock-data';
import { EXPENSE_CATEGORIES, Expense, ExpenseCategory } from '@/lib/types';
import { formatPKR, formatDate, getPaymentStatus } from '@/lib/formatters';
import { toast } from 'sonner';

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [showForm, setShowForm] = useState(false);
  const [paymentModal, setPaymentModal] = useState<Expense | null>(null);
  const [imageModal, setImageModal] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  // Form state
  const [category, setCategory] = useState<ExpenseCategory>('Vegetables');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [totalAmount, setTotalAmount] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!totalAmount) { toast.error('Total amount is required'); return; }

    const total = parseFloat(totalAmount);
    const paid = parseFloat(paidAmount || '0');
    const newExpense: Expense = {
      id: Date.now().toString(),
      category,
      date,
      total_amount: total,
      paid_amount: paid,
      remaining_amount: total - paid,
      status: getPaymentStatus(total, paid),
      notes,
    };

    setExpenses([newExpense, ...expenses]);
    setShowForm(false);
    setTotalAmount(''); setPaidAmount(''); setNotes('');
    toast.success('Expense added successfully');
  };

  const handlePayment = () => {
    if (!paymentModal || !paymentAmount) return;
    const amount = parseFloat(paymentAmount);
    setExpenses(expenses.map(exp => {
      if (exp.id !== paymentModal.id) return exp;
      const newPaid = exp.paid_amount + amount;
      return {
        ...exp,
        paid_amount: newPaid,
        remaining_amount: exp.total_amount - newPaid,
        status: getPaymentStatus(exp.total_amount, newPaid),
      };
    }));
    setPaymentModal(null);
    setPaymentAmount('');
    toast.success('Payment recorded');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    setExpenses(expenses.filter(e => e.id !== id));
    toast.success('Expense deleted');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="page-title lg:hidden">Expenses</h2>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Expense
        </Button>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="form-section grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
            >
              {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Date</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Total Amount (PKR)</label>
            <Input type="number" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} placeholder="0" required />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Paid Amount (PKR)</label>
            <Input type="number" value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} placeholder="0" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-foreground mb-1 block">Notes</label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes..." />
          </div>
          <div className="sm:col-span-2 flex gap-2">
            <Button type="submit">Save Expense</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="bg-card rounded-lg border overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Date</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Remaining</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(exp => (
              <tr key={exp.id}>
                <td className="font-medium">{exp.category}</td>
                <td>{formatDate(exp.date)}</td>
                <td>{formatPKR(exp.total_amount)}</td>
                <td>{formatPKR(exp.paid_amount)}</td>
                <td>{formatPKR(exp.remaining_amount)}</td>
                <td><StatusBadge status={exp.status} /></td>
                <td className="text-muted-foreground text-xs max-w-[150px] truncate">{exp.notes || '-'}</td>
                <td>
                  <div className="flex gap-1">
                    {exp.status !== 'Fully Paid' && (
                      <Button size="sm" variant="outline" onClick={() => setPaymentModal(exp)} className="gap-1 text-xs">
                        <CreditCard className="w-3 h-3" /> Pay
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(exp.id)}>
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">No expenses recorded yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Modal */}
      <Modal open={!!paymentModal} onClose={() => setPaymentModal(null)} title="Record Payment">
        {paymentModal && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Remaining: <span className="font-semibold text-foreground">{formatPKR(paymentModal.remaining_amount)}</span>
            </p>
            <div>
              <label className="text-sm font-medium mb-1 block">Payment Amount (PKR)</label>
              <Input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter amount"
                max={paymentModal.remaining_amount}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handlePayment}>Confirm Payment</Button>
              <Button variant="outline" onClick={() => setPaymentModal(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
