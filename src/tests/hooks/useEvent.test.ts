import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEvent } from '../../shared/hooks/useEvent';

describe('useEvent', () => {
  it('calls the latest callback when invoked', () => {
    const fn = vi.fn(() => 'result');
    const { result } = renderHook(() => useEvent(fn));

    let returnValue: any;
    act(() => { returnValue = result.current('arg1'); });

    expect(fn).toHaveBeenCalledWith('arg1');
    expect(returnValue).toBe('result');
  });

  it('always calls the latest version of the callback', () => {
    let count = 0;
    const { result, rerender } = renderHook(({ cb }) => useEvent(cb), {
      initialProps: { cb: () => ++count },
    });

    act(() => { result.current(); });
    expect(count).toBe(1);

    rerender({ cb: () => (count += 10) });
    act(() => { result.current(); });
    expect(count).toBe(11);
  });

  it('throws when callback is undefined', () => {
    const { result } = renderHook(() => useEvent(undefined));
    expect(() => result.current()).toThrow('Cannot call an event handler while rendering.');
  });
});
