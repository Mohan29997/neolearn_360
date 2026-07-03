import { useEffect, useState, useCallback } from 'react';
import { service } from '../../../service';
import type { IAssignment } from '../../../types/course.types';

const REFRESH_INTERVAL_MS = 30_000;

function extractAssignments(res: Record<string, unknown>): IAssignment[] {
  const data = res?.data as Record<string, unknown> | undefined;
  if (Array.isArray(data?.assignments)) return data!.assignments as IAssignment[];
  if (Array.isArray(res?.assignments)) return res.assignments as IAssignment[];
  if (Array.isArray(data)) return data as IAssignment[];
  return [];
}

export const useEmployeeDashboard = () => {
  const [assignments, setAssignments] = useState<IAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = useCallback(async () => {
    try {
      const res = await service.getAssignedCourses({ page: 1, limit: 90 });
      setAssignments(extractAssignments(res as unknown as Record<string, unknown>));
      setLastUpdated(new Date());
    } catch {
      // keep previous data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchData]);

  const total = assignments.length;
  const completed = assignments.filter(a => a.status === 'completed').length;
  const inProgress = assignments.filter(
    a => a.status === 'in_progress' || a.status === 'assigned',
  ).length;
  const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { assignments, loading, lastUpdated, total, completed, inProgress, completionPct };
};
