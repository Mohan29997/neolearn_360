import { useEffect, useState } from 'react';
import { service } from '../../../service';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setProfile } from '../../../store/reducer/AdminProfile';
import type { IUser } from '../../../types/auth.types';
import type { IAssignment } from '../../../types/course.types';

function extractUser(res: unknown): IUser | null {
  const r = res as Record<string, unknown> | undefined;
  const d1 = (r?.data as Record<string, unknown>)?.data as IUser | undefined;
  if (d1?._id) return d1;
  const d2 = r?.data as IUser | undefined;
  if (d2?._id) return d2;
  return null;
}

function extractAssignments(res: unknown): IAssignment[] {
  const r = res as Record<string, unknown> | undefined;
  const data = r?.data as Record<string, unknown> | undefined;
  const list = data?.assignments ?? data?.data ?? data ?? [];
  return Array.isArray(list) ? (list as IAssignment[]) : [];
}

export const useSettings = () => {
  const dispatch = useAppDispatch();
  const [profile, setProfileState] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [assignedCourses, setAssignedCourses] = useState<IAssignment[]>([]);

  useEffect(() => {
    Promise.allSettled([
      service.getuserprofile(),
      service.getAssignedCourses({ page: 1, limit: 90 }),
    ]).then(([profileResult, coursesResult]) => {
      if (profileResult.status === 'fulfilled') {
        const data = extractUser(profileResult.value);
        if (data) {
          setProfileState(data);
          setForm({ name: data.name, email: data.email, password: '' });
        }
      }
      if (coursesResult.status === 'fulfilled') {
        setAssignedCourses(extractAssignments(coursesResult.value));
      }
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const payload: { name: string; email: string; password?: string } = { name: form.name, email: form.email };
    if (form.password) payload.password = form.password;
    try {
      await service.updateAdminUser(profile._id, payload);
      const updated = { ...profile, name: form.name, email: form.email };
      setProfileState(updated);
      dispatch(setProfile(updated));
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    if (profile) setForm({ name: profile.name, email: profile.email, password: '' });
  };

  return {
    profile, loading, editing, saving, form,
    assignedCourses, setEditing, setForm, handleSave, cancelEdit,
  };
};
