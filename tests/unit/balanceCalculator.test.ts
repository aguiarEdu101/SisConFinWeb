import { describe, it, expect } from 'vitest';
import { calculateMonthlyBalance } from '@/utils/balanceCalculator';
import { Transaction, Installment, CardStatement } from '@/types';

describe('RN-05: Motor de Cálculo do Saldo Projetado do Mês', () => {
  const transactions: Transaction[] = [
    { id: 't1', group_id: 'g1', user_id: 'u1', description: 'Salário', amount: 5000, type: 'INCOME', category: 'Salário', ref_date: '2026-07-01', status: 'PAID', created_at: '' },
    { id: 't2', group_id: 'g1', user_id: 'u1', description: 'Freelance', amount: 1500, type: 'INCOME', category: 'Extra', ref_date: '2026-07-15', status: 'PENDING', created_at: '' },
    { id: 't3', group_id: 'g1', user_id: 'u1', description: 'Mercado', amount: 800, type: 'EXPENSE', category: 'Alimentação', ref_date: '2026-07-05', status: 'PAID', created_at: '' },
  ];

  const installments: Installment[] = [
    { id: 'i1', commitment_id: 'c1', installment_number: 1, amount: 500, due_date: '2026-07-10', status: 'PENDING', is_amortized: false },
    { id: 'i2', commitment_id: 'c1', installment_number: 36, amount: 500, due_date: '2026-07-10', status: 'PAID', is_amortized: true },
  ];

  const cardStatements: CardStatement[] = [
    { id: 's1', card_id: 'card1', month_ref: 7, year_ref: 2026, total_amount: 1200, status: 'PENDING', created_at: '' }
  ];

  it('deve calcular o Saldo Realizado apenas com receitas e despesas pagas', () => {
    const summary = calculateMonthlyBalance(transactions, installments, cardStatements);

    expect(summary.realizedIncome).toBe(5000);
    expect(summary.realizedExpense).toBe(800);
    expect(summary.realizedBalance).toBe(4200);
  });

  it('deve calcular o Saldo Projetado combinando receitas previstas e subtraindo despesas + parcelas ativas + faturas', () => {
    const summary = calculateMonthlyBalance(transactions, installments, cardStatements);

    expect(summary.projectedBalance).toBe(4000);
  });

  it('RN-04/RN-05: Deve EXCLUIR do cálculo de despesas do mês parcelas com is_amortized = true', () => {
    const summary = calculateMonthlyBalance(transactions, installments, cardStatements);

    expect(summary.realizedExpense + summary.pendingExpense).toBe(2500);
  });
});
