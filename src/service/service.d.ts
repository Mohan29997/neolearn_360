export interface IUpdateAdminUserPayload {
    employeeId?: string;
    name?: string;
    email?: string;
    password?: string;
    isActive?: boolean;
}

export interface IOnboardUserPayload {
    employeeId: string;
    fullName: string;
    corporateEmail: string;
    password: string;
    role: string;
    department: string;
    officeLocation: string;
    manager_name?: string;
}

export interface ILoginPayload {
    username: string;
    password: string;
}