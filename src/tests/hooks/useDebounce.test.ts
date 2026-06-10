import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../../hooks/useDebounce';

describe('useDebounce', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('delays function execution', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useDebounce());
    const fn = vi.fn();
    const debounced = result.current.debounce(fn, 300);

    act(() => { debounced(); });
    expect(fn).not.toHaveBeenCalled();

    act(() => { vi.advanceTimersByTime(300); });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('resets the timer on rapid calls', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useDebounce());
    const fn = vi.fn();
    const debounced = result.current.debounce(fn, 300);

    act(() => {
      debounced();
      debounced();
      debounced();
    });

    act(() => { vi.advanceTimersByTime(300); });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('passes arguments to debounced function', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useDebounce());
    const fn = vi.fn();
    const debounced = result.current.debounce(fn, 100);

    act(() => { debounced('hello', 42); });
    act(() => { vi.advanceTimersByTime(100); });

    expect(fn).toHaveBeenCalledWith('hello', 42);
  });

  it('clears timeout on unmount', () => {
    vi.useFakeTimers();
    const { result, unmount } = renderHook(() => useDebounce());
    const fn = vi.fn();
    const debounced = result.current.debounce(fn, 300);

    act(() => { debounced(); });
    unmount();
    act(() => { vi.advanceTimersByTime(300); });

    expect(fn).not.toHaveBeenCalled();
  });
});
