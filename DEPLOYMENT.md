# Guia de Deploy, CI/CD e Rollback — SisConFinWeb

Este guia detalhado explica como configurar a **esteira de CI/CD automatizada** (GitHub Actions + Vercel) e como realizar **rollbacks em 1 clique** caso necessário.

---

## 🛠️ Passo 1: Configurar o Banco de Dados no Supabase

1. Acesse **[supabase.com](https://supabase.com)** e faça login ou crie uma conta gratuita.
2. Clique em **"New Project"** e escolha o nome **SisConFin**.
3. No painel do Supabase, vá em **SQL Editor** no menu lateral.
4. Abra o arquivo de migração do repositório:
   - **[supabase/migrations/20260729000001_initial_schema.sql](supabase/migrations/20260729000001_initial_schema.sql)**
5. Cole o conteúdo no SQL Editor do Supabase e clique em **"Run"**.
6. Em **Project Settings > API**, copie:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🚀 Passo 2: Configurar a Esteira de CI/CD Automatizada (GitHub Actions)

A cada commit ou merge na branch `main` do repositório **[aguiarEdu101/SisConFinWeb](https://github.com/aguiarEdu101/SisConFinWeb)**, o GitHub Actions executa automaticamente:
1. Checagem de tipos TypeScript (`npx tsc --noEmit`)
2. Linter de código (`npm run lint`)
3. Suíte de testes unitários e de integração Vitest (`npm run test`)
4. **Deploy automático em Produção na Vercel** (somente se os testes passarem)

### Secrets Necessárias no GitHub Repository (`Settings > Secrets and variables > Actions`):
Adicione as seguintes 3 variáveis secretas no repositório do GitHub:

| Nome da Secret | Descrição | Onde Obter |
| :--- | :--- | :--- |
| `VERCEL_TOKEN` | Token de Autenticação Pessoal da Vercel | Vercel Account Settings > Tokens |
| `VERCEL_ORG_ID` | ID do seu time / usuário na Vercel | `.vercel/project.json` ou Configurações do Time |
| `VERCEL_PROJECT_ID` | ID do projeto `SisConFinWeb` na Vercel | `.vercel/project.json` ou Vercel Project Settings |

---

## 🔄 Passo 3: Como Executar um Rollback Instantâneo (1-Clique)

Se uma versão implantada apresentar instabilidades em produção, você pode revertê-la instantaneamente sem necessidade de alterar o código-fonte:

### Opção A: Pelo Painel da Vercel (Recomendado)
1. Acesse o painel da Vercel no projeto **`SisConFinWeb`**.
2. Clique na aba **Deployments**.
3. Localize o deployment anterior estável.
4. Clique no menu de 3 pontos (`...`) ao lado do deployment e selecione **"Promote to Production"**. O ambiente é revertido em menos de 5 segundos.

### Opção B: Pelo GitHub Actions (Workflow de Rollback)
1. Acesse o repositório **`aguiarEdu101/SisConFinWeb`** no GitHub.
2. Clique na aba **Actions** e selecione o workflow **"SisConFinWeb Instant Rollback"**.
3. Clique em **"Run workflow"**.
4. Informe o **Deployment ID** ou URL da versão estável anterior da Vercel e clique em **Run workflow**.

---

## 📲 Passo 4: Instalação do PWA no Celular (iOS / Android)

1. **iPhone (Safari):** Abra o site do app, clique no botão de compartilhamento do Safari e selecione **"Adicionar à Tela de Início"**.
2. **Android (Chrome):** Abra o site do app, clique no menu de 3 pontos do Chrome e selecione **"Instalar aplicativo"**.
