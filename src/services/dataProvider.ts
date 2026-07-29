import { 
  Transaction, 
  Commitment, 
  Installment, 
  CreditCard, 
  CardStatement, 
  UserProfile, 
  Group, 
  UserGroup, 
  UserRole 
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
import { supabase } from '@/lib/supabase/client';

export interface DataState {
  user: UserProfile | null;
  groups: Group[];
  currentGroup: Group | null;
  userGroups: UserGroup[];
  transactions: Transaction[];
  commitments: Commitment[];
  installments: Installment[];
  creditCards: CreditCard[];
  cardStatements: CardStatement[];
}

export const isMockMode = (): boolean => {
  if (typeof window !== 'undefined') {
    const envVal = process.env.NEXT_PUBLIC_USE_MOCK;
    if (envVal === 'false') return false;
    if (envVal === 'true') return true;
  }
  return process.env.NODE_ENV !== 'production';
};

/**
 * Provedor de Dados Local (MockStore + LocalStorage) para Desenvolvimento Local
 */
export class MockDataProvider {
  private static STORAGE_KEY = 'sisconfin_mock_state_v1';

  static loadState(): DataState {
    if (typeof window === 'undefined') {
      return {
        user: initialUser,
        groups: [initialGroup],
        currentGroup: initialGroup,
        userGroups: initialUserGroups,
        transactions: initialTransactions,
        commitments: initialCommitments,
        installments: initialInstallments,
        creditCards: initialCreditCards,
        cardStatements: initialCardStatements,
      };
    }

    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao ler estado do localStorage:', e);
      }
    }

    const defaultState: DataState = {
      user: initialUser,
      groups: [initialGroup],
      currentGroup: initialGroup,
      userGroups: initialUserGroups,
      transactions: initialTransactions,
      commitments: initialCommitments,
      installments: initialInstallments,
      creditCards: initialCreditCards,
      cardStatements: initialCardStatements,
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultState));
    return defaultState;
  }

  static saveState(state: DataState) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    }
  }
}
