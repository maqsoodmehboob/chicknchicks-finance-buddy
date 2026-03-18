import { useState } from 'react';
import { DollarSign, TrendingUp, Users, Landmark, CalendarIcon } from 'lucide-react';
import { MetricCard } from '@/components/MetricCard';
import { mockDashboard } from '@/lib/mock-data';
import { formatPKR } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const CHART_COLORS = ['#14B8A6', '#F59E0B', '#EF4444', '#6366F1', '#8B5CF6', '#EC4899'];

export default function Dashboard() {
  const data = mockDashboard;
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleFilter = () => {
    // In real app this would filter API data by date range
  };

  const handleClear = () => {
    setFromDate('');
    setToDate('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="page-title lg:hidden">Dashboard</h2>

      {/* Date Range Filter */}
      <div className="bg-card rounded-lg border p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">From Date</label>
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-44" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">To Date</label>
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-44" />
          </div>
          <Button onClick={handleFilter} className="gap-2">
            <CalendarIcon className="w-4 h-4" /> Filter
          </Button>
          {(fromDate || toDate) && (
            <Button variant="outline" onClick={handleClear}>Clear</Button>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Today's Expenses"
          value={formatPKR(data.today_expenses)}
          icon={<DollarSign className="w-5 h-5 text-primary" />}
          color="bg-primary/10"
        />
        <MetricCard
          title="Monthly Expenses"
          value={formatPKR(data.monthly_expenses)}
          icon={<TrendingUp className="w-5 h-5 text-accent" />}
          color="bg-accent/10"
        />
        <MetricCard
          title="Total Salary Due"
          value={formatPKR(data.total_salary_due)}
          icon={<Users className="w-5 h-5 text-destructive" />}
          color="bg-destructive/10"
        />
        <MetricCard
          title="Outstanding Loans"
          value={formatPKR(data.outstanding_loans)}
          icon={<Landmark className="w-5 h-5 text-muted-foreground" />}
          color="bg-muted"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border p-6">
          <h3 className="font-heading text-lg font-semibold mb-4">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              {/* @ts-ignore */}
              <Pie
                data={data.expense_by_category}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
              >
                {data.expense_by_category.map((_, idx) => (
                  <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                ))}
              </Pie>
              {/* @ts-ignore */}
              <Tooltip formatter={(value: number) => formatPKR(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <h3 className="font-heading text-lg font-semibold mb-4">Monthly Expense Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.monthly_trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: number) => formatPKR(value)} />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#14B8A6"
                strokeWidth={2}
                dot={{ fill: '#14B8A6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
