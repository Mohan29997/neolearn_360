import { useState, useEffect, useRef, useMemo } from 'react';
import { service } from '../../../service';
import type { IUser } from '../../../types/auth.types';

const PAGE_SIZE = 20;
const DEBOUNCE_MS = 400;

function extractUsers(res: unknown): IUser[] {
  const r = res as Record<string, unknown> | undefined;
  const data = r?.data as Record<string, unknown> | undefined;
  if (Array.isArray(data?.users)) return data!.users as IUser[];
  if (Array.isArray(r?.users)) return r!.users as IUser[];
  if (Array.isArray(data)) return data as IUser[];
  return [];
}

export const useUsers = () => {
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef('');

  const fetchUsers = (searchVal: string) => {
    setLoading(true);
    const params: { page: number; limit: number; search?: string } = { page: 1, limit: 90 };
    if (searchVal) params.search = searchVal;
    service
      .getUsers(params)
      .then(res => setAllUsers(extractUsers(res)))
      .catch(() => setAllUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers('');
    service
      .getRoles()
      .then(res => setRoles(Array.isArray(res) ? (res as string[]) : []))
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { setPage(1); }, [deptFilter, roleFilter, statusFilter]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
    searchRef.current = value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchUsers(value), DEBOUNCE_MS);
  };

  const filtered = useMemo(
    () =>
      allUsers.filter(u => {
        const statusLabel = u.isActive ? 'Active' : 'Inactive';
        return (
          (!deptFilter || u.department === deptFilter) &&
          (!roleFilter || u.role === roleFilter) &&
          (!statusFilter || statusLabel === statusFilter)
        );
      }),
    [allUsers, deptFilter, roleFilter, statusFilter],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageUsers = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const deptOptions = useMemo(
    () => [...new Set(allUsers.map(u => u.department).filter(Boolean))] as string[],
    [allUsers],
  );
  const roleOptions = useMemo(
    () =>
      roles.length
        ? roles
        : ([...new Set(allUsers.map(u => u.role).filter(Boolean))] as string[]),
    [roles, allUsers],
  );

  const refetch = () => fetchUsers(searchRef.current);

  return {
    allUsers,
    loading,
    search,
    deptFilter,
    roleFilter,
    statusFilter,
    page,
    filtered,
    pageUsers,
    totalPages,
    deptOptions,
    roleOptions,
    searchRef,
    PAGE_SIZE,
    setPage,
    setDeptFilter,
    setRoleFilter,
    setStatusFilter,
    handleSearchChange,
    refetch,
  };
};
