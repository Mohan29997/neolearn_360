import { service } from '../../../service';
import type { IUser } from '../../../types/auth.types';
import type { EditForm } from './Users.types';

export interface EditSubmitDeps {
  editUser: IUser;
  editForm: EditForm;
  setEditSubmitting: (v: boolean) => void;
  setEditUser: (u: IUser | null) => void;
  refetch: () => void;
}

export const handleEditSubmit = async ({
  editUser,
  editForm,
  setEditSubmitting,
  setEditUser,
  refetch,
}: EditSubmitDeps): Promise<void> => {
  if (!editForm.name || !editForm.email) return;
  setEditSubmitting(true);
  const payload: Record<string, unknown> = {
    employeeId: editForm.employeeId,
    name: editForm.name,
    email: editForm.email,
    isActive: editForm.isActive,
  };
  if (editForm.password) payload.password = editForm.password;
  try {
    await service.updateAdminUser(
      editUser._id,
      payload as Parameters<typeof service.updateAdminUser>[1],
    );
    setEditUser(null);
    refetch();
  } finally {
    setEditSubmitting(false);
  }
};

export const handleExport = (filtered: IUser[]): void => {
  const rows = [
    ['Employee ID', 'Name', 'Email', 'Role', 'Department', 'Office Location', 'Status'],
    ...filtered.map(u => [
      u.employeeId ?? '',
      u.name ?? '',
      u.email ?? '',
      u.role ?? '',
      u.department ?? '',
      u.officeLocation ?? '',
      u.isActive ? 'Active' : 'Inactive',
    ]),
  ];
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `users_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
