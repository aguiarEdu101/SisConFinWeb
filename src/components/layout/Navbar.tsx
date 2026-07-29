'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, UserCheck, Wallet, Sparkles } from 'lucide-react';

export function Navbar() {
  const { currentGroup, currentRole, switchUserRole } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-surface-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white shadow-md">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-heading font-bold text-lg text-primary leading-none">
                SisConFin
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                PWA
              </span>
            </div>
            <p className="text-xs text-text-secondary font-medium">
              {currentGroup.name}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-slate-100 border border-slate-200 text-xs text-text-secondary font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Perfil Ativo:</span>
          </div>

          <div className="flex rounded-md p-1 bg-slate-100 border border-slate-200">
            <button
              onClick={() => switchUserRole('ADMIN')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-sm text-xs font-semibold transition-all ${
                currentRole === 'ADMIN'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-secondary hover:text-primary'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
            <button
              onClick={() => switchUserRole('BASIC')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-sm text-xs font-semibold transition-all ${
                currentRole === 'BASIC'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-secondary hover:text-primary'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Básico</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
