import ExcelJS from 'exceljs';
import { Transaction, Commitment, CreditCard } from '@/types';

/**
 * US05.1 (Exportação Multi-formato Excel .xlsx Direct Download)
 * Gera e dispara o download do arquivo .xlsx com abas formatadas.
 */
export async function downloadFinancialReport(
  groupName: string,
  transactions: Transaction[],
  commitments: Commitment[],
  creditCards: CreditCard[]
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'SisConFin';
  workbook.created = new Date();

  // Aba 1: Lançamentos Diários
  const sheetTx = workbook.addWorksheet('Lançamentos Diários');
  sheetTx.columns = [
    { header: 'Data Ref.', key: 'ref_date', width: 14 },
    { header: 'Descrição', key: 'description', width: 30 },
    { header: 'Tipo', key: 'type', width: 12 },
    { header: 'Categoria', key: 'category', width: 18 },
    { header: 'Valor (R$)', key: 'amount', width: 16 },
    { header: 'Status', key: 'status', width: 12 },
  ];

  transactions.forEach(t => {
    sheetTx.addRow({
      ref_date: t.ref_date,
      description: t.description,
      type: t.type === 'INCOME' ? 'Receita' : 'Despesa',
      category: t.category,
      amount: Number(t.amount),
      status: t.status === 'PAID' ? 'Pago' : t.status === 'PENDING' ? 'Pendente' : 'Atrasado'
    });
  });

  // Aba 2: Financiamentos e Compromissos
  const sheetCommitments = workbook.addWorksheet('Financiamentos');
  sheetCommitments.columns = [
    { header: 'Compromisso', key: 'title', width: 28 },
    { header: 'Tipo', key: 'type', width: 16 },
    { header: 'Total (R$)', key: 'total_amount', width: 16 },
    { header: 'Qtd Parcelas', key: 'total_installments', width: 14 },
    { header: 'Data Início', key: 'start_date', width: 14 },
  ];

  commitments.forEach(c => {
    sheetCommitments.addRow({
      title: c.title,
      type: c.type,
      total_amount: Number(c.total_amount),
      total_installments: c.total_installments,
      start_date: c.start_date
    });
  });

  // Aba 3: Cartões de Crédito
  const sheetCards = workbook.addWorksheet('Cartões de Crédito');
  sheetCards.columns = [
    { header: 'Cartão', key: 'card_name', width: 22 },
    { header: 'Dia Fechamento', key: 'closing_day', width: 16 },
    { header: 'Dia Vencimento', key: 'due_day', width: 16 },
    { header: 'Limite Mensal (R$)', key: 'monthly_limit', width: 20 },
  ];

  creditCards.forEach(card => {
    sheetCards.addRow({
      card_name: card.card_name,
      closing_day: card.closing_day,
      due_day: card.due_day,
      monthly_limit: Number(card.monthly_limit)
    });
  });

  // Estilização simples dos cabeçalhos
  [sheetTx, sheetCommitments, sheetCards].forEach(sheet => {
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '0F172A' }
    };
  });

  // Gera o buffer e dispara o download no navegador
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `SisConFin_${groupName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  anchor.click();
  window.URL.revokeObjectURL(url);
}
