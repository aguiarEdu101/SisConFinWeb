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

export interface Installment {
  id: string;
  commitment_id: string;
  installment_number: number;
  amount: number;
  due_date: string;
  status: PaymentStatus;
}

export interface CreditCard {
  id: string;
  group_id: string;
  name: string;
  closing_day: number;
  due_day: number;
  limit_amount: number;
  created_at: string;
}

export interface CardStatement {
  id: string;
  card_id: string;
  month: number;
  year: number;
  amount: number;
  status: PaymentStatus;
  due_date: string;
}

export interface BalanceSummary {
  incomeTotal: number;
  expenseTotal: number;
  netBalance: number;
  pendingExpenseTotal: number;
}
