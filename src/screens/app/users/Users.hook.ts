import { useState } from 'react';
import { useUsers as useUsersFeature } from '../../../features/users/hooks/useUsers';
import { handleEditSubmit as submitEdit, handleExport as exportCsv } from './Users.handlers';
import { service } from '../../../service';
import { SnackNotification } from '../../../helper/snackMessage';
import type { IUser } from '../../../types/auth.types';
import type { EditForm } from './Users.types';
import { DEFAULT_EDIT_FORM } from './Users.constants';

export const useUsersPage = () => {
  const feature = useUsersFeature();

  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<IUser | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ ...DEFAULT_EDIT_FORM });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<IUser | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const openEdit = (user: IUser) => {
    setEditUser(user);
    setEditForm({
      employeeId: user.employeeId ?? '',
      name: user.name ?? '',
      email: user.email ?? '',
      password: '',
      isActive: user.isActive,
    });
  };

  const handleEdit = () => {
    if (!editUser) return;
    void submitEdit({
      editUser,
      editForm,
      setEditSubmitting,
      setEditUser,
      refetch: feature.refetch,
    });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await service.deleteAdminUser(deleteTarget._id);
      SnackNotification('User deleted successfully', 'success');
      setDeleteTarget(null);
      feature.refetch();
    } catch { /* handled by interceptor */ } finally {
      setDeleteLoading(false);
    }
  };

  const clearFilters = () => {
    feature.setDeptFilter('');
    feature.setRoleFilter('');
    feature.setStatusFilter('');
    feature.handleSearchChange('');
  };

  const handleExport = () => exportCsv(feature.filtered);

  return {
    ...feature,
    modalOpen,
    setModalOpen,
    editUser,
    setEditUser,
    editForm,
    setEditForm,
    editSubmitting,
    openEdit,
    handleEdit,
    deleteTarget,
    setDeleteTarget,
    deleteLoading,
    confirmDelete,
    clearFilters,
    handleExport,
  };
};
