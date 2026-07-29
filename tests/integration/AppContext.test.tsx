import React from 'react';
import { render, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { AppProvider, useApp } from '@/context/AppContext';

function TestGroupComponent() {
  const { 
    userGroupsList, 
    createGroup, 
    deleteGroupSafely 
  } = useApp();

  return (
    <div>
      <span data-testid="group-count">{userGroupsList.length}</span>
      <button 
        data-testid="btn-add-g1" 
        onClick={() => createGroup('Grupo Extra 1')}
      >
        Add Group 1
      </button>
      <button 
        data-testid="btn-add-g2" 
        onClick={() => createGroup('Grupo Extra 2')}
      >
        Add Group 2
      </button>
      <button 
        data-testid="btn-add-g3" 
        onClick={() => createGroup('Grupo Extra 3')}
      >
        Add Group 3
      </button>

      <button 
        data-testid="btn-delete-wrong" 
        onClick={() => deleteGroupSafely(userGroupsList[0]?.id || '', 'NomeErrado')}
      >
        Delete Wrong
      </button>
      <button 
        data-testid="btn-delete-correct" 
        onClick={() => deleteGroupSafely(userGroupsList[0]?.id || '', userGroupsList[0]?.name || '')}
      >
        Delete Correct
      </button>
    </div>
  );
}

describe('RN-01 & Safe Deletion: Limite de 3 Grupos & Exclusão Segura', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve permitir criar até 3 grupos e BLOQUEAR o 4º grupo', () => {
    const { getByTestId } = render(
      <AppProvider>
        <TestGroupComponent />
      </AppProvider>
    );

    // Inicialmente possui 1 grupo
    expect(getByTestId('group-count')).toHaveTextContent('1');

    act(() => {
      getByTestId('btn-add-g1').click();
    });
    expect(getByTestId('group-count')).toHaveTextContent('2');

    act(() => {
      getByTestId('btn-add-g2').click();
    });
    expect(getByTestId('group-count')).toHaveTextContent('3');

    // Tentativa de adicionar o 4º grupo (deve ser ignorado / bloqueado)
    act(() => {
      getByTestId('btn-add-g3').click();
    });
    expect(getByTestId('group-count')).toHaveTextContent('3');
  });

  it('deve RECUSAR a exclusão do grupo caso o texto de confirmação seja incorreto', () => {
    const { getByTestId } = render(
      <AppProvider>
        <TestGroupComponent />
      </AppProvider>
    );

    const initialCount = getByTestId('group-count').textContent;

    act(() => {
      getByTestId('btn-delete-wrong').click();
    });

    // Quantidade permanece inalterada
    expect(getByTestId('group-count')).toHaveTextContent(initialCount || '1');
  });

  it('deve APROVAR a exclusão do grupo quando o texto de confirmação for idêntico', () => {
    const { getByTestId } = render(
      <AppProvider>
        <TestGroupComponent />
      </AppProvider>
    );

    act(() => {
      getByTestId('btn-add-g1').click();
    });
    expect(getByTestId('group-count')).toHaveTextContent('2');

    act(() => {
      getByTestId('btn-delete-correct').click();
    });

    expect(getByTestId('group-count')).toHaveTextContent('1');
  });
});
