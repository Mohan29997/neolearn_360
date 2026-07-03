import type { EditFormKey } from './Users.types';

export const EDIT_FIELDS: Array<{ label: string; key: EditFormKey; placeholder: string; type?: string }> = [
  { label: 'Employee ID', key: 'employeeId', placeholder: 'e.g. NADM001' },
  { label: 'Full Name', key: 'name', placeholder: 'Enter full name' },
  { label: 'Email', key: 'email', placeholder: 'Enter email' },
  { label: 'New Password', key: 'password', placeholder: 'Leave blank to keep unchanged', type: 'password' },
];

export const STATUS_OPTIONS = ['Active', 'Inactive', 'Pending'] as const;

export const TABLE_HEADERS = ['USER DETAILS', 'EMP ID', 'DEPARTMENT', 'SUB-DEPT', 'ROLE', 'VP / DM / MANAGER', 'LOCATION', 'STATUS', 'ACTIONS'] as const;

export const DEFAULT_EDIT_FORM = {
  employeeId: '',
  name: '',
  email: '',
  password: '',
  isActive: true,
} as const;
