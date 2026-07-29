'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ArrowLeftRight, Landmark, CreditCard, Settings } from 'lucide-react';

const navItems = [
  { label: 'Início', href: '/', icon: LayoutDashboard },
  { label: 'Lançamentos', href: '/transactions', icon: ArrowLeftRight },
  { label: 'Financiamentos', href: '/commitments', icon: Landmark },
  { label: 'Cartões', href: '/cards', icon: CreditCard },
  { label: 'Grupo & Export', href: '/settings', icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-surface-border shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive
                  ? 'text-primary font-bold'
                  : 'text-text-secondary hover:text-primary font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[10px] leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-surface-border bg-white p-4 space-y-6">
      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
        Navegação do Grupo
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-slate-100 text-primary font-semibold shadow-sm'
                  : 'text-text-secondary hover:bg-slate-50 hover:text-primary'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
