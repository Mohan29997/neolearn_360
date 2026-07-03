import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { useDashboard } from '../../../features/dashboard/hooks/useDashboard';
import { ROLE_LABELS, WELCOME_SUBTITLES } from './AdminDashboard.constants';

export const useAdminDashboardPage = () => {
  const { name, role } = useSelector((state: RootState) => state.adminProfile);

  const isSuperAdmin = role === 'SUPER_ADMIN';
  const isAdmin = role === 'ADMIN';
  const isManager = role === 'MANAGER';
  const isEmployee = role === 'EMPLOYEE';

  const roleLabel = ROLE_LABELS[role ?? ''] ?? 'User';
  const welcomeSub = WELCOME_SUBTITLES[role ?? ''] ?? '';

  const dashboardState = useDashboard();

  return {
    name,
    role,
    isSuperAdmin,
    isAdmin,
    isManager,
    isEmployee,
    roleLabel,
    welcomeSub,
    ...dashboardState,
  };
};
