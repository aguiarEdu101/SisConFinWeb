export type UserRole = 'ADMIN' | 'BASIC' | 'MEMBER';
export type TransactionType = 'INCOME' | 'EXPENSE';
export type PaymentStatus = 'PENDING' | 'PAID' | 'LATE';
export type CommitmentType = 'FINANCING' | 'LOAN' | 'OTHER';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  default_group_id?: string | null;
  created_at: string;
}

export interface Group {
  id: string;
  name: string;
  created_by_user_id: string;
  created_at: string;
}

export interface UserGroup {
  user_id: string;
  group_id: string;
  role: UserRole;
  joined_at: string;
  profile?: UserProfile;
}

export interface Transaction {
  id: string;
  group_id: string;
  user_id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  ref_date: string;
  status: PaymentStatus;
  created_at: string;
}

export interface Commitment {
  id: string;
  group_id: string;
  title: string;
  total_amount: number;
  start_date: string;
  total_installments: number;
  type: CommitmentType;
  created_at: string;
  installments?: Installment[];
}

// CRITICAL: Installment MUST have is_amortized and paid_at fields
// These are used in amortization.ts, balanceCalculator.ts, commitments/page.tsx, and mockStore.ts
export interface Installment {
  id: string;
  commitment_id: string;
  installment_number: number;
  amount: number;
  due_date: string;
  status: PaymentStatus;
  is_amortized: boolean;
  paid_at?: string | null;
}

// CRITICAL: CreditCard uses card_name and monthly_limit (NOT name/limit_amount)
// Verified in mockStore.ts, cards/page.tsx, exportExcel.ts
export interface CreditCard {
  id: string;
  group_id: string;
  card_name: string;
  closing_day: number;
  due_day: number;
  monthly_limit: number;
  created_at: string;
}

// CRITICAL: CardStatement uses month_ref, year_ref, total_amount (NOT month/year/amount/due_date)
// Verified in mockStore.ts, balanceCalculator.ts, cards/page.tsx, AppContext.tsx
export interface CardStatement {
  id: string;
  card_id: string;
  month_ref: number;
  year_ref: number;
  total_amount: number;
  status: PaymentStatus;
  created_at: string;
}

// CRITICAL: BalanceSummary uses these exact field names
// Verified in balanceCalculator.ts return and dashboard/page.tsx consumption
export interface BalanceSummary {
  realizedIncome: number;
  realizedExpense: number;
  realizedBalance: number;
  pendingIncome: number;
  pendingExpense: number;
  projectedBalance: number;
}
