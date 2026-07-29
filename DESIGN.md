---
name: SisConFin Modern Financial
version: 1.0.0
colors:
  primary: "#0F172A"
  primary-hover: "#1E293B"
  accent-income: "#059669"
  accent-expense: "#E11D48"
  accent-pending: "#D97706"
  accent-amortize: "#2563EB"
  surface-bg: "#F8FAFC"
  surface-card: "#FFFFFF"
  surface-border: "#E2E8F0"
  text-primary: "#0F172A"
  text-secondary: "#64748B"
  text-muted: "#94A3B8"
typography:
  h1:
    fontFamily: Plus Jakarta Sans, sans-serif
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.02em
  h2:
    fontFamily: Plus Jakarta Sans, sans-serif
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.3
  body-md:
    fontFamily: Inter, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  label-sm:
    fontFamily: Inter, sans-serif
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: 6px
  md: 10px
  lg: 16px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
components:
  card:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.lg}"
    padding: 24px
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: 12px 20px
  badge-paid:
    backgroundColor: "#ECFDF5"
    textColor: "{colors.accent-income}"
    rounded: "{rounded.full}"
  badge-pending:
    backgroundColor: "#FFFBEB"
    textColor: "{colors.accent-pending}"
    rounded: "{rounded.full}"
  badge-late:
    backgroundColor: "#FFF1F2"
    textColor: "{colors.accent-expense}"
    rounded: "{rounded.full}"
---

# SisConFin — Design System & Visual Specification

## Overview
O **SisConFin** é um gerenciador financeiro pessoal e familiar de alta clareza visual, focado em transmissão imediata de confiança, controle e fricção mínima. A interface foi desenhada com foco no contraste legível (WCAG AA), tipografia moderna e cartões de resumo que oferecem leitura em relance do **Saldo Projetado**, lançamentos e compromissos de longo prazo.

## Colors
- **Primary Ink (#0F172A):** Azul slate profundo usado para títulos principais e botões de ação primários.
- **Accent Income (#059669):** Verde esmeralda para receitas e indicadores de pagamento realizado.
- **Accent Expense (#E11D48):** Vermelho rubi para despesas, atrasos e saídas.
- **Accent Pending (#D97706):** Âmbar para pendências e faturas a vencer.
- **Accent Amortize (#2563EB):** Azul real para ações e destaques de amortização antecipada.

## Typography
- **Headings (Plus Jakarta Sans):** Tipografia geométrica elegante para métricas financeiras e títulos.
- **Body & Controls (Inter):** Tipografia altamente legível para listas, tabelas e formulários.

## Layout & Spacing
- **Grid System:** Layout responsivo baseado em container centralizado (`max-w-7xl`).
- **Navegação Móvel (PWA):** Bottom Navigation Bar fixa no rodapé para telas móveis e Sidebar colapsável no desktop.

## Elevation & Depth
- **Bordas Sutis & Sombras:** Uso de bordas Slate (`#E2E8F0`) com sombras suaves (`shadow-sm`, `shadow-md`) em fundos em camadas (`#F8FAFC` -> `#FFFFFF`).

## Do's and Don'ts
- **Do:** Manter contraste legível em badges de status (`PAID`, `PENDING`, `LATE`).
- **Do:** Usar animações e micro-transições suaves (150ms-200ms) ao alternar status de lançamentos.
- **Don't:** Usar cores roxas/violetas genéricas sem contexto financeiro.
