import { Transaction, Commitment, Installment, CreditCard, CardStatement, UserProfile, Group, UserGroup } from '@/types';

export const initialUser: UserProfile = {
  id: 'user-eduardo-01',
  email: 'eduardo@familia.com',
  name: 'Eduardo (Admin)',
  default_group_id: 'group-familia-01',
  created_at: new Date().toISOString()
};

export const initialGroup: Group = {
  id: 'group-familia-01',
  name: 'Família Silva & Souza',
  created_by_user_id: 'user-eduardo-01',
  created_at: new Date().toISOString()
};

export const initialUserGroups: UserGroup[] = [
  {
    user_id: 'user-eduardo-01',
    group_id: 'group-familia-01',
    role: 'ADMIN',
    joined_at: new Date().toISOString(),
    profile: { id: 'user-eduardo-01', email: 'eduardo@familia.com', name: 'Eduardo Silva', created_at: new Date().toISOString() }
  },
  {
    user_id: 'user-duda-02',
    group_id: 'group-familia-01',
    role: 'BASIC',
    joined_at: new Date().toISOString(),
    profile: { id: 'user-duda-02', email: 'duda@familia.com', name: 'Duda Souza', created_at: new Date().toISOString() }
  }
];

export const initialTransactions: Transaction[] = [
  {
    id: 'tx-01',
    group_id: 'group-familia-01',
    user_id: 'user-eduardo-01',
    description: 'Salário Eduardo',
    amount: 9500.00,
    type: 'INCOME',
    category: 'Salário',
    ref_date: new Date().toISOString().slice(0, 10),
    status: 'PAID',
    created_at: new Date().toISOString()
  },
  {
    id: 'tx-02',
    group_id: 'group-familia-01',
    user_id: 'user-duda-02',
    description: 'Rendimento Duda',
    amount: 4200.00,
    type: 'INCOME',
    category: 'Freelance',
    ref_date: new Date().toISOString().slice(0, 10),
    status: 'PAID',
    created_at: new Date().toISOString()
  },
  {
    id: 'tx-03',
    group_id: 'group-familia-01',
    user_id: 'user-eduardo-01',
    description: 'Supermercado Mensal',
    amount: 1850.50,
    type: 'EXPENSE',
    category: 'Alimentação',
    ref_date: new Date().toISOString().slice(0, 10),
    status: 'PAID',
    created_at: new Date().toISOString()
  },
  {
    id: 'tx-04',
    group_id: 'group-familia-01',
    user_id: 'user-duda-02',
    description: 'Condomínio Residencial',
    amount: 680.00,
    type: 'EXPENSE',
    category: 'Moradia',
    ref_date: new Date().toISOString().slice(0, 10),
    status: 'PENDING',
    created_at: new Date().toISOString()
  },
  {
    id: 'tx-05',
    group_id: 'group-familia-01',
    user_id: 'user-eduardo-01',
    description: 'Internet Fibra 500MB',
    amount: 149.90,
    type: 'EXPENSE',
    category: 'Contas Fixas',
    ref_date: new Date().toISOString().slice(0, 10),
    status: 'PAID',
    created_at: new Date().toISOString()
  }
];

export const initialCommitments: Commitment[] = [
  {
    id: 'comm-carro-01',
    group_id: 'group-familia-01',
    title: 'Financiamento Veículo (SUV)',
    total_amount: 48000.00,
    start_date: '2024-01-15',
    total_installments: 36,
    type: 'FINANCING',
    created_at: new Date().toISOString()
  },
  {
    id: 'comm-mrv-02',
    group_id: 'group-familia-01',
    title: 'Seguro Obra & Financiamento MRV',
    total_amount: 120000.00,
    start_date: '2023-06-10',
    total_installments: 120,
    type: 'FINANCING',
    created_at: new Date().toISOString()
  }
];

export const initialInstallments: Installment[] = [
  ...Array.from({ length: 36 }, (_, i) => {
    const num = i + 1;
    const isPaid = num <= 6;
    const isAmortized = num >= 35;
    return {
      id: `inst-carro-${num}`,
      commitment_id: 'comm-carro-01',
      installment_number: num,
      amount: 1333.33,
      due_date: new Date(2024, i, 15).toISOString().slice(0, 10),
      status: (isPaid || isAmortized ? 'PAID' : 'PENDING') as 'PAID' | 'PENDING',
      is_amortized: isAmortized,
      paid_at: isPaid || isAmortized ? new Date().toISOString() : null
    };
  }),

  ...Array.from({ length: 120 }, (_, i) => {
    const num = i + 1;
    const isPaid = num <= 12;
    return {
      id: `inst-mrv-${num}`,
      commitment_id: 'comm-mrv-02',
      installment_number: num,
      amount: 1000.00,
      due_date: new Date(2023, 5 + i, 10).toISOString().slice(0, 10),
      status: (isPaid ? 'PAID' : 'PENDING') as 'PAID' | 'PENDING',
      is_amortized: false,
      paid_at: isPaid ? new Date().toISOString() : null
    };
  })
];

export const initialCreditCards: CreditCard[] = [
  {
    id: 'card-01',
    group_id: 'group-familia-01',
    card_name: 'Nubank Violeta',
    closing_day: 25,
    due_day: 5,
    monthly_limit: 15000.00,
    created_at: new Date().toISOString()
  },
  {
    id: 'card-02',
    group_id: 'group-familia-01',
    card_name: 'XP Visa Infinite',
    closing_day: 18,
    due_day: 28,
    monthly_limit: 25000.00,
    created_at: new Date().toISOString()
  }
];

export const initialCardStatements: CardStatement[] = [
  {
    id: 'stmt-01',
    card_id: 'card-01',
    month_ref: new Date().getMonth() + 1,
    year_ref: new Date().getFullYear(),
    total_amount: 3240.80,
    status: 'PENDING',
    created_at: new Date().toISOString()
  },
  {
    id: 'stmt-02',
    card_id: 'card-02',
    month_ref: new Date().getMonth() + 1,
    year_ref: new Date().getFullYear(),
    total_amount: 1450.00,
    status: 'PAID',
    created_at: new Date().toISOString()
  }
];
