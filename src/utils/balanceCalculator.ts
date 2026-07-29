import { Transaction, Installment, CardStatement, BalanceSummary } from '@/types';

/**
 * RN-05 (Cálculo de Saldo Projetado)
 * Fórmula:
 * Saldo Projetado = (Receitas Previstas/Pagas) - (Despesas Diárias + Parcelas do Mês Não-Amortizadas + Faturas do Mês)
 */
export function calculateMonthlyBalance(
  transactions: Transaction[],
  installments: Installment[],
  cardStatements: CardStatement[]
): BalanceSummary {
  let realizedIncome = 0;
  let realizedExpense = 0;
  let pendingIncome = 0;
  let pendingExpense = 0;

  transactions.forEach(t => {
    const amt = Number(t.amount);
    if (t.type === 'INCOME') {
      if (t.status === 'PAID') {
        realizedIncome += amt;
      } else {
        pendingIncome += amt;
      }
    } else {
      if (t.status === 'PAID') {
        realizedExpense += amt;
      } else {
        pendingExpense += amt;
      }
    }
  });

  installments.forEach(inst => {
    if (inst.is_amortized) return;

    const amt = Number(inst.amount);
    if (inst.status === 'PAID') {
      realizedExpense += amt;
    } else {
      pendingExpense += amt;
    }
  });

  cardStatements.forEach(stmt => {
    const amt = Number(stmt.total_amount);
    if (stmt.status === 'PAID') {
      realizedExpense += amt;
    } else {
      pendingExpense += amt;
    }
  });

  const totalIncome = realizedIncome + pendingIncome;
  const totalExpense = realizedExpense + pendingExpense;

  const realizedBalance = realizedIncome - realizedExpense;
  const projectedBalance = totalIncome - totalExpense;

  return {
    realizedIncome,
    realizedExpense,
    realizedBalance,
    pendingIncome,
    pendingExpense,
    projectedBalance
  };
}
