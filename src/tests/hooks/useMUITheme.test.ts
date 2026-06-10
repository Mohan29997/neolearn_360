import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';
import { useMUITheme } from '../../hooks/useMUITheme';
import React from 'react';

const theme = createTheme();
const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(ThemeProvider, { theme }, children);

describe('useMUITheme', () => {
  it('returns the MUI theme object', () => {
    const { result } = renderHook(() => useMUITheme(), { wrapper });
    expect(result.current).toBeDefined();
    expect(result.current.palette).toBeDefined();
  });
});
