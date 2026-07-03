import { useEffect, useState } from 'react';
import { service } from '../../../service';
import type { ILearningJourney } from '../../../types/course.types';

function mapJourney(j: Record<string, unknown>): ILearningJourney {
  return {
    _id: j._id as string,
    employeeName: (j.employee_name ?? '') as string,
    employeeEmail: (j.employee_email ?? '') as string,
    programName: (j.learning_program_name ?? '') as string,
    assignedByName: (j.assigned_by_name ?? '') as string,
    status: (j.status ?? 'not_started') as ILearningJourney['status'],
    progressPercent: (j.progress_percent ?? 0) as number,
    progressLevel: (j.progress_level ?? 0) as number,
    startDate: (j.start_date ?? '') as string,
    dueDate: (j.due_date ?? '') as string,
    completedAt: (j.completed_at ?? null) as string | null,
    courseList: [],
  };
}

export const useLearningJourneys = () => {
  const [journeys, setJourneys] = useState<ILearningJourney[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState<ILearningJourney | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    service
      .getLearningJourneys({ page: 1, limit: 20 })
      .then(res => {
        const data = (res as Record<string, unknown>)?.data as Record<string, unknown> | undefined;
        const list = (data?.learningJourneys ?? []) as Record<string, unknown>[];
        const pagination = data?.pagination as Record<string, unknown> | undefined;
        setTotal((pagination?.total ?? list.length) as number);
        setJourneys(list.map(mapJourney));
      })
      .finally(() => setLoading(false));
  }, []);

  return { journeys, loading, total, selectedJourney, setSelectedJourney };
};
