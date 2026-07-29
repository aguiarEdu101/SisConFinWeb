'use client';

import React, { useState } from 'react';
import { Users, CheckCircle2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function OnboardingPage() {
  const [groupName, setGroupName] = useState('Família Silva & Souza');

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName) return;
    window.location.href = '/';
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-surface-border shadow-xl max-w-lg w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
            <Users className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-block">
            Passo Obrigatório • US01.1
          </span>
          <h2 className="text-2xl font-heading font-extrabold text-primary">
            Crie seu Grupo Financeiro
          </h2>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            Todas as suas receitas, despesas e financiamentos pertencerão a um contexto de grupo colaborativo.
          </p>
        </div>

        <form onSubmit={handleCreateGroup} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Nome do Grupo Financeiro
            </label>
            <input
              type="text"
              placeholder="Ex: Família Silva & Souza, Orçamento Casal"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary font-semibold text-primary"
              required
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs text-text-secondary">
            <div className="flex items-center space-x-2 font-semibold text-primary">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>O que acontece a seguir?</span>
            </div>
            <ul className="space-y-1 list-disc list-inside">
              <li>Você será definido automaticamente como <strong>Administrador (ADMIN)</strong>.</li>
              <li>Você poderá convidar parceiros e familiares por e-mail no painel.</li>
              <li>Todas as movimentações e amortizações serão sincronizadas para o grupo.</li>
            </ul>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Concluir Onboarding e Ir ao Painel</span>
          </button>
        </form>
      </div>
    </div>
  );
}
