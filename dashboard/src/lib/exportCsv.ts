import type { Payment } from './mockData.js';

const CSV_HEADERS = ['id', 'agent', 'recipient', 'amount', 'asset', 'endpoint', 'ledger', 'timestamp', 'status'] as const;

function escapeField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

export function paymentsToCsv(payments: Payment[]): string {
  const header = CSV_HEADERS.join(',');
  const rows = payments.map((p) =>
    [
      p.id,
      p.agentName,
      p.recipient,
      p.amount,
      p.asset,
      p.endpoint,
      String(p.ledger),
      p.timestamp,
      p.status,
    ]
      .map(escapeField)
      .join(','),
  );
  return [header, ...rows].join('\n');
}

export function downloadCsv(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
