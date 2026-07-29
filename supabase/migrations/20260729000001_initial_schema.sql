-- Schema Inicial SisConFin (MVP 1.0)
-- Banco de Dados PostgreSQL para Supabase

-- Enums
CREATE TYPE public.user_role AS ENUM ('ADMIN', 'BASIC');
CREATE TYPE public.transaction_type AS ENUM ('INCOME', 'EXPENSE');
CREATE TYPE public.payment_status AS ENUM ('PENDING', 'PAID', 'LATE');
CREATE TYPE public.commitment_type AS ENUM ('FINANCING', 'LOAN', 'OTHER');

-- 1. Profiles (Usuários)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  default_group_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Groups (Grupos Financeiros)
CREATE TABLE public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_by_user_id UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FK de default_group_id em profiles
ALTER TABLE public.profiles 
  ADD CONSTRAINT fk_profiles_default_group 
  FOREIGN KEY (default_group_id) REFERENCES public.groups(id) ON DELETE SET NULL;

-- 3. User Groups (Junção e Roles RBAC)
CREATE TABLE public.user_groups (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  role public.user_role DEFAULT 'BASIC',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, group_id)
);

-- 4. Transactions (Lançamentos Diários)
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  description TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  type public.transaction_type NOT NULL,
  category TEXT NOT NULL,
  ref_date DATE NOT NULL,
  status public.payment_status DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Commitments (Compromissos Extensos / Financiamentos)
CREATE TABLE public.commitments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  start_date DATE NOT NULL,
  total_installments INT NOT NULL,
  type public.commitment_type DEFAULT 'FINANCING',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Installments (Parcelas de Financiamentos)
CREATE TABLE public.installments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commitment_id UUID NOT NULL REFERENCES public.commitments(id) ON DELETE CASCADE,
  installment_number INT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  due_date DATE NOT NULL,
  status public.payment_status DEFAULT 'PENDING',
  is_amortized BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMPTZ,
  UNIQUE(commitment_id, installment_number)
);

-- 7. Credit Cards (Cartões de Crédito)
CREATE TABLE public.credit_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  card_name TEXT NOT NULL,
  closing_day INT NOT NULL,
  due_day INT NOT NULL,
  monthly_limit DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Card Statements (Faturas Mensais de Cartão)
CREATE TABLE public.card_statements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID NOT NULL REFERENCES public.credit_cards(id) ON DELETE CASCADE,
  month_ref INT NOT NULL,
  year_ref INT NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  status public.payment_status DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(card_id, year_ref, month_ref)
);

-- Habilitação de Row Level Security (RLS) para Isolamento de Grupo (RN-01, RN-02)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_statements ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS RLS DE ISOLAMENTO (RN-02)

CREATE POLICY "Perfis visíveis pelos próprios usuários" ON public.profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Grupos visíveis aos membros associados" ON public.groups
  FOR ALL USING (
    id IN (SELECT group_id FROM public.user_groups WHERE user_id = auth.uid())
    OR created_by_user_id = auth.uid()
  );

CREATE POLICY "User Groups visíveis aos membros do mesmo grupo" ON public.user_groups
  FOR ALL USING (
    group_id IN (SELECT group_id FROM public.user_groups WHERE user_id = auth.uid())
    OR user_id = auth.uid()
  );

CREATE POLICY "Transações visíveis aos membros do grupo" ON public.transactions
  FOR ALL USING (
    group_id IN (SELECT group_id FROM public.user_groups WHERE user_id = auth.uid())
  );

CREATE POLICY "Compromissos visíveis aos membros do grupo" ON public.commitments
  FOR ALL USING (
    group_id IN (SELECT group_id FROM public.user_groups WHERE user_id = auth.uid())
  );

CREATE POLICY "Parcelas visíveis via compromisso do grupo" ON public.installments
  FOR ALL USING (
    commitment_id IN (
      SELECT id FROM public.commitments WHERE group_id IN (
        SELECT group_id FROM public.user_groups WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Cartões visíveis aos membros do grupo" ON public.credit_cards
  FOR ALL USING (
    group_id IN (SELECT group_id FROM public.user_groups WHERE user_id = auth.uid())
  );

CREATE POLICY "Faturas visíveis via cartão do grupo" ON public.card_statements
  FOR ALL USING (
    card_id IN (
      SELECT id FROM public.credit_cards WHERE group_id IN (
        SELECT group_id FROM public.user_groups WHERE user_id = auth.uid()
      )
    )
  );
