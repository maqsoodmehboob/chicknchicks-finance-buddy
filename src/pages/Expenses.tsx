import { useState, useRef } from 'react';
import { Plus, Eye, Trash2, CreditCard, ImageIcon } from 'lucide-react';
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
  const [showAll, setShowAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [category, setCategory] = useState<ExpenseCategory>('Vegetables');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [totalAmount, setTotalAmount] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [billImage, setBillImage] = useState<string | null>(null);
  const [billFileName, setBillFileName] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBillFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setBillImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!totalAmount) { toast.error('Total amount is required'); return; }
    if (!billImage) { toast.error('Bill image is required'); return; }

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
      bill_image: billImage,
      notes,
    };

    setExpenses([newExpense, ...expenses]);
    setShowForm(false);
    setTotalAmount(''); setPaidAmount(''); setNotes(''); setBillImage(null); setBillFileName('');
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

  // Filter: by default only show pending/partial, toggle to show all
  const displayedExpenses = showAll
    ? expenses
    : expenses.filter(e => e.status !== 'Fully Paid');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="page-title lg:hidden">Expenses</h2>
        <div className="flex items-center gap-2">
          <Button variant={showAll ? 'default' : 'outline'} size="sm" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Show Pending Only' : 'Show All'}
          </Button>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Expense
          </Button>
        </div>
      </div>

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
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Bill Image <span className="text-destructive">*</span></label>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-1">
                <ImageIcon className="w-4 h-4" /> Choose File
              </Button>
              <span className="text-xs text-muted-foreground truncate max-w-[150px]">{billFileName || 'No file chosen'}</span>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            {billImage && (
              <img src={billImage} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded border" />
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Notes</label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes..." />
          </div>
          <div className="sm:col-span-2 flex gap-2">
            <Button type="submit">Save Expense</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

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
              <th>Bill</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedExpenses.map(exp => (
              <tr key={exp.id}>
                <td className="font-medium">{exp.category}</td>
                <td>{formatDate(exp.date)}</td>
                <td>{formatPKR(exp.total_amount)}</td>
                <td>{formatPKR(exp.paid_amount)}</td>
                <td>{formatPKR(exp.remaining_amount)}</td>
                <td><StatusBadge status={exp.status} /></td>
                <td>
                  {exp.bill_image ? (
                    <Button size="sm" variant="outline" onClick={() => setImageModal(exp.bill_image!)} className="gap-1 text-xs">
                      <Eye className="w-3 h-3" /> View
                    </Button>
                  ) : <span className="text-muted-foreground text-xs">—</span>}
                </td>
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
            {displayedExpenses.length === 0 && (
              <tr><td colSpan={9} className="text-center py-8 text-muted-foreground">
                {showAll ? 'No expenses recorded yet' : 'No pending expenses — all paid! 🎉'}
              </td></tr>
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
              <Input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="Enter amount" max={paymentModal.remaining_amount} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handlePayment}>Confirm Payment</Button>
              <Button variant="outline" onClick={() => setPaymentModal(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Image Modal */}
      <Modal open={!!imageModal} onClose={() => setImageModal(null)} title="Bill Image">
        {imageModal && (
          <img src={imageModal} alt="Bill" className="w-full rounded" />
        )}
      </Modal>
    </div>
  );
}
