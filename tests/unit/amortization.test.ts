import { describe, it, expect } from 'vitest';
import { amortizeReverseInstallment } from '@/utils/amortization';
import { Installment } from '@/types';

describe('RN-04: Motor de Amortização Antecipada de Trás para Frente', () => {
  const sampleInstallments: Installment[] = [
    { id: 'inst-1', commitment_id: 'c1', installment_number: 1, amount: 1000, due_date: '2024-01-01', status: 'PAID', is_amortized: false },
    { id: 'inst-2', commitment_id: 'c1', installment_number: 2, amount: 1000, due_date: '2024-02-01', status: 'PENDING', is_amortized: false },
    { id: 'inst-3', commitment_id: 'c1', installment_number: 3, amount: 1000, due_date: '2024-03-01', status: 'PENDING', is_amortized: false },
    { id: 'inst-4', commitment_id: 'c1', installment_number: 4, amount: 1000, due_date: '2024-04-01', status: 'PENDING', is_amortized: false },
  ];

  it('deve amortizar a última parcela (maior installment_number) de trás para frente', () => {
    const result = amortizeReverseInstallment(sampleInstallments, 1000);

    const inst4 = result.updatedInstallments.find(i => i.installment_number === 4);
    expect(inst4).toBeDefined();
    expect(inst4?.is_amortized).toBe(true);
    expect(inst4?.status).toBe('PAID');
    expect(result.amortizedCount).toBe(1);

    const inst3 = result.updatedInstallments.find(i => i.installment_number === 3);
    expect(inst3?.is_amortized).toBe(false);
    expect(inst3?.status).toBe('PENDING');
  });

  it('deve acumular a amortização de múltiplas parcelas caso o aporte extra seja suficiente', () => {
    const result = amortizeReverseInstallment(sampleInstallments, 2000);

    const inst4 = result.updatedInstallments.find(i => i.installment_number === 4);
    const inst3 = result.updatedInstallments.find(i => i.installment_number === 3);

    expect(inst4?.is_amortized).toBe(true);
    expect(inst3?.is_amortized).toBe(true);
    expect(result.amortizedCount).toBe(2);
  });

  it('deve ignorar parcelas que já estejam marcadas como salvas ou amortizadas', () => {
    const withAmortized: Installment[] = [
      { id: 'inst-1', commitment_id: 'c1', installment_number: 1, amount: 1000, due_date: '2024-01-01', status: 'PAID', is_amortized: false },
      { id: 'inst-2', commitment_id: 'c1', installment_number: 2, amount: 1000, due_date: '2024-02-01', status: 'PENDING', is_amortized: false },
      { id: 'inst-3', commitment_id: 'c1', installment_number: 3, amount: 1000, due_date: '2024-03-01', status: 'PAID', is_amortized: true },
    ];

    const result = amortizeReverseInstallment(withAmortized, 1000);

    const inst2 = result.updatedInstallments.find(i => i.installment_number === 2);
    expect(inst2?.is_amortized).toBe(true);
    expect(inst2?.status).toBe('PAID');
  });
});
