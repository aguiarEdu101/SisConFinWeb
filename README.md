# SisConFinWeb — Gestão Financeira Pessoal e Familiar

O **SisConFinWeb** é uma aplicação **Web Responsiva e Progressive Web App (PWA)** moderna construída para substituir controles manuais por planilhas por uma solução colaborativa, ágil e de **fricção mínima** focada em manter a adesão diária dos usuários.

---

## 🚀 Funcionalidades Principais (MVP 1.0)

- **EPIC 01 — Onboarding e Gestão de Grupos (US01.1 & US01.2):** Criação obrigatória de Grupo Financeiro no primeiro acesso e gestão de membros por e-mail com roles `ADMIN` e `BASIC` (RN-03).
- **EPIC 02 — Gestão de Lançamentos e Fluxo de Caixa (US02.1 & US02.2):** Registro de receitas e despesas com modal de cadastro em < 3 segundos e alternância de status (`PENDING` / `PAID`) em 1 toque.
- **EPIC 03 — Financiamentos e Amortização Antecipada (US03.1 & US03.2):** Cadastro de compromissos de longo prazo e motor nativo de **Amortização Antecipada de Trás para Frente (RN-04)** (quitação da última parcela com abatimento do saldo devedor).
- **EPIC 04 — Cartões de Crédito e Faturas (US04.1):** Acompanhamento simplificado do valor consolidado da fatura mês a mês.
- **EPIC 05 — Exportação Multi-formato (US05.1):** Geração em 1 clique e Direct Download de planilhas `.xlsx` formatadas.
- **RN-05 — Motor de Saldo Projetado:** Equação matemática calculando em tempo real o saldo projetado do mês e desconsiderando parcelas amortizadas.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14+ (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons.
- **PWA Layer:** Progressive Web App manifest (`public/manifest.json`) com suporte a instalação em iOS, Android e Desktop.
- **Backend & Database:** Supabase (Supabase Auth + Supabase PostgreSQL com Row Level Security - RLS).
- **Exportação:** ExcelJS (`exceljs`).
- **Testes:** Vitest + React Testing Library (Unidade & Integração) + Playwright (E2E).
- **Deploy:** Vercel + Docker (Node.js 22).

---

## 📖 Como Executar Localmente

### Via Docker
```bash
docker compose up
```
Acesse no seu navegador: `http://localhost:3000`

### Via Node.js / npm
```bash
npm install
npm run dev
```

---

## 🧪 Rodar a Suíte de Testes TDD

```bash
# Executar testes unitários e de integração
npm run test

# Executar testes E2E com Playwright
npm run test:e2e
```

---

## 🌐 Deploy na Vercel e Configuração Supabase

Consulte o guia completo em **[DEPLOYMENT.md](DEPLOYMENT.md)**.
