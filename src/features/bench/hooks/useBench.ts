import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { service } from '../../../service';
import { SnackNotification } from '../../../helper/snackMessage';
import type { IEmployee, IUserOption, BenchDisplayStatus } from '../../../types/common.types';
import { BENCH_STATUS_MAP, BENCH_STATUS_DISPLAY_MAP } from '../../../constants/brand.constants';

const PAGE_SIZE = 10;

function mapToEmployee(u: Record<string, unknown>): IEmployee {
  const statusRaw = u.status as string | undefined;
  const displayStatus = (BENCH_STATUS_DISPLAY_MAP[statusRaw ?? ''] ?? 'On Bench') as BenchDisplayStatus;
  return {
    _id: u._id as string,
    name: (u.name as string) || '',
    email: (u.email as string) || '',
    employeeId: (u.employeeId as string) || '',
    role: (u.role as string) || '',
    department: (u.department as string) || '',
    subDepartmentName: (u.subDepartmentName as string) || '',
    managerName: (u.managerName as string) || '—',
    vpName: (u.vpName as string) || '',
    tlName: (u.tlName as string) || '',
    officeLocation: (u.officeLocation as string) || '—',
    techStack: Array.isArray(u.technologies) ? (u.technologies as string[]) : [],
    isActive: (u.isActive as boolean) ?? true,
    status: displayStatus,
    courseStarted: u.course_started === true,
    courseAssigned: (u.course_assigned as string) ?? null,
    managerId: (u.managerId as string) ?? null,
  };
}

function extractList<T>(res: unknown, key: string): T[] {
  const r = res as Record<string, unknown> | undefined;
  const data = r?.data as Record<string, unknown> | undefined;
  if (Array.isArray(data?.[key])) return data![key] as T[];
  if (Array.isArray(r?.[key])) return r![key] as T[];
  if (Array.isArray(data)) return data as T[];
  return [];
}

