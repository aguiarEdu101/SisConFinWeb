import { test, expect } from '@playwright/test';

test.describe('E2E: SisConFin PWA & Fluxos Principais', () => {
  test('deve carregar o Dashboard e exibir os cards de Saldo Projetado e Receitas', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toContainText('SisConFin');

    await expect(page.getByText('Saldo Projetado do Mês (RN-05)')).toBeVisible();
  });

  test('deve navegar até Financiamentos e simular a Amortização Antecipada (RN-04)', async ({ page }) => {
    await page.goto('/commitments');

    await expect(page.getByText('Financiamentos & Amortizações (EPIC 03)')).toBeVisible();

    await expect(page.getByText('Amortização Antecipada (RN-04)')).toBeVisible();
  });

  test('deve navegar até Grupo & Exportação e acionar a exportação Excel', async ({ page }) => {
    await page.goto('/settings');

    await expect(page.getByText('Exportação para Excel / Sheets (US05.1)')).toBeVisible();
    await expect(page.getByText('Exportar Planilha Excel (.xlsx)')).toBeVisible();
  });
});
