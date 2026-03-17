import { PaymentStatus, LoanStatus } from '@/lib/types';

export function StatusBadge({ status }: { status: PaymentStatus | LoanStatus }) {
  const cls =
    status === 'Fully Paid' || status === 'Cleared'
      ? 'badge-paid'
      : status === 'Partially Paid' || status === 'Active'
        ? status === 'Active'
          ? 'badge-active'
          : 'badge-partial'
        : 'badge-pending';

  return <span className={cls}>{status}</span>;
}
