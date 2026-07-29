'use client';

import React, { createContext, useContext, useState } from 'react';
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
import { 
  initialUser, 
  initialGroup, 
  initialUserGroups, 
  initialTransactions, 
  initialCommitments, 
  initialInstallments, 
  initialCreditCards, 
  initialCardStatements 
} from '@/lib/mockStore';
import { calculateMonthlyBalance } from '@/utils/balanceCalculator';
import { amortizeReverseInstallment } from '@/utils/amortization';

interface AppContextType {
  currentUser: UserProfile;
  currentGroup: Group;
  currentRole: UserRole;
  userGroups: UserGroup[];
  transactions: Transaction[];
  commitments: Commitment[];
  installments: Installment[];
  creditCards: CreditCard[];
  cardStatements: CardStatement[];
  balanceSummary: BalanceSummary;
  switchUserRole: (role: UserRole) => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'group_id' | 'user_id' | 'created_at'>) => void;
  toggleTransactionStatus: (id: string) => void;
  deleteTransaction: (id: string) => void;
  addCommitment: (commitment: Omit<Commitment, 'id' | 'group_id' | 'created_at'>) => void;
  amortizeCommitment: (commitmentId: string, amount: number) => void;
  addCreditCard: (card: Omit<CreditCard, 'id' | 'group_id' | 'created_at'>) => void;
  updateCardStatement: (cardId: string, month: number, year: number, amount: number, status: 'PENDING' | 'PAID') => void;
  inviteMember: (email: string, role: UserRole) => void;
  updateMemberRole: (userId: string, newRole: UserRole) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser] = useState<UserProfile>(initialUser);
  const [currentGroup] = useState<Group>(initialGroup);
  const [currentRole, setCurrentRole] = useState<UserRole>('ADMIN');
  const [userGroups, setUserGroups] = useState<UserGroup[]>(initialUserGroups);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [commitments, setCommitments] = useState<Commitment[]>(initialCommitments);
  const [installments, setInstallments] = useState<Installment[]>(initialInstallments);
  const [creditCards, setCreditCards] = useState<CreditCard[]>(initialCreditCards);
  const [cardStatements, setCardStatements] = useState<CardStatement[]>(initialCardStatements);

  const balanceSummary = calculateMonthlyBalance(transactions, installments, cardStatements);

  const switchUserRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const addTransaction = (txData: Omit<Transaction, 'id' | 'group_id' | 'user_id' | 'created_at'>) => {
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}`,
      group_id: currentGroup.id,
      user_id: currentUser.id,
      created_at: new Date().toISOString()
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const toggleTransactionStatus = (id: string) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'PAID' ? 'PENDING' : 'PAID';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addCommitment = (cData: Omit<Commitment, 'id' | 'group_id' | 'created_at'>) => {
    const commId = `comm-${Date.now()}`;
    const newComm: Commitment = {
      ...cData,
      id: commId,
      group_id: currentGroup.id,
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

    setCommitments(prev => [...prev, newComm]);
    setInstallments(prev => [...prev, ...newInstallments]);
  };

  const amortizeCommitment = (commitmentId: string, amount: number) => {
    const commInstallments = installments.filter(i => i.commitment_id === commitmentId);
    const { updatedInstallments } = amortizeReverseInstallment(commInstallments, amount);

    setInstallments(prev => prev.map(i => {
      const updated = updatedInstallments.find(u => u.id === i.id);
      return updated || i;
    }));
  };

  const addCreditCard = (cardData: Omit<CreditCard, 'id' | 'group_id' | 'created_at'>) => {
    const newCard: CreditCard = {
      ...cardData,
      id: `card-${Date.now()}`,
      group_id: currentGroup.id,
      created_at: new Date().toISOString()
    };
    setCreditCards(prev => [...prev, newCard]);
  };

  const updateCardStatement = (cardId: string, month: number, year: number, amount: number, status: 'PENDING' | 'PAID') => {
    setCardStatements(prev => {
      const existing = prev.find(s => s.card_id === cardId && s.month_ref === month && s.year_ref === year);
      if (existing) {
        return prev.map(s => s.id === existing.id ? { ...s, total_amount: amount, status } : s);
      }
      const newStmt: CardStatement = {
        id: `stmt-${Date.now()}`,
        card_id: cardId,
        month_ref: month,
        year_ref: year,
        total_amount: amount,
        status,
        created_at: new Date().toISOString()
      };
      return [...prev, newStmt];
    });
  };

  const inviteMember = (email: string, role: UserRole) => {
    if (currentRole !== 'ADMIN') return;
    const newUserId = `user-${Date.now()}`;
    const newUserGroup: UserGroup = {
      user_id: newUserId,
      group_id: currentGroup.id,
      role,
      joined_at: new Date().toISOString(),
      profile: {
        id: newUserId,
        email,
        name: email.split('@')[0],
        created_at: new Date().toISOString()
      }
    };
    setUserGroups(prev => [...prev, newUserGroup]);
  };

  const updateMemberRole = (userId: string, newRole: UserRole) => {
    if (currentRole !== 'ADMIN') return;
    setUserGroups(prev => prev.map(ug => ug.user_id === userId ? { ...ug, role: newRole } : ug));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      currentGroup,
      currentRole,
      userGroups,
      transactions,
      commitments,
      installments,
      creditCards,
      cardStatements,
      balanceSummary,
      switchUserRole,
      addTransaction,
      toggleTransactionStatus,
      deleteTransaction,
      addCommitment,
      amortizeCommitment,
      addCreditCard,
      updateCardStatement,
      inviteMember,
      updateMemberRole
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
