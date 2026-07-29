'use client';

import React, { useState } from 'react';
import { Wallet, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage(): React.JSX.Element {
  const { isMock } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (isMock) {
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
      return;
    }

    try {
      const { data, error: authErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authErr) {
        const { error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpErr) {
          setError(signUpErr.message);
        } else {
          setMessage('Cadastro realizado! Verifique seu e-mail ou faça login.');
          window.location.href = '/onboarding';
        }
      } else if (data.session) {
        window.location.href = '/';
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao conectar à conta';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-surface-border shadow-xl max-w-md w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-lg">
            <Wallet className="w-9 h-9" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-block">
            <Sparkles className="w-3.5 h-3.5 inline -mt-0.5" /> SisConFin
          </span>
          <h2 className="text-2xl font-heading font-extrabold text-primary">
            Gestão Financeira Familiar
          </h2>
          <p className="text-xs text-text-secondary max-w-xs mx-auto">
            Acesse com e-mail e senha. O primeiro acesso cria automaticamente sua conta vinculada a um Grupo Financeiro.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}
        {message && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setEmail(e.target.value)}
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Autenticando...' : 'Entrar / Criar Conta'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-text-muted">
          <span>O primeiro acesso vincula você a um Grupo Financeiro.</span>
        </div>
      </div>
    </div>
  );
}
