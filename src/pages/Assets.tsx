import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockAssets } from '@/lib/mock-data';
import { ASSET_CATEGORIES, Asset, AssetCategory } from '@/lib/types';
import { formatPKR, formatDate } from '@/lib/formatters';
import { toast } from 'sonner';

export default function Assets() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<AssetCategory>('Kitchen Equipment');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().slice(0, 10));
  const [purchasePrice, setPurchasePrice] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !purchasePrice) { toast.error('Name and price are required'); return; }

    const newAsset: Asset = {
      id: Date.now().toString(),
      name,
      category,
      purchase_date: purchaseDate,
      purchase_price: parseFloat(purchasePrice),
      notes,
    };

    setAssets([newAsset, ...assets]);
    setShowForm(false);
    setName(''); setPurchasePrice(''); setNotes('');
    toast.success('Asset added');
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
              <th>Notes</th>
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
                <td className="text-muted-foreground text-xs max-w-[200px] truncate">{a.notes || '-'}</td>
                <td>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(a.id)}>
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
            {assets.length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No assets yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
