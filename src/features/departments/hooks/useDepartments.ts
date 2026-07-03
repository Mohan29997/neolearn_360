import { useState, useEffect, useCallback } from 'react';
import { service } from '../../../service';
import { SnackNotification } from '../../../helper/snackMessage';
import type { IDepartment } from '../../../types/department.types';

const PAGE_SIZE = 10;

function extractDepartments(res: unknown): IDepartment[] {
  const r = res as Record<string, unknown> | undefined;
  const raw = r?.data;
  if (Array.isArray(raw)) return raw as IDepartment[];
  const nested = raw as Record<string, unknown> | undefined;
  return (Array.isArray(nested?.departments) ? nested!.departments : []) as IDepartment[];
}

export const useDepartments = () => {
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editDept, setEditDept] = useState<IDepartment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IDepartment | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [subDeptParent, setSubDeptParent] = useState<IDepartment | null>(null);

  const fetchDepartments = useCallback(() => {
    setLoading(true);
    service
      .getDepartments()
      .then(res => setDepartments(extractDepartments(res)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchDepartments(); }, [fetchDepartments]);

  const filtered = departments.filter(
    d =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.description?.toLowerCase().includes(search.toLowerCase()),
  );

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;

  const openAdd = () => { setEditDept(null); setModalOpen(true); };
  const openEdit = (dept: IDepartment) => { setEditDept(dept); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditDept(null); };

  const onSearchChange = (value: string) => { setSearch(value); setPage(1); };

  const openDelete = (dept: IDepartment) => setDeleteTarget(dept);
  const closeDelete = () => setDeleteTarget(null);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    service
      .deleteDepartment(deleteTarget._id)
      .then(() => {
        SnackNotification('Department deleted', 'success');
        closeDelete();
        fetchDepartments();
      })
      .catch(() => {})
      .finally(() => setDeleteLoading(false));
  };

  return {
    loading,
    filtered,
    paginated,
    totalPages,
    search,
    page,
    modalOpen,
    editDept,
    PAGE_SIZE,
    setPage,
    onSearchChange,
    openAdd,
    openEdit,
    closeModal,
    deleteTarget,
    deleteLoading,
    openDelete,
    closeDelete,
    confirmDelete,
    subDeptParent,
    openSubDepts: (dept: IDepartment) => setSubDeptParent(dept),
    closeSubDepts: () => setSubDeptParent(null),
    refetch: fetchDepartments,
  };
};
