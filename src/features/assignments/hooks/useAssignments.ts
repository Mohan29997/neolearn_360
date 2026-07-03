import { useState, useEffect, useCallback } from 'react';
import { service } from '../../../service';
import { SnackNotification } from '../../../helper/snackMessage';
import type { IAssignment } from '../../../types/course.types';
import type { IUser } from '../../../types/auth.types';
import type { ICourse } from '../../../types/course.types';

function extractAssignments(res: unknown): { list: IAssignment[]; total: number } {
  const r = res as Record<string, unknown> | undefined;
  const data = r?.data as Record<string, unknown> | undefined;
  let list: IAssignment[] = [];
  if (Array.isArray(data?.assignments)) list = data!.assignments as IAssignment[];
  else if (Array.isArray((data?.data as Record<string, unknown>)?.assignments)) {
    list = (data!.data as Record<string, unknown>).assignments as IAssignment[];
  } else if (Array.isArray(data?.data)) list = data!.data as IAssignment[];
  else if (Array.isArray(data?.courses)) list = data!.courses as IAssignment[];
  else if (Array.isArray(data)) list = data as IAssignment[];
  const total =
    (data?.pagination as Record<string, unknown>)?.total as number ??
    (data?.total as number) ??
    list.length;
  return { list, total };
}

export const useAssignments = () => {
  const [assignedCourses, setAssignedCourses] = useState<IAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  const [users, setUsers] = useState<IUser[]>([]);
  const [coursesList, setCoursesList] = useState<ICourse[]>([]);

  const [formUser, setFormUser] = useState('');
  const [formUserLabel, setFormUserLabel] = useState('');
  const [formCourse, setFormCourse] = useState('');
  const [formCourseLabel, setFormCourseLabel] = useState('');
  const [formCoordinator, setFormCoordinator] = useState('');

  const fetchAssignedCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await service.getAssignedCourses({ page: page + 1, limit: rowsPerPage });
      const { list, total } = extractAssignments(res);
      setAssignedCourses(list);
      setTotalCount(total);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => { fetchAssignedCourses(); }, [fetchAssignedCourses]);

  const fetchFormData = async () => {
    try {
      const [uRes, cRes] = await Promise.all([
        service.getUsers({ page: 1, limit: 90 }),
        service.getCourses(1, 100),
      ]);
      const uData = (uRes as Record<string, unknown>)?.data as Record<string, unknown> | undefined;
      if (Array.isArray(uData?.users)) setUsers(uData!.users as IUser[]);

      const cData = (cRes as Record<string, unknown>)?.data as Record<string, unknown> | undefined;
      if (Array.isArray(cData?.courses)) setCoursesList(cData!.courses as ICourse[]);
      else if (Array.isArray(cData)) setCoursesList(cData as ICourse[]);
    } catch {
      // best effort
    }
  };

  const openAssignRow = (item: IAssignment) => {
    const userId = typeof item.user_id === 'string' ? item.user_id : '';
    setFormUser(userId);
    setFormUserLabel(item.user_name || item.user_email || '');
    const courseId = typeof item.course_id === 'string' ? item.course_id : '';
    setFormCourse(courseId);
    setFormCourseLabel(item.course_title || '');
    setFormCoordinator('');
    setAssignModalOpen(true);
    fetchFormData();
  };

  const handleAssignCourse = async () => {
    if (!formUser || !formCourse || !formCoordinator) {
      SnackNotification('Please select course and coordinator', 'error');
      return;
    }
    setIsAssigning(true);
    try {
      await service.updateAssignedCourse({
        user_id: formUser,
        coordinator_id: formCoordinator,
        course_id: formCourse,
      });
      SnackNotification('Course assigned successfully', 'success');
      setAssignModalOpen(false);
      setFormUser('');
      setFormUserLabel('');
      setFormCourse('');
      setFormCourseLabel('');
      setFormCoordinator('');
      fetchAssignedCourses();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      SnackNotification(e?.response?.data?.message || 'Failed to assign course', 'error');
    } finally {
      setIsAssigning(false);
    }
  };

  const handlePageChange = (_: unknown, newPage: number) => setPage(newPage);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return {
    assignedCourses,
    loading,
    page,
    rowsPerPage,
    totalCount,
    assignModalOpen,
    isAssigning,
    users,
    coursesList,
    formUser,
    formUserLabel,
    formCourse,
    formCourseLabel,
    formCoordinator,
    setAssignModalOpen,
    setFormUser,
    setFormUserLabel,
    setFormCourse,
    setFormCourseLabel,
    setFormCoordinator,
    openAssignRow,
    handleAssignCourse,
    handlePageChange,
    handleRowsPerPageChange,
  };
};
