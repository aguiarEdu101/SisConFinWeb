'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Transaction, 
  Commitment, 
  Installment, 
  CreditCard, 
  CardStatement, 
  UserProfile, 
  Group, 
  UserGroup, 
  UserRole,
  BalanceSummary 
} from '@/types';
import { isMockMode, MockDataProvider, DataState } from '@/services/dataProvider';
import { supabase } from '@/lib/supabase/client';
import { calculateMonthlyBalance } from '@/utils/balanceCalculator';
import { amortizeReverseInstallment } from '@/utils/amortization';

interface AppContextType {
  isMock: boolean;
  currentUser: UserProfile | null;
  currentGroup: Group | null;
  userGroupsList: Group[];
  currentRole: UserRole;
  userGroups: UserGroup[];
  transactions: Transaction[];
  commitments: Commitment[];
  installments: Installment[];
  creditCards: CreditCard[];
  cardStatements: CardStatement[];
  balanceSummary: BalanceSummary;
  switchUserRole: (role: UserRole) => void;
  switchGroup: (groupId: string) => void;
  createGroup: (name: string) => { success: boolean; error?: string };
  deleteGroupSafely: (groupId: string, confirmationText: string) => { success: boolean; error?: string };
  addTransaction: (tx: Omit<Transaction, 'id' | 'group_id' | 'user_id' | 'created_at'>) => void;
  toggleTransactionStatus: (id: string) => void;
  deleteTransaction: (id: string) => void;
  addCommitment: (commitment: Omit<Commitment, 'id' | 'group_id' | 'created_at'>) => void;
  amortizeCommitment: (commitmentId: string, amount: number) => void;
  addCreditCard: (card: Omit<CreditCard, 'id' | 'group_id' | 'created_at'>) => void;
  updateCardStatement: (cardId: string, month: number, year: number, amount: number, status: 'PENDING' | 'PAID') => void;
  inviteMember: (email: string, role: UserRole) => void;
  updateMemberRole: (userId: string, newRole: UserRole) => void;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isMock] = useState<boolean>(isMockMode());
  const [dataState, setDataState] = useState<DataState>(() => MockDataProvider.loadState());
  const [currentRole, setCurrentRole] = useState<UserRole>('ADMIN');

  useEffect(() => {
    if (isMock) {
      MockDataProvider.saveState(dataState);
    }
  }, [dataState, isMock]);

  useEffect(() => {
    if (!isMock) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          fetchSupabaseUserData(session.user.id, session.user.email || '');
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          fetchSupabaseUserData(session.user.id, session.user.email || '');
        } else {
          setDataState(prev => ({ ...prev, user: null, currentGroup: null }));
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, [isMock]);

  const fetchSupabaseUserData = async (userId: string, email: string) => {
    try {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
      const userObj: UserProfile = profile || {
        id: userId,
        email,
        name: email.split('@')[0],
        created_at: new Date().toISOString()
      };

      const { data: ugList } = await supabase
        .from('user_groups')
        .select('*, group:groups(*)')
        .eq('user_id', userId);

      const userGroupsMapped: Group[] = ugList ? ugList.map((item: { group: Group }) => item.group).filter(Boolean) : [];

      setDataState(prev => ({
        ...prev,
        user: userObj,
        groups: userGroupsMapped,
        currentGroup: userGroupsMapped[0] || null
      }));
    } catch (err) {
      console.error('Erro ao buscar dados do Supabase:', err);
    }
  };

  const balanceSummary = calculateMonthlyBalance(
    dataState.transactions, 
    dataState.installments, 
    dataState.cardStatements
  );

  const switchUserRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const switchGroup = (groupId: string) => {
    const targetGroup = dataState.groups.find(g => g.id === groupId);
    if (targetGroup) {
      setDataState(prev => ({ ...prev, currentGroup: targetGroup }));
    }
  };

  const createGroup = (name: string): { success: boolean; error?: string } => {
    if (dataState.groups.length >= 3) {
      return { 
        success: false, 
        error: 'Limite máximo de 3 grupos financeiros atingido para a sua conta.' 
      };
    }

    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name,
      created_by_user_id: dataState.user?.id || 'user-id',
      created_at: new Date().toISOString()
    };

    const newUserGroup: UserGroup = {
      user_id: dataState.user?.id || 'user-id',
      group_id: newGroup.id,
      role: 'ADMIN',
      joined_at: new Date().toISOString(),
      profile: dataState.user || undefined
    };

    setDataState(prev => ({
      ...prev,
      groups: [...prev.groups, newGroup],
      currentGroup: newGroup,
      userGroups: [...prev.userGroups, newUserGroup]
    }));

    return { success: true };
  };

  const deleteGroupSafely = (groupId: string, confirmationText: string): { success: boolean; error?: string } => {
    const targetGroup = dataState.groups.find(g => g.id === groupId);
    if (!targetGroup) {
      return { success: false, error: 'Grupo não encontrado.' };
    }

    const expectedConfirmation = targetGroup.name.trim();
    if (confirmationText.trim() !== expectedConfirmation && confirmationText.trim() !== `CONFIRMAR ${expectedConfirmation}`) {
      return { 
        success: false, 
        error: `Confirmação incorreta. Digite exatamente "${expectedConfirmation}" para autorizar a exclusão.` 
      };
    }

    const remainingGroups = dataState.groups.filter(g => g.id !== groupId);
    const nextCurrentGroup = remainingGroups[0] || null;

    setDataState(prev => ({
      ...prev,
      groups: remainingGroups,
      currentGroup: nextCurrentGroup,
      userGroups: prev.userGroups.filter(ug => ug.group_id !== groupId),
      transactions: prev.transactions.filter(t => t.group_id !== groupId),
      commitments: prev.commitments.filter(c => c.group_id !== groupId),
      creditCards: prev.creditCards.filter(cc => cc.group_id !== groupId),
    }));

    return { success: true };
  };

  const addTransaction = (txData: Omit<Transaction, 'id' | 'group_id' | 'user_id' | 'created_at'>) => {
    if (!dataState.currentGroup) return;
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}`,
      group_id: dataState.currentGroup.id,
      user_id: dataState.user?.id || 'user-id',
      created_at: new Date().toISOString()
    };
    setDataState(prev => ({
      ...prev,
      transactions: [newTx, ...prev.transactions]
    }));
  };

  const toggleTransactionStatus = (id: string) => {
    setDataState(prev => ({
      ...prev,
      transactions: prev.transactions.map(t => {
        if (t.id === id) {
          const nextStatus = t.status === 'PAID' ? 'PENDING' : 'PAID';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    }));
  };

  const deleteTransaction = (id: string) => {
    setDataState(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
  };

  const addCommitment = (cData: Omit<Commitment, 'id' | 'group_id' | 'created_at'>) => {
    if (!dataState.currentGroup) return;
    const commId = `comm-${Date.now()}`;
    const newComm: Commitment = {
      ...cData,
      id: commId,
      group_id: dataState.currentGroup.id,
      created_at: new Date().toISOString()
    };

    const instAmount = Number((cData.total_amount / cData.total_installments).toFixed(2));
    const newInstallments: Installment[] = Array.from({ length: cData.total_installments }, (_, i) => {
      const num = i + 1;
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + i);
      return {
        id: `inst-${commId}-${num}`,
        commitment_id: commId,
        installment_number: num,
        amount: instAmount,
        due_date: dueDate.toISOString().slice(0, 10),
        status: 'PENDING',
        is_amortized: false
      };
    });

    setDataState(prev => ({
      ...prev,
      commitments: [...prev.commitments, newComm],
      installments: [...prev.installments, ...newInstallments]
    }));
  };

  const amortizeCommitment = (commitmentId: string, amount: number) => {
    const commInstallments = dataState.installments.filter(i => i.commitment_id === commitmentId);
    const { updatedInstallments } = amortizeReverseInstallment(commInstallments, amount);

    setDataState(prev => ({
      ...prev,
      installments: prev.installments.map(i => {
        const updated = updatedInstallments.find(u => u.id === i.id);
        return updated || i;
      })
    }));
  };

  const addCreditCard = (cardData: Omit<CreditCard, 'id' | 'group_id' | 'created_at'>) => {
    if (!dataState.currentGroup) return;
    const newCard: CreditCard = {
      ...cardData,
      id: `card-${Date.now()}`,
      group_id: dataState.currentGroup.id,
      created_at: new Date().toISOString()
    };
    setDataState(prev => ({
      ...prev,
      creditCards: [...prev.creditCards, newCard]
    }));
  };

  const updateCardStatement = (cardId: string, month: number, year: number, amount: number, status: 'PENDING' | 'PAID') => {
    setDataState(prev => {
      const existing = prev.cardStatements.find(s => s.card_id === cardId && s.month_ref === month && s.year_ref === year);
      let updatedStatements: CardStatement[];
      if (existing) {
        updatedStatements = prev.cardStatements.map(s => s.id === existing.id ? { ...s, total_amount: amount, status } : s);
      } else {
        const newStmt: CardStatement = {
          id: `stmt-${Date.now()}`,
          card_id: cardId,
          month_ref: month,
          year_ref: year,
          total_amount: amount,
          status,
          created_at: new Date().toISOString()
        };
        updatedStatements = [...prev.cardStatements, newStmt];
      }
      return { ...prev, cardStatements: updatedStatements };
    });
  };

  const inviteMember = (email: string, role: UserRole) => {
    if (currentRole !== 'ADMIN' || !dataState.currentGroup) return;
    const newUserId = `user-${Date.now()}`;
    const newUserGroup: UserGroup = {
      user_id: newUserId,
      group_id: dataState.currentGroup.id,
      role,
      joined_at: new Date().toISOString(),
      profile: {
        id: newUserId,
        email,
        name: email.split('@')[0],
        created_at: new Date().toISOString()
      }
    };
    setDataState(prev => ({
      ...prev,
      userGroups: [...prev.userGroups, newUserGroup]
    }));
  };

  const updateMemberRole = (userId: string, newRole: UserRole) => {
    if (currentRole !== 'ADMIN') return;
    setDataState(prev => ({
      ...prev,
      userGroups: prev.userGroups.map(ug => ug.user_id === userId ? { ...ug, role: newRole } : ug)
    }));
  };

  const logout = async () => {
    if (!isMock) {
      await supabase.auth.signOut();
    }
    setDataState(prev => ({ ...prev, user: null, currentGroup: null }));
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <AppContext.Provider value={{
      isMock,
      currentUser: dataState.user,
      currentGroup: dataState.currentGroup,
      userGroupsList: dataState.groups,
      currentRole,
      userGroups: dataState.userGroups,
      transactions: dataState.transactions,
      commitments: dataState.commitments,
      installments: dataState.installments,
      creditCards: dataState.creditCards,
      cardStatements: dataState.cardStatements,
      balanceSummary,
      switchUserRole,
      switchGroup,
      createGroup,
      deleteGroupSafely,
      addTransaction,
      toggleTransactionStatus,
      deleteTransaction,
      addCommitment,
      amortizeCommitment,
      addCreditCard,
      updateCardStatement,
      inviteMember,
      updateMemberRole,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
}
