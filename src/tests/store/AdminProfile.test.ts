import { describe, it, expect } from 'vitest';
import reducer, { setProfile, resetProfile } from '../../store/reducer/AdminProfile';

const emptyState = {
  _id: '',
  employeeId: '',
  name: '',
  email: '',
  role: 'SUPER_ADMIN' as const,
  technologies: [],
  isActive: false,
  createdAt: '',
  updatedAt: '',
};

const mockPayload = {
  _id: '123',
  employeeId: 'E001',
  name: 'Bob',
  email: 'bob@test.com',
  role: 'ADMIN' as const,
  department: 'Engineering',
  technologies: ['React', 'Node'],
  isActive: true,
  createdAt: '2024-01-01',
  updatedAt: '2024-06-01',
};

describe('AdminProfile reducer', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(emptyState);
  });

  it('setProfile updates all fields', () => {
    const state = reducer(emptyState, setProfile(mockPayload));
    expect(state._id).toBe('123');
    expect(state.name).toBe('Bob');
    expect(state.role).toBe('ADMIN');
    expect(state.isActive).toBe(true);
  });

  it('setProfile sets department', () => {
    const state = reducer(emptyState, setProfile(mockPayload));
    expect(state.department).toBe('Engineering');
  });

  it('resetProfile returns initial state', () => {
    const populated = reducer(emptyState, setProfile(mockPayload));
    const reset = reducer(populated, resetProfile());
    expect(reset).toEqual(emptyState);
  });
});
