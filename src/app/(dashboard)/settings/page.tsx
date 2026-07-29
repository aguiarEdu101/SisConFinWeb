'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Users, FileSpreadsheet, ShieldAlert, UserPlus, Download, Check } from 'lucide-react';
import { downloadFinancialReport } from '@/services/exportExcel';
import { UserRole } from '@/types';

export default function SettingsPage() {
  const { 
    currentGroup, 
    currentRole, 
    userGroups, 
    transactions, 
    commitments, 
    creditCards, 
    inviteMember, 
    updateMemberRole 
  } = useApp();

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('BASIC');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    inviteMember(inviteEmail, inviteRole);
    setInviteEmail('');
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    setExportSuccess(false);
    try {
      await downloadFinancialReport(
        currentGroup.name,
        transactions,
        commitments,
        creditCards
      );
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error('Erro ao exportar planilha:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const isAdmin = currentRole === 'ADMIN';

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
          <Users className="w-7 h-7 text-slate-700" /> Grupo & Exportação (EPIC 01 & 05)
        </h2>
        <p className="text-sm text-text-secondary">
          Gestão de membros do grupo colaborativo e exportação multi-formato dos dados.
        </p>
      </div>

      <div className="p-6 bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
            <h3 className="font-heading font-bold text-lg text-white">Exportação para Excel / Sheets (US05.1)</h3>
          </div>
          <p className="text-xs text-emerald-100/80 max-w-xl">
            Exporte todo o histórico financeiro do seu grupo em 1 clique. O arquivo <code>.xlsx</code> formatado é gerado via Direct Download no navegador.
          </p>
        </div>

        <button
          onClick={handleExportExcel}
          disabled={isExporting}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
        >
          {exportSuccess ? (
            <>
              <Check className="w-5 h-5 text-white" />
              <span>Planilha Baixada!</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>{isExporting ? 'Gerando...' : 'Exportar Planilha Excel (.xlsx)'}</span>
            </>
          )}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-primary flex items-center gap-2">
              Membros de {currentGroup.name} (US01.2)
            </h3>
            <p className="text-xs text-text-secondary">
              Somente usuários com permissão <strong>ADMIN</strong> podem convidar ou alterar permissões (RN-03).
            </p>
          </div>

          {!isAdmin && (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs font-medium text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Você está visualizando como perfil <strong>Básico</strong> (Ações de gestão desabilitadas)</span>
            </div>
          )}
        </div>

        {isAdmin && (
          <form onSubmit={handleInviteSubmit} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-center gap-3">
            <input
              type="email"
              placeholder="Digite o e-mail do familiar (ex: duda@familia.com)"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary w-full"
              required
            />
            <select
              value={inviteRole}
              onChange={e => setInviteRole(e.target.value as UserRole)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none w-full sm:w-auto"
            >
              <option value="BASIC">Perfil Básico</option>
              <option value="ADMIN">Perfil Admin</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg shadow-sm w-full sm:w-auto flex items-center justify-center space-x-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Convidar</span>
            </button>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-surface-border text-xs uppercase font-semibold text-text-muted">
              <tr>
                <th className="px-4 py-3">Membro</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3">Role / Permissão</th>
                <th className="px-4 py-3 text-right">Ação Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userGroups.map(ug => (
                <tr key={ug.user_id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3.5 font-bold text-primary">
                    {ug.profile?.name || 'Membro do Grupo'}
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary">
                    {ug.profile?.email}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      ug.role === 'ADMIN' 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {ug.role === 'ADMIN' ? 'Administrador' : 'Usuário Básico'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {isAdmin && (
                      <button
                        onClick={() => updateMemberRole(ug.user_id, ug.role === 'ADMIN' ? 'BASIC' : 'ADMIN')}
                        className="text-xs text-primary font-semibold hover:underline"
                      >
                        Alternar para {ug.role === 'ADMIN' ? 'Básico' : 'Admin'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
