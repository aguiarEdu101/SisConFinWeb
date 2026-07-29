'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  TrendingUp, 
  Wallet, 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Zap,
  CheckCircle2,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { 
    balanceSummary, 
    transactions, 
    commitments, 
    installments,
    toggleTransactionStatus, 
    addTransaction 
  } = useApp();

  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [category, setCategory] = useState('Alimentação');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;
    addTransaction({
      description,
      amount: parseFloat(amount),
      type,
      category,
      ref_date: new Date().toISOString().slice(0, 10),
      status: 'PAID'
    });
    setDescription('');
    setAmount('');
    setShowQuickAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary">
            Resumo Financeiro do Grupo
          </h2>
          <p className="text-sm text-text-secondary">
            Visão consolidada do fluxo de caixa e compromissos do mês corrente.
          </p>
        </div>
        <button
          onClick={() => setShowQuickAdd(!showQuickAdd)}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-md transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Lançamento Rápido (&lt; 3s)</span>
        </button>
      </div>

      {showQuickAdd && (
        <form onSubmit={handleQuickSubmit} className="p-4 bg-white rounded-xl border-2 border-emerald-500 shadow-md space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
              <Zap className="w-4 h-4 fill-emerald-500" /> Registro Rápido sem Preguiça (US02.1)
            </span>
            <button type="button" onClick={() => setShowQuickAdd(false)} className="text-xs text-text-muted hover:text-primary">
              Fechar
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Descrição (ex: Almoço)"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Valor (R$)"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
              required
            />
            <select
              value={type}
              onChange={e => setType(e.target.value as 'INCOME' | 'EXPENSE')}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
            >
              <option value="EXPENSE">Despesa</option>
              <option value="INCOME">Receita</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg shadow-sm"
            >
              Salvar Agora
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wallet className="w-32 h-32 text-white" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Saldo Projetado do Mês (RN-05)
          </span>
          <div className="mt-2 text-3xl font-heading font-extrabold tracking-tight">
            R$ {balanceSummary.projectedBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Considera receitas previstas - (despesas + parcelas + faturas)
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-surface-border shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Receitas Realizadas / Previstas
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-income">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-heading font-bold text-income">
            R$ {balanceSummary.realizedIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-text-muted mt-1 inline-block">
            + R$ {balanceSummary.pendingIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} pendentes
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-surface-border shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Despesas &amp; Parcelas do Mês
            </span>
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-expense">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-heading font-bold text-expense">
            R$ {(balanceSummary.realizedExpense + balanceSummary.pendingExpense).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-text-muted mt-1 inline-block">
            Inclui lançamentos, financiamentos e cartões
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 bg-white rounded-2xl border border-surface-border shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-primary flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-500" /> Útimos Lançamentos (US02.2)
            </h3>
            <Link href="/transactions" className="text-xs font-semibold text-primary hover:underline">
              Ver Todos &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {transactions.slice(0, 5).map(tx => (
              <div key={tx.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleTransactionStatus(tx.id)}
                    title="Clique para alternar status Pago / Pendente"
                    className="transition-transform active:scale-95"
                  >
                    {tx.status === 'PAID' ? (
                      <CheckCircle2 className="w-5 h-5 text-income fill-emerald-100" />
                    ) : (
                      <Clock className="w-5 h-5 text-pending fill-amber-100" />
                    )}
                  </button>
                  <div>
                    <p className="text-sm font-semibold text-primary">{tx.description}</p>
                    <span className="text-xs text-text-muted">{tx.category} • {tx.ref_date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold ${tx.type === 'INCOME' ? 'text-income' : 'text-primary'}`}>
                    {tx.type === 'INCOME' ? '+' : '-'} R$ {Number(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <div>
                    <span className={tx.status === 'PAID' ? 'badge-paid' : 'badge-pending'}>
                      {tx.status === 'PAID' ? 'Pago' : 'Pendente'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-surface-border shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-primary flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" /> Financiamentos &amp; Amortizações (RN-04)
            </h3>
            <Link href="/commitments" className="text-xs font-semibold text-blue-600 hover:underline">
              Gerenciar &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {commitments.map(comm => {
              const commInsts = installments.filter(i => i.commitment_id === comm.id);
              const paidCount = commInsts.filter(i => i.status === 'PAID').length;
              const amortizedCount = commInsts.filter(i => i.is_amortized).length;

              return (
                <div key={comm.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-sm text-primary">{comm.title}</h4>
                      <span className="text-xs text-text-secondary">
                        {comm.total_installments} parcelas • Amortizadas: <strong className="text-blue-600">{amortizedCount} (trás p/ frente)</strong>
                      </span>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      R$ {Number(comm.total_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-emerald-500 h-full" 
                      style={{ width: `${(paidCount / comm.total_installments) * 100}%` }}
                      title={`${paidCount} parcelas pagas normalmente`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
