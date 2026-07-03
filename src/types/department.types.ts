export interface IDepartment {
  _id: string;
  name: string;
  description: string;
  managerName?: string;
  employeeId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ISubDepartment {
  _id: string;
  name: string;
  managerName?: string;
  department: string;
  isActive: boolean;
  createdAt: string;
}

export interface ICreateDepartmentPayload {
  departlist: { name: string; manager_name: string; employee_id: string }[];
}
