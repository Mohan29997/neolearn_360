export type SnackVariant = 'default' | 'error' | 'success' | 'warning' | 'info';

export type BenchDisplayStatus = 'On Bench' | 'Shadowing' | 'On Project';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface IEmployee {
  _id: string;
  name: string;
  email: string;
  employeeId: string;
  role: string;
  department: string;
  subDepartmentName?: string;
  managerName: string;
  vpName?: string;
  tlName?: string;
  officeLocation: string;
  techStack: string[];
  isActive: boolean;
  status: BenchDisplayStatus;
  courseStarted: boolean;
  courseAssigned: string | null;
  managerId?: string | null;
}

export interface ICourseOption {
  _id: string;
  title: string;
  duration: string;
}

export interface IUserOption {
  _id: string;
  name: string;
  role: string;
  department?: string;
}
