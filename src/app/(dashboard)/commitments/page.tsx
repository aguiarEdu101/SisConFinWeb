'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Landmark, ArrowRightLeft, PlusCircle, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function CommitmentsPage() {
  const { commitments, installments, addCommitment, amortizeCommitment } = useApp();

  const [selectedCommitmentId, setSelectedCommitmentId] = useState<string>(commitments[0]?.id || '');
  const [amortizeAmount, setAmortizeAmount] = useState<string>('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [totalInstallments, setTotalInstallments] = useState('36');

  const selectedComm = commitments.find(c => c.id === selectedCommitmentId) || commitments[0];
  const selectedInsts = installments
    .filter(i => i.commitment_id === selectedComm?.id)
    .sort((a, b) => a.installment_number - b.installment_number);

  const handleAmortizeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amortizeAmount || !selectedComm) return;
    amortizeCommitment(selectedComm.id, parseFloat(amortizeAmount));
    setAmortizeAmount('');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !totalAmount) return;
    addCommitment({
      title,
      total_amount: parseFloat(totalAmount),
      total_installments: parseInt(totalInstallments, 10),
      start_date: new Date().toISOString().slice(0, 10),
      type: 'FINANCING'
    });
    setTitle('');
    setTotalAmount('');
    setShowAddModal(false);
  };

  const amortizedCount = selectedInsts.filter(i => i.is_amortized).length;
  const paidCount = selectedInsts.filter(i => i.status === 'PAID' && !i.is_amortized).length;
  const pendingCount = selectedInsts.filter(i => i.status !== 'PAID').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
            <Landmark className="w-7 h-7 text-blue-600" /> Financiamentos & Amortizações (EPIC 03)
          </h2>
          <p className="text-sm text-text-secondary">
            Controle de compromissos longos com motor de amortização de trás para frente (RN-04).
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg shadow-md transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Novo Financiamento</span>
        </button>
      </div>

      <div className="flex overflow-x-auto pb-2 gap-3">
        {commitments.map(comm => (
          <button
            key={comm.id}
            onClick={() => setSelectedCommitmentId(comm.id)}
            className={`px-4 py-3 rounded-xl border text-left font-semibold text-sm min-w-[240px] transition-all ${
              selectedComm?.id === comm.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-white text-primary border-surface-border hover:bg-slate-50'
            }`}
          >
            <div className="text-xs opacity-75 font-normal">Compromisso</div>
            <div className="font-heading truncate">{comm.title}</div>
            <div className="mt-1 text-xs font-bold text-blue-400">
              R$ {Number(comm.total_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({comm.total_installments}x)
            </div>
          </button>
        ))}
      </div>

      {selectedComm && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-400" /> Amortização Antecipada (RN-04)
              </span>
              <span className="text-xs bg-blue-500/30 border border-blue-400/40 text-blue-200 px-2 py-0.5 rounded-full font-semibold">
                Trás p/ Frente
              </span>
            </div>

            <p className="text-xs text-blue-100/90 leading-relaxed">
              Aportes extras de PLR ou férias são aplicados abatendo a <strong>última parcela</strong> (maior número). As parcelas amortizadas são quitadas e deixam de compor o saldo devedor futuro.
            </p>

            <form onSubmit={handleAmortizeSubmit} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-blue-200 mb-1">Valor do Aporte Extra (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ex: 1333.33"
                  value={amortizeAmount}
                  onChange={e => setAmortizeAmount(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm rounded-lg shadow-lg flex items-center justify-center space-x-2 transition-all"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>Amortizar Parcela Final</span>
              </button>
            </form>

            <div className="pt-3 border-t border-blue-800/60 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-blue-950/60">
                <div className="text-slate-400 text-[10px]">Pagas</div>
                <div className="font-bold text-emerald-400">{paidCount}x</div>
              </div>
              <div className="p-2 rounded-lg bg-blue-950/60">
                <div className="text-slate-400 text-[10px]">Amortizadas</div>
                <div className="font-bold text-blue-400">{amortizedCount}x</div>
              </div>
              <div className="p-2 rounded-lg bg-blue-950/60">
                <div className="text-slate-400 text-[10px]">Pendentes</div>
                <div className="font-bold text-amber-400">{pendingCount}x</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl border border-surface-border shadow-sm p-5 space-y-4">
            <h3 className="font-heading font-bold text-base text-primary flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Cronograma de Parcelas ({selectedComm.title})
            </h3>

            <div className="max-h-[420px] overflow-y-auto pr-1 divide-y divide-slate-100">
              <div className="grid grid-cols-4 text-xs font-semibold uppercase text-text-muted py-2 px-2 bg-slate-50 rounded-lg">
                <span>Nº Parcela</span>
                <span>Vencimento</span>
                <span className="text-right">Valor</span>
                <span className="text-center">Status / Amortização</span>
              </div>
              {selectedInsts.map(inst => (
                <div key={inst.id} className="grid grid-cols-4 items-center py-2.5 px-2 text-sm">
                  <span className="font-bold text-primary">Parcela {inst.installment_number}</span>
                  <span className="text-text-muted text-xs">{inst.due_date}</span>
                  <span className="text-right font-bold text-primary">
                    R$ {Number(inst.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <div className="text-center">
                    {inst.is_amortized ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        <Sparkles className="w-3 h-3 mr-1" /> Amortizada (RN-04)
                      </span>
                    ) : inst.status === 'PAID' ? (
                      <span className="badge-paid">
                        <CheckCircle2 className="w-3 h-3" /> Pago
                      </span>
                    ) : (
                      <span className="badge-pending">Pendente</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-surface-border shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-heading font-bold text-primary">Novo Compromisso de Longo Prazo</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Título do Compromisso</label>
                <input
                  type="text"
                  placeholder="Ex: Financiamento Carro, Seguro Obra MRV"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Valor Total (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ex: 50000.00"
                  value={totalAmount}
                  onChange={e => setTotalAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Quantidade de Parcelas</label>
                <input
                  type="number"
                  value={totalInstallments}
                  onChange={e => setTotalInstallments(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-text-secondary hover:text-primary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary-hover shadow-sm"
                >
                  Criar Cronograma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
