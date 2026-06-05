import { createSlice } from '@reduxjs/toolkit'

export type UserRole =
    | 'SUPER_ADMIN'
    | 'ADMIN'
    | 'MANAGER'
    | 'EMPLOYEE';

export interface IUser {
    _id: string;
    employeeId: string;
    name: string;
    email: string;
    role: UserRole;
    department?: string;
    technologies: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

const AdminProfileState: IUser | null = {
    _id: "",
    employeeId: "",
    name: "",
    email: "",
    role: "SUPER_ADMIN",
    technologies: [],
    isActive: false,
    createdAt: "",
    updatedAt: "",
}

export const AdminProfile = createSlice({
    name: 'AdminProfile',
    initialState: AdminProfileState,
    reducers: {
        setProfile: (state, action) => {
            state._id = action.payload._id
            state.employeeId = action.payload.employeeId
            state.name = action.payload.name
            state.email = action.payload.email
            state.role = action.payload.role
            state.department = action.payload.department
            state.technologies = action.payload.technologies
            state.isActive = action.payload.isActive
            state.createdAt = action.payload.createdAt
            state.updatedAt = action.payload.updatedAt
        },
        resetProfile: () => AdminProfileState,
    },
})

// Action creators are generated for each case reducer function
export const { setProfile, resetProfile } = AdminProfile.actions

export default AdminProfile.reducer