# Plano de Implementação — Esteira de CI/CD e Rollback Automatizado (GitHub Actions + Vercel)

> **Projeto:** Gestão Financeira Pessoal e Familiar (SisConFinWeb)  
> **Repositório:** [aguiarEdu101/SisConFinWeb](https://github.com/aguiarEdu101/SisConFinWeb)  
> **Gatilho:** Push / Merge na branch `main`  
> **Plataformas:** GitHub Actions + Vercel CLI / Deploy Hooks  
> **Status:** Concluído  
> **Data:** 2026-07-29  

---

## Esteira CI/CD Implementada

```
Push / Merge na branch `main`
          │
          ▼
GitHub Actions (CI Engine)
  ├── 1. Type Check (`npx tsc --noEmit`)
  ├── 2. Lint Check (`npm run lint`)
  └── 3. Testes Unitários & Integração Vitest (`npm run test`)
          │
          ├── (Se FALHAR 🔴) ──> Interrompe o deploy imediatamente
          │
          └── (Se PASSAR 🟢)
                  │
                  ▼
Vercel Production Deploy (CD Engine)
  └── Publica a nova versão automaticamente no ar
                  │
                  ▼ (Se precisar reverter)
Rollback em 1-Clique (Workflow Dispatch)
  └── Promove o build anterior estável em segundos (`vercel promote`)
```
