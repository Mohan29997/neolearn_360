import { describe, it, expect } from 'vitest';
import { userType, userTypeArray, statusArray } from '../../constants/usertype';

describe('userType', () => {
  it('has admin key', () => expect(userType.admin).toBe('admin'));
  it('has superadmin key', () => expect(userType.superadmin).toBe('superadmin'));
  it('has volunteer key', () => expect(userType.volunteer).toBe('volunteer'));
  it('has patient key', () => expect(userType.patient).toBe('patient'));
});

describe('userTypeArray', () => {
  it('contains 3 entries', () => expect(userTypeArray).toHaveLength(3));
  it('includes patient entry', () => {
    expect(userTypeArray.find((u) => u.value === 'patient')).toBeDefined();
  });
  it('includes admin entry', () => {
    expect(userTypeArray.find((u) => u.value === 'admin')).toBeDefined();
  });
});

describe('statusArray', () => {
  it('contains 5 statuses', () => expect(statusArray).toHaveLength(5));
  const expected = ['pending', 'accepted', 'fulfilled', 'cancelled', 'expired'];
  expected.forEach((val) => {
    it(`includes ${val}`, () => {
      expect(statusArray.find((s) => s.value === val)).toBeDefined();
    });
  });
});
