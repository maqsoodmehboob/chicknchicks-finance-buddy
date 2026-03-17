interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color?: string;
}

export function MetricCard({ title, value, icon, color }: MetricCardProps) {
  return (
    <div className="metric-card flex items-start gap-4">
      <div className={`p-3 rounded-lg ${color || 'bg-primary/10'}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-xl font-bold font-body text-foreground mt-1">{value}</p>
      </div>
    </div>
  );
}
