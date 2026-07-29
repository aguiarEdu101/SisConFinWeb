import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AppProvider, useApp } from '@/context/AppContext';

function TestConsumerComponent() {
  const { 
    currentRole, 
    switchUserRole, 
    transactions, 
    toggleTransactionStatus, 
    inviteMember, 
    userGroups 
  } = useApp();

  return (
    <div>
      <span data-testid="role">{currentRole}</span>
      <span data-testid="tx-count">{transactions.length}</span>
      <span data-testid="first-tx-status">{transactions[0]?.status}</span>
      <span data-testid="member-count">{userGroups.length}</span>

      <button data-testid="btn-switch" onClick={() => switchUserRole('BASIC')}>Switch to Basic</button>
      <button data-testid="btn-toggle-tx" onClick={() => toggleTransactionStatus(transactions[0]?.id)}>Toggle Status</button>
      <button data-testid="btn-invite" onClick={() => inviteMember('novo@familia.com', 'BASIC')}>Invite Member</button>
    </div>
  );
}

describe('AppContext Integration & RBAC Protection (RN-03)', () => {
  it('deve permitir alterar o papel do usuário entre ADMIN e BASIC', () => {
    render(
      <AppProvider>
        <TestConsumerComponent />
      </AppProvider>
    );

    expect(screen.getByTestId('role')).toHaveTextContent('ADMIN');

    act(() => {
      screen.getByTestId('btn-switch').click();
    });

    expect(screen.getByTestId('role')).toHaveTextContent('BASIC');
  });

  it('deve alternar em 1 toque o status de um lançamento entre PAID e PENDING', () => {
    render(
      <AppProvider>
        <TestConsumerComponent />
      </AppProvider>
    );

    const initialStatus = screen.getByTestId('first-tx-status').textContent;

    act(() => {
      screen.getByTestId('btn-toggle-tx').click();
    });

    const newStatus = screen.getByTestId('first-tx-status').textContent;
    expect(newStatus).not.toEqual(initialStatus);
  });

  it('RN-03: Não deve permitir convidar membros quando o perfil for BASIC', () => {
    render(
      <AppProvider>
        <TestConsumerComponent />
      </AppProvider>
    );

    const initialMembers = parseInt(screen.getByTestId('member-count').textContent || '0', 10);

    act(() => {
      screen.getByTestId('btn-switch').click();
    });

    act(() => {
      screen.getByTestId('btn-invite').click();
    });

    expect(screen.getByTestId('member-count')).toHaveTextContent(initialMembers.toString());
  });
});
