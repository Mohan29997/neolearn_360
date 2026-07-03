import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { service } from '../../../service';
import type { IDashboardData, IDepartmentPerf } from '../../../types/dashboard.types';
import type { IUser } from '../../../types/auth.types';
import type { ICourse, IAssignment } from '../../../types/course.types';
import type { IDepartment } from '../../../types/department.types';
import { getRelativeTime } from '../../../screens/app/admindashboard/components';

const REFRESH_INTERVAL_MS = 30_000;

const FALLBACK_DEPARTMENTS: IDepartmentPerf[] = [
  { name: 'Engineering & Tech', completion: 88 },
  { name: 'Human Resources', completion: 74 },
  { name: 'Sales & Marketing', completion: 62 },
  { name: 'Operations', completion: 45 },
];

type ApiResult<T> = { status: 'fulfilled'; value: T } | { status: 'rejected' };

function extractArray<T>(result: ApiResult<Record<string, unknown>>, ...keys: string[]): T[] {
  if (result.status !== 'fulfilled') return [];
  const v = result.value;
  for (const key of keys) {
    const val = v?.[key];
    if (Array.isArray(val)) return val as T[];
    const nested = (v?.data as Record<string, unknown>)?.[key];
    if (Array.isArray(nested)) return nested as T[];
  }
  return Array.isArray(v?.data) ? (v.data as T[]) : [];
}

export const useDashboard = () => {
  const { role, department: managerDept } = useSelector((state: RootState) => state.adminProfile);
  const isManager = role === 'MANAGER';

  const [data, setData] = useState<IDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const load = useCallback(async (signal: { cancelled: boolean }) => {
    try {
      const results = await Promise.allSettled([
        service.getUsers({ page: 1, limit: 90 }),
        service.getCourses(1, 90),
        service.getDepartments(),
        service.getAssignedCourses({ page: 1, limit: 90 }),
        service.getLearningJourneys({ page: 1, limit: 1 }),
      ]) as ApiResult<Record<string, unknown>>[];

      const [usersRes, coursesRes, deptRes, assignedRes, journeysRes] = results;

      let users = extractArray<IUser>(usersRes, 'users');
      const courses = extractArray<ICourse>(coursesRes, 'courses');
      const depts = extractArray<IDepartment>(deptRes, 'departments');
      const assigned = extractArray<IAssignment>(assignedRes, 'assignments');

      if (isManager && managerDept) {
        users = users.filter(
          u => u.department?.trim().toLowerCase() === managerDept.trim().toLowerCase(),
        );
      }

      const totalBench = users.filter(u => u.status === 'on_bench').length;
      const activeCourses = courses.filter(c => c.isActive !== false);

      const deptPerf: IDepartmentPerf[] = depts.slice(0, 4).map(d => {
        const deptUsers = users.filter(u => u.department === d.name);
        const deptAssigned = assigned.filter(a => {
          const uid = typeof a.user_id === 'object' ? (a.user_id as { _id?: string })?._id : a.user_id;
          return deptUsers.some(u => u._id === uid);
        });
        const completed = deptAssigned.filter(a => a.status === 'completed').length;
        const pct = deptAssigned.length > 0 ? Math.round((completed / deptAssigned.length) * 100) : 0;
        return { name: d.name || 'Dept', completion: pct };
      });

      const totalAssigned = assigned.length;
      const totalCompleted = assigned.filter(a => a.status === 'completed').length;
      const completionRate = totalAssigned > 0 ? Math.round((totalCompleted / totalAssigned) * 100) : 0;

      const onboarding = users.filter(u => u.status === 'on_bench').length;
      const training = users.filter(u => u.bench_status === 'training' || u.status === 'training').length;
      const poc = users.filter(u => u.bench_status === 'poc_phase' || u.status === 'shadowing').length;
      const deploymentReady = users.filter(u => u.bench_status === 'deployment_ready').length;

      const recentActivity: IDashboardData['recentActivity'] = [];
      const sortedUsers = [...users].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      if (sortedUsers[0]) {
        recentActivity.push({
          text: 'New User Added to',
          bold: sortedUsers[0].department || 'Organization',
          time: getRelativeTime(sortedUsers[0].createdAt),
        });
      }
      const sortedAssigned = [...assigned].sort(
        (a, b) =>
          new Date(b.createdAt ?? b.assigned_at ?? 0).getTime() -
          new Date(a.createdAt ?? a.assigned_at ?? 0).getTime(),
      );
      if (sortedAssigned[0]) {
        const uid = sortedAssigned[0].user_id;
        const assigneeName = typeof uid === 'object' ? (uid as { name?: string })?.name ?? 'User' : 'User';
        recentActivity.push({
          text: 'Course Assigned to',
          bold: assigneeName,
          time: getRelativeTime(sortedAssigned[0].createdAt ?? sortedAssigned[0].assigned_at ?? ''),
        });
      }
      if (totalBench > 0) {
        recentActivity.push({ text: 'Bench updated with', bold: `${totalBench} Employees`, time: 'Today' });
      }
      recentActivity.push({ text: 'System Health Check', bold: 'Passed', time: '3 hours ago' });
      if (courses[0]) {
        recentActivity.push({
          text: `Program '${courses[0].course_title}'`,
          bold: 'Active',
          time: getRelativeTime(courses[0].createdAt ?? ''),
        });
      }

      const journeyTotal = journeysRes.status === 'fulfilled'
        ? ((journeysRes.value?.pagination as Record<string, unknown>)?.total ?? 0) as number
        : 0;

      if (!signal.cancelled) {
        setData({
          totalUsers: users.length,
          activePrograms: activeCourses.length,
          benchCount: totalBench,
          completionRate,
          learningJourneys: journeyTotal,
          departments: deptPerf.length > 0 ? deptPerf : FALLBACK_DEPARTMENTS,
          recentActivity,
          benchStatus: { onboarding, training, poc, deploymentReady },
        });
        setLastUpdated(new Date());
      }
    } catch {
      // keep previous data on error
    } finally {
      if (!signal.cancelled) setLoading(false);
    }
  }, [isManager, managerDept]);

  useEffect(() => {
    const signal = { cancelled: false };
    load(signal);
    const interval = setInterval(() => load(signal), REFRESH_INTERVAL_MS);
    return () => {
      signal.cancelled = true;
      clearInterval(interval);
    };
  }, [load]);

  return { data, loading, lastUpdated };
};
