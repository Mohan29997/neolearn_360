export interface ICourse {
  _id: string;
  course_title: string;
  provider?: string;
  level?: string;
  duration_hours?: number;
  course_url?: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface IAddCoursePayload {
  course_title: string;
  provider: string;
  course_url: string;
  duration_hours: number;
  description: string;
  level: string;
}

export interface IAssignment {
  _id: string;
  user_id?: { _id?: string; name?: string } | string;
  course_id?: { course_title?: string; title?: string } | string;
  mentor_id?: { name?: string } | string;
  course_title?: string;
  user_name?: string;
  user_email?: string;
  mentor_name?: string;
  status?: string;
  progress_percent?: number;
  course_assigned?: boolean;
  course_started?: boolean;
  coordinator_id?: string;
  assigned_at?: string;
  createdAt?: string;
}

export interface IAssignCoursePayload {
  course_id: string;
  mentor_id: string;
  user_id: string;
}

export interface IUpdateAssignmentPayload {
  user_id: string;
  course_id: string;
  coordinator_id: string;
}

export interface ILearningJourney {
  _id: string;
  employeeName: string;
  employeeEmail: string;
  programName: string;
  assignedByName: string;
  status: 'in_progress' | 'completed' | 'not_started';
  progressPercent: number;
  progressLevel: number;
  startDate: string;
  dueDate: string;
  completedAt: string | null;
  courseList: IJourneyCourse[];
}

export interface IJourneyCourse {
  id: string;
  title: string;
  description: string;
  link: string;
  duration: string;
  completed: boolean;
}
