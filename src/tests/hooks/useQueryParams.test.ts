import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useQueryParams } from '../../hooks/useQueryParams';
import React from 'react';

function wrapper(search: string) {
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(
      MemoryRouter,
      { initialEntries: [`/${search}`] },
      React.createElement(Routes, null,
        React.createElement(Route, { path: '/', element: children })
      )
    );
}

describe('useQueryParams', () => {
  it('returns empty object when no params', () => {
    const { result } = renderHook(() => useQueryParams(), { wrapper: wrapper('') });
    expect(result.current).toEqual({});
  });

  it('parses single query param', () => {
    const { result } = renderHook(() => useQueryParams(), {
      wrapper: wrapper('?page=1'),
    });
    expect(result.current).toEqual({ page: '1' });
  });

  it('parses multiple query params', () => {
    const { result } = renderHook(() => useQueryParams(), {
      wrapper: wrapper('?page=2&limit=10'),
    });
    expect(result.current.page).toBe('2');
    expect(result.current.limit).toBe('10');
  });
});
