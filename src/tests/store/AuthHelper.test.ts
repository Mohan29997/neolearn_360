import { describe, it, expect } from 'vitest';
import reducer, { setIsLogin, setCurrentUser } from '../../store/reducer/AuthHelper';

const initialState = { isLogin: null, currentUser: null };

describe('AuthHelper reducer', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('setIsLogin sets isLogin to true', () => {
    const state = reducer(initialState, setIsLogin({ isLogin: true }));
    expect(state.isLogin).toBe(true);
  });

  it('setIsLogin sets isLogin to false', () => {
    const state = reducer(initialState, setIsLogin({ isLogin: false }));
    expect(state.isLogin).toBe(false);
  });

  it('setCurrentUser sets currentUser', () => {
    const state = reducer(initialState, setCurrentUser({ currentUser: 'user123' }));
    expect(state.currentUser).toBe('user123');
  });

  it('setCurrentUser sets currentUser to null', () => {
    const state = reducer(
      { isLogin: true, currentUser: 'user123' },
      setCurrentUser({ currentUser: null })
    );
    expect(state.currentUser).toBeNull();
  });
});
