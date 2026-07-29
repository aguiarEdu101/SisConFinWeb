'use client';

import React, { useState } from 'react';
import { Wallet, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = '/onboarding';
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-surface-border shadow-xl max-w-md w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center mx-auto shadow-lg">
            <Wallet className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-heading font-extrabold text-primary">
            Acessar SisConFin
          </h2>
          <p className="text-xs text-text-secondary">
            Gestão financeira pessoal e familiar colaborativa em tempo real.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">E-mail</label>
            <input
              type="email"
              placeholder="eduardo@familia.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all"
          >
            <span>Entrar / Cadastrar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-text-muted">
          <span>Primeiro acesso? Você criará seu Grupo Financeiro em seguida.</span>
        </div>
      </div>
    </div>
  );
}
