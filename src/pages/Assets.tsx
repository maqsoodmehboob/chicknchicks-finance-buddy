import { useState, useRef } from 'react';
import { Plus, Trash2, CreditCard, Eye, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/Modal';
import { StatusBadge } from '@/components/StatusBadge';
import { mockAssets } from '@/lib/mock-data';
import { ASSET_CATEGORIES, Asset, AssetCategory } from '@/lib/types';
import { formatPKR, formatDate, getPaymentStatus } from '@/lib/formatters';
import { toast } from 'sonner';

export default function Assets() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [showForm, setShowForm] = useState(false);
  const [paymentModal, setPaymentModal] = useState<Asset | null>(null);
  const [imageModal, setImageModal] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<AssetCategory>('Kitchen Equipment');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().slice(0, 10));
  const [purchasePrice, setPurchasePrice] = useState('');
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
    if (!name || !purchasePrice) { toast.error('Name and price are required'); return; }
    if (!billImage) { toast.error('Bill image is required'); return; }

    const total = parseFloat(purchasePrice);
    const paid = parseFloat(paidAmount || '0');
    const newAsset: Asset = {
      id: Date.now().toString(),
      name,
      category,
      purchase_date: purchaseDate,
      purchase_price: total,
      paid_amount: paid,
      remaining_amount: total - paid,
      status: getPaymentStatus(total, paid),
      bill_image: billImage,
      notes,
    };

    setAssets([newAsset, ...assets]);
    setShowForm(false);
    setName(''); setPurchasePrice(''); setPaidAmount(''); setNotes(''); setBillImage(null); setBillFileName('');
    toast.success('Asset added');
  };

  const handlePayment = () => {
    if (!paymentModal || !paymentAmount) return;
    const amount = parseFloat(paymentAmount);
    setAssets(assets.map(a => {
      if (a.id !== paymentModal.id) return a;
      const newPaid = a.paid_amount + amount;
      return {
        ...a,
        paid_amount: newPaid,
        remaining_amount: a.purchase_price - newPaid,
        status: getPaymentStatus(a.purchase_price, newPaid),
      };
    }));
    setPaymentModal(null);
    setPaymentAmount('');
    toast.success('Payment recorded');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this asset?')) return;
    setAssets(assets.filter(a => a.id !== id));
    toast.success('Deleted');
  };

  const totalValue = assets.reduce((sum, a) => sum + a.purchase_price, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="page-title lg:hidden">Assets</h2>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground hidden sm:block">
            Total Value: <span className="font-semibold text-foreground">{formatPKR(totalValue)}</span>
          </p>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Asset
          </Button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-section grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Asset Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Commercial Oven" required />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as AssetCategory)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring">
              {ASSET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Purchase Date</label>
            <Input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Purchase Price (PKR)</label>
            <Input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} placeholder="0" required />
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
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-foreground mb-1 block">Notes</label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Warranty, model number, etc." />
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
              <th>Category</th>
              <th>Purchase Date</th>
              <th>Price</th>
              <th>Paid</th>
              <th>Remaining</th>
              <th>Status</th>
              <th>Bill</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map(a => (
              <tr key={a.id}>
                <td className="font-medium">{a.name}</td>
                <td>{a.category}</td>
                <td>{formatDate(a.purchase_date)}</td>
                <td>{formatPKR(a.purchase_price)}</td>
                <td>{formatPKR(a.paid_amount)}</td>
                <td>{formatPKR(a.remaining_amount)}</td>
                <td><StatusBadge status={a.status} /></td>
                <td>
                  {a.bill_image ? (
                    <Button size="sm" variant="outline" onClick={() => setImageModal(a.bill_image!)} className="gap-1 text-xs">
                      <Eye className="w-3 h-3" /> View
                    </Button>
                  ) : <span className="text-muted-foreground text-xs">—</span>}
                </td>
                <td>
                  <div className="flex gap-1">
                    {a.status !== 'Fully Paid' && (
                      <Button size="sm" variant="outline" onClick={() => setPaymentModal(a)} className="gap-1 text-xs">
                        <CreditCard className="w-3 h-3" /> Pay
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(a.id)}>
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {assets.length === 0 && (
              <tr><td colSpan={9} className="text-center py-8 text-muted-foreground">No assets yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Modal */}
      <Modal open={!!paymentModal} onClose={() => setPaymentModal(null)} title="Record Asset Payment">
        {paymentModal && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {paymentModal.name} — Remaining: <span className="font-semibold text-foreground">{formatPKR(paymentModal.remaining_amount)}</span>
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

      {/* Image Modal */}
      <Modal open={!!imageModal} onClose={() => setImageModal(null)} title="Bill / Receipt">
        {imageModal && (
          <img src={imageModal} alt="Bill" className="w-full rounded" />
        )}
      </Modal>
    </div>
  );
}
