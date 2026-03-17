export function formatPKR(amount: number): string {
  if (amount === 0) return 'PKR 0';
  const isNegative = amount < 0;
  const abs = Math.abs(amount);
  const str = Math.round(abs).toString();
  
  let result = '';
  if (str.length <= 3) {
    result = str;
  } else {
    result = str.slice(-3);
    let remaining = str.slice(0, -3);
    while (remaining.length > 2) {
      result = remaining.slice(-2) + ',' + result;
      remaining = remaining.slice(0, -2);
    }
    if (remaining.length > 0) {
      result = remaining + ',' + result;
    }
  }
  
  return `PKR ${isNegative ? '-' : ''}${result}`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function getPaymentStatus(total: number, paid: number): 'Fully Paid' | 'Partially Paid' | 'Pending' {
  if (paid >= total) return 'Fully Paid';
  if (paid > 0) return 'Partially Paid';
  return 'Pending';
}
