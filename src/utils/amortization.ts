import { Installment } from '@/types';

/**
 * RN-04 (Abate de Amortização Antecipada de Trás para Frente)
 * Localiza as últimas parcelas não pagas (maior installment_number) e realiza o abate da amortização.
 * Altera status para 'PAID' e 'is_amortized = true', removendo-as do fluxo futuro de despesas.
 */
export function amortizeReverseInstallment(installments: Installment[], extraAmount: number): {
  updatedInstallments: Installment[];
  amortizedCount: number;
  remainingAmount: number;
} {
  const sorted = [...installments].sort((a, b) => b.installment_number - a.installment_number);
  
  let currentExtra = extraAmount;
  let amortizedCount = 0;
  const updatedMap = new Map<string, Installment>();

  for (const inst of sorted) {
    if (currentExtra <= 0) break;

    if (inst.status !== 'PAID' && !inst.is_amortized) {
      if (currentExtra >= inst.amount) {
        currentExtra -= inst.amount;
        amortizedCount++;
        updatedMap.set(inst.id, {
          ...inst,
          status: 'PAID',
          is_amortized: true,
          paid_at: new Date().toISOString()
        });
      } else {
        currentExtra = 0;
        amortizedCount++;
        updatedMap.set(inst.id, {
          ...inst,
          amount: Math.max(0, inst.amount - currentExtra),
          status: 'PAID',
          is_amortized: true,
          paid_at: new Date().toISOString()
        });
      }
    }
  }

  const updatedInstallments = installments.map(inst => updatedMap.get(inst.id) || inst);

  return {
    updatedInstallments,
    amortizedCount,
    remainingAmount: currentExtra
  };
}
