'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PlusCircle, CheckCircle2, Clock, Trash2, Filter } from 'lucide-react';
import { TransactionType, PaymentStatus } from '@/types';

export default function TransactionsPage() {
  const { transactions, addTransaction, toggleTransactionStatus, deleteTransaction } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [category, setCategory] = useState('Alimentação');
  const [status, setStatus] = useState<PaymentStatus>('PENDING');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;
    addTransaction({
      description,
      amount: parseFloat(amount),
      type,
      category,
      ref_date: new Date().toISOString().slice(0, 10),
      status
    });
    setDescription('');
    setAmount('');
    setShowModal(false);
  };

  const filteredTransactions = transactions.filter(t => {
    if (filterType !== 'ALL' && t.type !== filterType) return false;
    if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary">
            Lançamentos Financeiros (EPIC 02)
          </h2>
          <p className="text-sm text-text-secondary">
            Registre e altere status de receitas e despesas com fricção mínima.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg shadow-md transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Novo Lançamento</span>
        </button>
      </div>

      <div className="p-4 bg-white rounded-xl border border-surface-border flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center space-x-2 text-text-secondary font-medium">
          <Filter className="w-4 h-4" />
          <span>Filtrar por:</span>
        </div>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none"
        >
          <option value="ALL">Todos os Tipos</option>
          <option value="EXPENSE">Despesas</option>
          <option value="INCOME">Receitas</option>
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none"
        >
          <option value="ALL">Todos os Status</option>
          <option value="PAID">Pagos</option>
          <option value="PENDING">Pendentes</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-surface-border text-xs uppercase font-semibold text-text-muted">
              <tr>
                <th className="px-5 py-3.5">Status (1-Clique)</th>
                <th className="px-5 py-3.5">Descrição</th>
                <th className="px-5 py-3.5">Categoria</th>
                <th className="px-5 py-3.5">Data Ref.</th>
                <th className="px-5 py-3.5 text-right">Valor (R$)</th>
                <th className="px-5 py-3.5 text-center">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleTransactionStatus(tx.id)}
                      className="inline-flex items-center space-x-1.5 font-semibold text-xs transition-transform active:scale-95"
                      title="Clique para alternar entre Pago e Pendente"
                    >
                      {tx.status === 'PAID' ? (
                        <span className="badge-paid">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Pago
                        </span>
                      ) : (
                        <span className="badge-pending">
                          <Clock className="w-3.5 h-3.5" /> Pendente
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-4 font-semibold text-primary">
                    {tx.description}
                  </td>
                  <td className="px-5 py-4 text-text-secondary">
                    {tx.category}
                  </td>
                  <td className="px-5 py-4 text-text-muted whitespace-nowrap">
                    {tx.ref_date}
                  </td>
                  <td className={`px-5 py-4 text-right font-bold ${tx.type === 'INCOME' ? 'text-income' : 'text-primary'}`}>
                    {tx.type === 'INCOME' ? '+' : '-'} R$ {Number(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Excluir Lançamento"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-surface-border shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-heading font-bold text-primary">Novo Lançamento Diário</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Descrição</label>
                <input
                  type="text"
                  placeholder="Ex: Supermercado, Salário, Internet"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Tipo</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as TransactionType)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  >
                    <option value="EXPENSE">Despesa</option>
                    <option value="INCOME">Receita</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Status Inicial</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as PaymentStatus)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  >
                    <option value="PENDING">Pendente</option>
                    <option value="PAID">Pago</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Categoria</label>
                <input
                  type="text"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-text-secondary hover:text-primary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary-hover shadow-sm"
                >
                  Cadastrar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