export const useBench = () => {
  const { role, department: managerDept } = useSelector((state: RootState) => state.adminProfile);
  const isManager = role === 'MANAGER';
  const isLND = managerDept?.toLowerCase().includes('l&d') || managerDept?.toLowerCase().includes('learning');

  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<IUserOption[]>([]);
  const [courseStatusMap, setCourseStatusMap] = useState<Map<string, boolean>>(new Map());

  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [techFilter, setTechFilter] = useState('');
  const [page, setPage] = useState(1);

  const [assignTarget, setAssignTarget] = useState<IEmployee | null>(null);
  const [detailTarget, setDetailTarget] = useState<IEmployee | null>(null);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [mentorSearch, setMentorSearch] = useState('');
  const [preAssessmentScore, setPreAssessmentScore] = useState<number | ''>('');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    service
      .getAssignedCourses({ page: 1, limit: 90 })
      .then(res => {
        const list = extractList<Record<string, unknown>>(res, 'assignments');
        const map = new Map<string, boolean>();
        list.forEach(a => {
          const uid = (a.user_id as Record<string, unknown>)?._id ?? (a.user_id as string);
          if (uid) map.set(uid as string, !!(a.course_started));
        });
        setCourseStatusMap(map);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    service
      .getUsers({ page: 1, limit: 90 })
      .then(res => {
        const list = extractList<Record<string, unknown>>(res, 'users');
        setAllUsers(
          list.map(u => ({
            _id: u._id as string,
            name: (u.name as string) || '',
            role: (u.role as string) || '',
            department: (u.department as string) || '',
          })),
        );
        const mapped = list
          .filter(u => (u.role as string)?.toUpperCase() !== 'MANAGER')
          .map(mapToEmployee);
        setEmployees(
          isManager && managerDept
            ? mapped.filter(
                e => e.department?.trim().toLowerCase() === managerDept.trim().toLowerCase(),
              )
            : mapped,
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isManager, managerDept]);

  const handleStatusChange = (id: string, newStatus: BenchDisplayStatus) => {
    setEmployees(prev => prev.map(e => (e._id === id ? { ...e, status: newStatus } : e)));
    service
      .updateUserStatus(id, BENCH_STATUS_MAP[newStatus] ?? newStatus.toLowerCase().replace(' ', '_'))
      .catch(() => {
        setEmployees(prev => prev.map(e => (e._id === id ? { ...e, status: e.status } : e)));
      });
  };

  const openAssign = (emp: IEmployee) => {
    setAssignTarget(emp);
    setSelectedMentor('');
    setMentorSearch('');
    setPreAssessmentScore('');
  };

  const closeAssign = () => {
    setAssignTarget(null);
    setSelectedMentor('');
    setMentorSearch('');
    setPreAssessmentScore('');
  };

  const handleAssign = async () => {
    if (!assignTarget || !selectedMentor || preAssessmentScore === '') return;
    setAssigning(true);
    try {
      const res = await service.assignCourse({
        mentor_id: selectedMentor,
        user_id: assignTarget._id,
        pre_assessment_score: Number(preAssessmentScore),
      });
      const r = res as Record<string, unknown>;
      if (r?.success === false) {
        SnackNotification((r?.message as string) || 'Already assigned', 'warning');
        setCourseStatusMap(prev => new Map(prev).set(assignTarget._id, false));
      } else {
        SnackNotification((r?.message as string) || 'Course assigned successfully', 'success');
        setCourseStatusMap(prev => new Map(prev).set(assignTarget._id, false));
        setEmployees(prev =>
          prev.map(e => (e._id === assignTarget._id ? { ...e, courseAssigned: 'assigned' } : e)),
        );
        closeAssign();
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = e?.response?.data?.message || e?.message || 'Failed to assign course';
      const isAlreadyAssigned = msg.toLowerCase().includes('already assigned');
      if (isAlreadyAssigned) {
        setEmployees(prev =>
          prev.map(e => (e._id === assignTarget._id ? { ...e, courseAssigned: 'assigned' } : e)),
        );
      }
      SnackNotification(msg, isAlreadyAssigned ? 'warning' : 'error');
    } finally {
      setAssigning(false);
    }
  };

  const ROLE_ORDER: Record<string, number> = { MANAGER: 0, DM: 1, TL: 2, USER: 3 };
  const roleRank = (r: string) => ROLE_ORDER[r?.toUpperCase()] ?? 3;

  const filtered = employees.filter(
    e =>
      (!deptFilter || e.department === deptFilter) &&
      (!statusFilter || e.status === statusFilter) &&
      (!techFilter || e.techStack.some(t => t.toLowerCase().includes(techFilter.toLowerCase()))),
  );

  const grouped: { subDept: string; members: IEmployee[] }[] = [];
  const subDeptMap = new Map<string, IEmployee[]>();
  filtered.forEach(e => {
    const key = e.subDepartmentName || e.department || 'General';
    if (!subDeptMap.has(key)) subDeptMap.set(key, []);
    subDeptMap.get(key)!.push(e);
  });
  subDeptMap.forEach((members, subDept) => {
    grouped.push({
      subDept,
      members: [...members].sort((a, b) => roleRank(a.role) - roleRank(b.role)),
    });
  });
  grouped.sort((a, b) => a.subDept.localeCompare(b.subDept));

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const departments = [...new Set(employees.map(e => e.department))];

  const totalCount = employees.length;
  const onBenchCount = employees.filter(e => e.status === 'On Bench').length;
  const shadowingCount = employees.filter(e => e.status === 'Shadowing').length;
  const onProjectCount = employees.filter(e => e.status === 'On Project').length;

  return {
    loading,
    isManager,
    isLND,
    employees,
    allUsers,
    courseStatusMap,
    filtered,
    grouped,
    paginated,
    totalPages,
    departments,
    totalCount,
    onBenchCount,
    shadowingCount,
    onProjectCount,
    deptFilter,
    statusFilter,
    techFilter,
    page,
    assignTarget,
    selectedMentor,
    mentorSearch,
    preAssessmentScore,
    assigning,
    PAGE_SIZE,
    setPage,
    setDeptFilter,
    setStatusFilter,
    setTechFilter,
    setSelectedMentor,
    setMentorSearch,
    setPreAssessmentScore,
    handleStatusChange,
    openAssign,
    closeAssign,
    handleAssign,
    detailTarget,
    setDetailTarget,
  };
};
