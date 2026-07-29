# Guia de Deploy e Inicialização dos Seus Dados — SisConFin

Este guia passo a passo explica como publicar o **SisConFin** na **Vercel** e conectá-lo ao seu banco de dados no **Supabase** para começar a cadastrar as suas finanças reais.

---

## 🛠️ Passo 1: Configurar o Banco de Dados no Supabase

1. Acesse **[supabase.com](https://supabase.com)** e faça login ou crie uma conta gratuita.
2. Clique em **"New Project"** e escolha o nome **SisConFin**.
3. No painel do Supabase, vá em **SQL Editor** no menu lateral.
4. Abra o arquivo de migração do repositório:
   - **[supabase/migrations/20260729000001_initial_schema.sql](supabase/migrations/20260729000001_initial_schema.sql)**
5. Cole o conteúdo do arquivo no SQL Editor do Supabase e clique em **"Run"**.
   - *Isso criará as 8 tabelas do sistema (`profiles`, `groups`, `user_groups`, `transactions`, `commitments`, `installments`, `credit_cards`, `card_statements`) com políticas RLS de segurança por grupo.*
6. Vá em **Project Settings > API** e copie:
   - **Project URL** (ex: `https://xxxx.supabase.co`)
   - **anon / public key** (ex: `eyJhbGciOi...`)

---

## 🚀 Passo 2: Publicar na Vercel

### Opção A: Via GitHub + Painel Vercel (Recomendado)
1. Suba este repositório para o seu **GitHub** (ex: `seu-usuario/SisConFinWeb`).
2. Acesse **[vercel.com](https://vercel.com)** e clique em **"Add New... > Project"**.
3. Importe o repositório **SisConFinWeb**.
4. Na seção **Environment Variables**, adicione as duas variáveis do Supabase:
   - `NEXT_PUBLIC_SUPABASE_URL` = (Sua Project URL do Supabase)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (Sua anon key do Supabase)
5. Clique em **"Deploy"**. Em menos de 1 minuto seu link estará no ar (ex: `https://sisconfinweb.vercel.app`).

---

## 📲 Passo 3: Começar com os Seus Dados & Instalar o PWA

1. Acesse o link publicado no seu celular ou navegador.
2. Faça seu cadastro e crie o seu **Grupo Financeiro Familiar** no onboarding (US01.1).
3. **No Celular (iOS / Android):**
   - **iPhone (Safari):** Clique no botão de compartilhamento do Safari e escolha **"Adicionar à Tela de Início"**.
   - **Android (Chrome):** Clique no menu de 3 pontos do Chrome e selecione **"Instalar aplicativo"**.
4. Convide sua parceira/família na aba **Grupo & Export** informando o e-mail deles.
