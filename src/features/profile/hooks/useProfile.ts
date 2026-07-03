import { useEffect, useState } from 'react';
import { service } from '../../../service';
import type { IUser } from '../../../types/auth.types';

function extractProfile(res: unknown): IUser | null {
  const r = res as Record<string, unknown> | undefined;
  const d1 = (r?.data as Record<string, unknown>)?.data as IUser | undefined;
  if (d1?._id) return d1;
  const d2 = r?.data as IUser | undefined;
  if (d2?._id) return d2;
  return (r as IUser | undefined)?._id ? (r as IUser) : null;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    service
      .getuserprofile()
      .then(res => setProfile(extractProfile(res)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { profile, setProfile, loading };
};
