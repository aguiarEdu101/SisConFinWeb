'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { UserProfile, UserRole } from '@/types';
import { Users, Shield, LogOut, CheckCircle, AlertTriangle, PlusCircle, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const { 
    currentUser, 
    currentGroup, 
    userGroupsList, 
    currentRole, 
    userGroups, 
    switchUserRole, 
    switchGroup,
    createGroup,
    deleteGroupSafely,
    inviteMember, 
    updateMemberRole, 
    logout 
  } = useApp();

  const [newGroupInput, setNewGroupInput] = useState('');
  const [newGroupError, setNewGroupError] = useState<string | null>(null);

  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);
  const [confirmationInput, setConfirmationInput] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('MEMBER');
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupInput.trim()) return;
    setNewGroupError(null);

    const res = createGroup(newGroupInput.trim());
    if (res.success) {
      setNewGroupInput('');
    } else {
      setNewGroupError(res.error || 'Erro ao criar grupo.');
    }
  };

  const handleOpenDeleteModal = (groupId: string) => {
    setDeletingGroupId(groupId);
    setConfirmationInput('');
    setDeleteError(null);
  };

  const handleDeleteGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletingGroupId) return;
    setDeleteError(null);

    const res = deleteGroupSafely(deletingGroupId, confirmationInput);
    if (res.success) {
      setDeletingGroupId(null);
      setConfirmationInput('');
    } else {
      setDeleteError(res.error || 'Erro ao excluir grupo.');
    }
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    inviteMember(inviteEmail, inviteRole);
    setInviteEmail('');
    setInviteSuccess(true);
    setTimeout(() => setInviteSuccess(false), 3000);
  };

  const targetDeletingGroup = userGroupsList.find(g => g.id === deletingGroupId);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-heading font-bold text-primary">
          Minha Conta &amp; Grupos Financeiros
        </h2>
        <p className="text-sm text-text-secondary">
          Gerencie até 3 grupos financeiros, membros colaboradores e dados da sua conta.
        </p>
      </div>

      <div className="p-6 bg-white rounded-2xl border border-surface-border shadow-sm space-y-4">
        <h3 className="font-heading font-bold text-base text-primary flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" /> Perfil do Usuário Logado
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <span className="text-xs text-text-muted font-medium">Nome</span>
            <p className="text-sm font-semibold text-primary">{currentUser?.name || 'Usuário SisConFin'}</p>
          </div>
          <div>
            <span className="text-xs text-text-muted font-medium">E-mail Principal</span>
            <p className="text-sm font-semibold text-primary">{currentUser?.email || 'usuario@sisconfin.com'}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-text-secondary">Papel de Simulação:</span>
            <select
              value={currentRole}
              onChange={e => switchUserRole(e.target.value as UserRole)}
              className="text-xs font-semibold px-2 py-1 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none"
            >
              <option value="ADMIN">ADMINISTRADOR</option>
              <option value="MEMBER">MEMBRO</option>
              <option value="VIEWER">LEITOR</option>
            </select>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair da Conta</span>
          </button>
        </div>
      </div>

      <div className="p-6 bg-white rounded-2xl border border-surface-border shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-heading font-bold text-base text-primary flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" /> Meus Grupos Financeiros ({userGroupsList.length}/3)
            </h3>
            <p className="text-xs text-text-secondary">
              Cada conta pode criar e participar de até 3 grupos familiares ou pessoais.
            </p>
          </div>

          <form onSubmit={handleCreateGroupSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Nome do Novo Grupo"
              value={newGroupInput}
              onChange={e => setNewGroupInput(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
              disabled={userGroupsList.length >= 3}
            />
            <button
              type="submit"
              disabled={userGroupsList.length >= 3 || !newGroupInput.trim()}
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-primary hover:bg-primary-hover disabled:bg-slate-200 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Criar</span>
            </button>
          </form>
        </div>

        {newGroupError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-700">
            {newGroupError}
          </div>
        )}

        <div className="divide-y divide-slate-100 pt-2">
          {userGroupsList.map(group => {
            const isActive = currentGroup?.id === group.id;
            return (
              <div key={group.id} className="py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-slate-300'}`} />
                  <div>
                    <p className="text-sm font-bold text-primary flex items-center gap-2">
                      {group.name}
                      {isActive && <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">Ativo</span>}
                    </p>
                    <span className="text-xs text-text-muted">Criado em {new Date(group.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!isActive && (
                    <button
                      onClick={() => switchGroup(group.id)}
                      className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-primary rounded-lg transition-colors"
                    >
                      Selecionar
                    </button>
                  )}
                  <button
                    onClick={() => handleOpenDeleteModal(group.id)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Excluir grupo com confirmação segura"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {currentGroup && (
        <div className="p-6 bg-white rounded-2xl border border-surface-border shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-primary">
                Membros do Grupo Ativo: <span className="text-emerald-600">{currentGroup.name}</span>
              </h3>
              <p className="text-xs text-text-secondary">
                Colaboradores com acesso ao fluxo financeiro deste grupo.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {userGroups.filter(ug => ug.group_id === currentGroup.id).map(ug => (
              <div key={ug.user_id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-primary">{ug.profile?.name || 'Membro Colaborador'}</p>
                  <span className="text-xs text-text-muted">{ug.profile?.email || 'membro@sisconfin.com'}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={ug.role}
                    onChange={e => updateMemberRole(ug.user_id, e.target.value as UserRole)}
                    disabled={currentRole !== 'ADMIN'}
                    className="text-xs font-semibold px-2 py-1 border border-slate-200 rounded-lg bg-slate-50"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="MEMBER">MEMBRO</option>
                    <option value="VIEWER">LEITOR</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {currentRole === 'ADMIN' && (
            <form onSubmit={handleInviteSubmit} className="pt-4 border-t border-slate-100 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">Convidar Novo Membro</span>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="E-mail do colaborador"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
                  required
                />
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value as UserRole)}
                  className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50"
                >
                  <option value="MEMBER">MEMBRO (Editar)</option>
                  <option value="VIEWER">LEITOR (Visualizar)</option>
                  <option value="ADMIN">ADMIN (Total)</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Enviar Convite
                </button>
              </div>
              {inviteSuccess && (
                <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Convite enviado com sucesso!
                </p>
              )}
            </form>
          )}
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
              A exclusão é <strong>irreversível</strong> e apagará todos os lançamentos e financiamentos do grupo <strong>&quot;{targetDeletingGroup.name}&quot;</strong>.
            </p>

            {deleteError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-700">
                {deleteError}
              </div>
            )}

            <form onSubmit={handleDeleteGroupSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-rose-700 mb-1">
                  Digite &quot;{targetDeletingGroup.name}&quot; para confirmar:
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
                  className="px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm transition-all"
                >
                  Excluir Grupo Definitivamente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
