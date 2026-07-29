'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Users, 
  FileSpreadsheet, 
  ShieldAlert, 
  UserPlus, 
  Download, 
  Check, 
  PlusCircle, 
  Trash2, 
  AlertTriangle,
  Layers,
  Sparkles,
  LogOut
} from 'lucide-react';
import { downloadFinancialReport } from '@/services/exportExcel';
import { UserRole } from '@/types';

export default function SettingsPage() {
  const { 
    currentUser,
    currentGroup, 
    userGroupsList,
    switchGroup,
    createGroup,
    deleteGroupSafely,
    currentRole, 
    userGroups, 
    transactions, 
    commitments, 
    creditCards, 
    inviteMember, 
    updateMemberRole,
    logout
  } = useApp();

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('BASIC');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [groupError, setGroupError] = useState<string | null>(null);

  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);
  const [confirmationInput, setConfirmationInput] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    inviteMember(inviteEmail, inviteRole);
    setInviteEmail('');
  };

  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGroupError(null);
    if (!newGroupName) return;

    const res = createGroup(newGroupName);
    if (res.success) {
      setNewGroupName('');
      setShowCreateGroup(false);
    } else {
      setGroupError(res.error || 'Erro ao criar grupo');
    }
  };

  const handleDeleteGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError(null);
    if (!deletingGroupId) return;

    const res = deleteGroupSafely(deletingGroupId, confirmationInput);
    if (res.success) {
      setDeletingGroupId(null);
      setConfirmationInput('');
    } else {
      setDeleteError(res.error || 'Erro ao deletar grupo');
    }
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    setExportSuccess(false);
    try {
      await downloadFinancialReport(
        currentGroup?.name || 'SisConFin',
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
  const targetDeletingGroup = userGroupsList.find(g => g.id === deletingGroupId);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
          <Users className="w-7 h-7 text-slate-700" /> Configurações, Meus Grupos & Perfil
        </h2>
        <p className="text-sm text-text-secondary">
          Gerencie seus grupos financeiros (até 3), membros colaboradores e dados da sua conta.
        </p>
      </div>

      <div className="p-6 bg-white rounded-2xl border border-surface-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">Minha Conta Autenticada</span>
          <h3 className="font-heading font-bold text-lg text-primary">
            {currentUser?.name || 'Usuário SisConFin'}
          </h3>
          <p className="text-xs text-text-secondary">
            E-mail: <strong>{currentUser?.email || 'Nenhum e-mail logado'}</strong>
          </p>
        </div>

        <button
          onClick={() => logout()}
          className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl border border-rose-200 flex items-center space-x-2 w-fit"
        >
          <LogOut className="w-4 h-4" />
          <span>Encerrar Sessão (Logout)</span>
        </button>
      </div>

      <div className="p-6 bg-white rounded-2xl border border-surface-border shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <h3 className="font-heading font-bold text-lg text-primary">
                Meus Grupos Financeiros ({userGroupsList.length}/3)
              </h3>
            </div>
            <p className="text-xs text-text-secondary">
              Cada usuário pode criar ou participar de no máximo <strong>3 grupos</strong> (RN-01).
            </p>
          </div>

          <button
            onClick={() => setShowCreateGroup(true)}
            disabled={userGroupsList.length >= 3}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Criar Novo Grupo</span>
          </button>
        </div>

        {userGroupsList.length >= 3 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center space-x-2 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Você atingiu o limite de 3 grupos financeiros. Para criar outro, exclua um grupo existente.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userGroupsList.map(g => {
            const isSelected = currentGroup?.id === g.id;
            return (
              <div 
                key={g.id} 
                className={`p-4 rounded-xl border transition-all space-y-3 ${
                  isSelected 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                    : 'bg-slate-50 border-slate-200 text-primary hover:bg-slate-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Grupo</span>
                    <h4 className="font-heading font-bold text-base truncate">{g.name}</h4>
                  </div>
                  {isSelected && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400 text-emerald-950">
                      Ativo
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/40">
                  <button
                    onClick={() => switchGroup(g.id)}
                    className={`text-xs font-semibold ${isSelected ? 'text-emerald-400 underline' : 'text-blue-600 hover:underline'}`}
                  >
                    {isSelected ? 'Grupo Selecionado' : 'Alternar para este grupo'}
                  </button>

                  <button
                    onClick={() => {
                      setDeletingGroupId(g.id);
                      setConfirmationInput('');
                      setDeleteError(null);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50/20"
                    title="Excluir Grupo com Segurança"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
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
              Membros de {currentGroup?.name || 'Grupo'} (US01.2)
            </h3>
            <p className="text-xs text-text-secondary">
              Somente usuários com permissão <strong>ADMIN</strong> podem convidar ou alterar permissões (RN-03).
            </p>
          </div>

          {!isAdmin && (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs font-medium text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Perfil <strong>Básico</strong> ativo (Ações de gestão desabilitadas)</span>
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

      {showCreateGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-surface-border shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-heading font-bold text-primary">Criar Novo Grupo Financeiro</h3>
            
            {groupError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-700">
                {groupError}
              </div>
            )}

            <form onSubmit={handleCreateGroupSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Nome do Grupo</label>
                <input
                  type="text"
                  placeholder="Ex: Orçamento Viagem, Família Silva"
                  value={newGroupName}
                  onChange={e => setNewGroupName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary font-semibold"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateGroup(false)}
                  className="px-4 py-2 text-sm font-semibold text-text-secondary hover:text-primary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary-hover shadow-sm"
                >
                  Salvar Grupo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingGroupId && targetDeletingGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-rose-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center space-x-2 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-heading font-bold">Exclusão Segura de Grupo</h3>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              A exclusão é <strong>irreversível</strong> e apagará todos os lançamentos e financiamentos do grupo <strong>"{targetDeletingGroup.name}"</strong>.
            </p>

            {deleteError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-700">
                {deleteError}
              </div>
            )}

            <form onSubmit={handleDeleteGroupSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-rose-700 mb-1">
                  Digite "{targetDeletingGroup.name}" para confirmar:
                </label>
                <input
                  type="text"
                  placeholder={targetDeletingGroup.name}
                  value={confirmationInput}
                  onChange={e => setConfirmationInput(e.target.value)}
                  className="w-full px-3 py-2 border border-rose-300 rounded-lg text-sm focus:outline-none font-bold text-rose-950"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setDeletingGroupId(null)}
                  className="px-4 py-2 text-sm font-semibold text-text-secondary hover:text-primary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={confirmationInput.trim() !== targetDeletingGroup.name.trim() && confirmationInput.trim() !== `CONFIRMAR ${targetDeletingGroup.name.trim()}`}
                  className="px-4 py-2 text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Excluir Grupo Permanentemente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
