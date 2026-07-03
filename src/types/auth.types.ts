export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'VP' | 'DM';

export interface IUser {
  _id: string;
  employeeId: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  subDepartment?: string;
  subDepartmentName?: string;
  subDepartmentId?: string;
  officeLocation?: string;
  managerName?: string;
  vpName?: string;
  tlName?: string;
  status?: string;
  bench_status?: string;
  technologies: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAuthState {
  isLogin: true | false | null;
  currentUser: string | null;
}

export interface ILoginPayload {
  username: string;
  password: string;
}

export interface IOnboardUserPayload {
  employeeId: string;
  fullName: string;
  corporateEmail: string;
  password: string;
  role: string;
  department: string;
  officeLocation: string;
  technologies?: string[];
  manager_name?: string;
  vpName?: string;
  subDepartmentName?: string;
  managerName?: string;
}

export interface IUpdateUserPayload {
  employeeId?: string;
  name?: string;
  email?: string;
  password?: string;
  isActive?: boolean;
}

export interface IUpdateDepartmentPayload {
  name: string;
  manager_name: string;
  employee_id: string;
  isActive: boolean;
}
