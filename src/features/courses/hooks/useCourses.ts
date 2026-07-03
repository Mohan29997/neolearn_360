import { useState, useEffect, useCallback } from 'react';
import { service } from '../../../service';
import type { ICourse } from '../../../types/course.types';

function extractCourses(res: unknown): { list: ICourse[]; total: number } {
  const r = res as Record<string, unknown> | undefined;
  const data = r?.data as Record<string, unknown> | undefined;
  const list: ICourse[] = Array.isArray(data?.courses)
    ? (data!.courses as ICourse[])
    : Array.isArray(data)
    ? (data as ICourse[])
    : [];
  const total =
    (data?.pagination as Record<string, unknown>)?.total as number ??
    (data?.total as number) ??
    list.length;
  return { list, total };
}

export const useCourses = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await service.getCourses(page + 1, rowsPerPage);
      const { list, total } = extractCourses(res);
      setCourses(list);
      setTotalCount(total);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const handlePageChange = (_: unknown, newPage: number) => setPage(newPage);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const deleteCourse = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    await service.deleteCourse(id);
    fetchCourses();
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setPage(0);
    fetchCourses();
  };

  return {
    courses,
    loading,
    page,
    rowsPerPage,
    totalCount,
    modalOpen,
    handlePageChange,
    handleRowsPerPageChange,
    deleteCourse,
    openModal,
    closeModal,
  };
};
