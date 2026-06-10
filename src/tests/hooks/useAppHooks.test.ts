import { describe, it, expect } from 'vitest';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../store';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Provider, { store }, children);

describe('useAppDispatch', () => {
  it('returns a dispatch function', () => {
    const { result } = renderHook(() => useAppDispatch(), { wrapper });
    expect(typeof result.current).toBe('function');
  });
});

describe('useAppSelector', () => {
  it('can select from the store', () => {
    const { result } = renderHook(
      () => useAppSelector((state) => state.authHelper.isLogin),
      { wrapper }
    );
    expect(result.current).toBeNull();
  });
});
