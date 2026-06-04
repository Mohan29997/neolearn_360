export interface ILoginPayload {
    "username": string;
    "password": string;
}

export interface IOnboardUserPayload {
    employeeId: string;
    fullName: string;
    corporateEmail: string;
    password: string;
    role: string;
    department: string;
    officeLocation: string;
}