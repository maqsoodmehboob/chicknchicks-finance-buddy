import { useState } from 'react';
import { Plus, Trash2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/Modal';
import { StatusBadge } from '@/components/StatusBadge';
import { mockLoans } from '@/lib/mock-data';
import { Loan, LoanType } from '@/lib/types';
import { formatPKR, formatDate } from '@/lib/formatters';
import { toast } from 'sonner';

export default function Loans() {
  const [loans, setLoans] = useState<Loan[]>(mockLoans);
  const [showForm, setShowForm] = useState(false);
  const [paymentModal, setPaymentModal] = useState<Loan | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [activeTab, setActiveTab] = useState<LoanType>('taken');

  const [loanType, setLoanType] = useState<LoanType>('taken');
  const [source, setSource] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [interest, setInterest] = useState('');
  const [installmentDate, setInstallmentDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !totalAmount) { toast.error('Source and amount are required'); return; }

    const total = parseFloat(totalAmount);
    const newLoan: Loan = {
      id: Date.now().toString(),
      type: loanType,
      source,
      total_amount: total,
      paid_amount: 0,
      remaining_amount: total,
      installment_date: installmentDate,
      interest: parseFloat(interest || '0'),
      status: 'Active',
      notes,
    };

    setLoans([newLoan, ...loans]);
    setShowForm(false);
    setSource(''); setTotalAmount(''); setInterest(''); setInstallmentDate(''); setNotes('');
    toast.success('Loan added');
  };

  const handlePayment = () => {
    if (!paymentModal || !paymentAmount) return;
    const amount = parseFloat(paymentAmount);
    setLoans(loans.map(l => {
      if (l.id !== paymentModal.id) return l;
      const newPaid = l.paid_amount + amount;
      return {
        ...l,
        paid_amount: newPaid,
        remaining_amount: l.total_amount - newPaid,
        status: newPaid >= l.total_amount ? 'Cleared' : 'Active',
      };
    }));
    setPaymentModal(null);
    setPaymentAmount('');
    toast.success('Payment recorded');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this loan?')) return;
    setLoans(loans.filter(l => l.id !== id));
    toast.success('Deleted');
  };

  const filteredLoans = loans.filter(l => l.type === activeTab);

  const renderTable = (items: Loan[], typeLabel: string) => (
    <div className="bg-card rounded-lg border overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>{activeTab === 'taken' ? 'Lender' : 'Borrower'}</th>
            <th>Total Amount</th>
            <th>Paid</th>
            <th>Remaining</th>
            <th>Interest</th>
            <th>Next Installment</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(l => (
            <tr key={l.id}>
              <td className="font-medium">{l.source}</td>
              <td>{formatPKR(l.total_amount)}</td>
              <td>{formatPKR(l.paid_amount)}</td>
              <td>{formatPKR(l.remaining_amount)}</td>
              <td>{l.interest}%</td>
              <td>{formatDate(l.installment_date)}</td>
              <td><StatusBadge status={l.status} /></td>
              <td>
                <div className="flex gap-1">
                  {l.status === 'Active' && (
                    <Button size="sm" variant="outline" onClick={() => setPaymentModal(l)} className="gap-1 text-xs">
                      <CreditCard className="w-3 h-3" /> Pay
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(l.id)}>
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">No {typeLabel} loans yet</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="page-title lg:hidden">Loans</h2>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Loan
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-section grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Loan Type</label>
            <select value={loanType} onChange={(e) => setLoanType(e.target.value as LoanType)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring">
              <option value="taken">Loan Taken (Hum ne liya)</option>
              <option value="given">Loan Given (Hum ne diya)</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{loanType === 'taken' ? 'Lender / Source' : 'Borrower Name'}</label>
            <Input value={source} onChange={(e) => setSource(e.target.value)} placeholder={loanType === 'taken' ? 'Bank or lender name' : 'Person or business name'} required />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Total Amount (PKR)</label>
            <Input type="number" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} placeholder="0" required />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Interest Rate (%)</label>
            <Input type="number" step="0.1" value={interest} onChange={(e) => setInterest(e.target.value)} placeholder="0" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Installment Date</label>
            <Input type="date" value={installmentDate} onChange={(e) => setInstallmentDate(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Notes</label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Purpose, terms, etc." />
          </div>
          <div className="sm:col-span-2 flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        <button
          onClick={() => setActiveTab('taken')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'taken' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Loans Taken ({loans.filter(l => l.type === 'taken').length})
        </button>
        <button
          onClick={() => setActiveTab('given')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'given' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Loans Given ({loans.filter(l => l.type === 'given').length})
        </button>
      </div>

      {renderTable(filteredLoans, activeTab)}

      <Modal open={!!paymentModal} onClose={() => setPaymentModal(null)} title="Record Loan Payment">
        {paymentModal && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {paymentModal.source} — Remaining: <span className="font-semibold text-foreground">{formatPKR(paymentModal.remaining_amount)}</span>
            </p>
            <div>
              <label className="text-sm font-medium mb-1 block">Payment Amount (PKR)</label>
              <Input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="Enter amount" />
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
