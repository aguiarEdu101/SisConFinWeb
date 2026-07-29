'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, UserCheck, Wallet, Sparkles, ChevronDown, LogOut, FlaskConical, Layers } from 'lucide-react';

export function Navbar() {
  const { 
    isMock, 
    currentUser, 
    currentGroup, 
    userGroupsList, 
    switchGroup, 
    currentRole, 
    switchUserRole, 
    logout 
  } = useApp();

  const [showGroupDropdown, setShowGroupDropdown] = useState(false);

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

              {isMock && (
                <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                  <FlaskConical className="w-3 h-3 mr-1" /> Modo Dev (Mock Local)
                </span>
              )}
            </div>

            <div className="relative mt-0.5">
              <button
                onClick={() => setShowGroupDropdown(!showGroupDropdown)}
                className="flex items-center space-x-1 text-xs font-semibold text-text-secondary hover:text-primary transition-colors"
              >
                <Layers className="w-3 h-3 text-blue-600" />
                <span>{currentGroup?.name || 'Selecione um Grupo'}</span>
                <ChevronDown className="w-3 h-3 text-text-muted" />
              </button>

              {showGroupDropdown && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-surface-border rounded-xl shadow-xl z-50 p-1 divide-y divide-slate-100">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-text-muted">
                    Meus Grupos ({userGroupsList.length}/3)
                  </div>
                  <div className="py-1">
                    {userGroupsList.map(g => (
                      <button
                        key={g.id}
                        onClick={() => {
                          switchGroup(g.id);
                          setShowGroupDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-between transition-colors ${
                          currentGroup?.id === g.id
                            ? 'bg-slate-900 text-white'
                            : 'text-primary hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate">{g.name}</span>
                        {currentGroup?.id === g.id && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-bold text-primary truncate max-w-[140px]">
              {currentUser?.name || currentUser?.email || 'Usuário'}
            </span>
            <span className="text-[10px] text-text-muted">
              {currentUser?.email}
            </span>
          </div>

          <div className="flex rounded-md p-1 bg-slate-100 border border-slate-200">
            <button
              onClick={() => switchUserRole('ADMIN')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-sm text-xs font-semibold transition-all ${
                currentRole === 'ADMIN'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-secondary hover:text-primary'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>
            <button
              onClick={() => switchUserRole('BASIC')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-sm text-xs font-semibold transition-all ${
                currentRole === 'BASIC'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-secondary hover:text-primary'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Básico</span>
            </button>
          </div>

          <button
            onClick={() => logout()}
            className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            title="Sair da Conta"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
