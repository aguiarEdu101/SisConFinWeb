'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { CreditCard as CardIcon, PlusCircle, CheckCircle2, Clock } from 'lucide-react';

export default function CardsPage() {
  const { creditCards, cardStatements, addCreditCard, updateCardStatement } = useApp();

  const [showAddCard, setShowAddCard] = useState(false);
  const [cardName, setCardName] = useState('');
  const [closingDay, setClosingDay] = useState('25');
  const [dueDay, setDueDay] = useState('5');
  const [monthlyLimit, setMonthlyLimit] = useState('10000');

  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [statementAmount, setStatementAmount] = useState('');

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName || !monthlyLimit) return;
    addCreditCard({
      card_name: cardName,
      closing_day: parseInt(closingDay, 10),
      due_day: parseInt(dueDay, 10),
      monthly_limit: parseFloat(monthlyLimit)
    });
    setCardName('');
    setShowAddCard(false);
  };

  const handleUpdateStatement = (cardId: string) => {
    if (!statementAmount) return;
    updateCardStatement(cardId, currentMonth, currentYear, parseFloat(statementAmount), 'PENDING');
    setEditingCardId(null);
    setStatementAmount('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
            <CardIcon className="w-7 h-7 text-purple-600" /> Cartões de Crédito e Faturas (EPIC 04)
          </h2>
          <p className="text-sm text-text-secondary">
            Acompanhamento simplificado do valor consolidado da fatura mês a mês (US04.1).
          </p>
        </div>
        <button
          onClick={() => setShowAddCard(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg shadow-md transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Cadastrar Cartão</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {creditCards.map(card => {
          const stmt = cardStatements.find(s => s.card_id === card.id && s.month_ref === currentMonth && s.year_ref === currentYear);
          const stmtAmount = stmt ? Number(stmt.total_amount) : 0;
          const isPaid = stmt?.status === 'PAID';

          return (
            <div key={card.id} className="p-6 bg-white rounded-2xl border border-surface-border shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-primary">{card.card_name}</h3>
                  <span className="text-xs text-text-muted">
                    Fecha dia {card.closing_day} • Vence dia {card.due_day}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm border border-purple-100">
                  <CardIcon className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-text-secondary block">
                    Fatura Consolidada do Mês ({currentMonth}/{currentYear})
                  </span>
                  <div className="text-2xl font-heading font-extrabold text-primary">
                    R$ {stmtAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div>
                  {isPaid ? (
                    <span className="badge-paid">
                      <CheckCircle2 className="w-4 h-4" /> Fatura Paga
                    </span>
                  ) : (
                    <span className="badge-pending">
                      <Clock className="w-4 h-4" /> Aberta / Pendente
                    </span>
                  )}
                </div>
              </div>

              {editingCardId === card.id ? (
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Novo valor total fatura (R$)"
                    value={statementAmount}
                    onChange={e => setStatementAmount(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <button
                    onClick={() => handleUpdateStatement(card.id)}
                    className="px-3 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setEditingCardId(null)}
                    className="px-2 py-2 text-slate-400 text-xs hover:text-primary"
                  >
                    X
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => {
                      setEditingCardId(card.id);
                      setStatementAmount(stmtAmount.toString());
                    }}
                    className="text-xs font-semibold text-purple-600 hover:underline"
                  >
                    + Atualizar Valor Consolidado da Fatura
                  </button>
                  {stmt && (
                    <button
                      onClick={() => updateCardStatement(card.id, currentMonth, currentYear, stmtAmount, isPaid ? 'PENDING' : 'PAID')}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                    >
                      Marcar como {isPaid ? 'Pendente' : 'Paga'}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showAddCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-surface-border shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-heading font-bold text-primary">Cadastrar Cartão de Crédito</h3>
            <form onSubmit={handleAddCardSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Nome do Cartão</label>
                <input
                  type="text"
                  placeholder="Ex: Nubank, XP Infinite"
                  value={cardName}
                  onChange={e => setCardName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Dia Fechamento</label>
                  <input
                    type="number"
                    value={closingDay}
                    onChange={e => setClosingDay(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Dia Vencimento</label>
                  <input
                    type="number"
                    value={dueDay}
                    onChange={e => setDueDay(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Limite Mensal (R$)</label>
                <input
                  type="number"
                  value={monthlyLimit}
                  onChange={e => setMonthlyLimit(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddCard(false)}
                  className="px-4 py-2 text-sm font-semibold text-text-secondary hover:text-primary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary-hover shadow-sm"
                >
                  Salvar Cartão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
