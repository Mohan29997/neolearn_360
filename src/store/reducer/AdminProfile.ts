import { createSlice } from '@reduxjs/toolkit'

/** All possible roles in the NeoLearn 360 system. Controls UI access and API scoping. */
export type UserRole =
    | 'SUPER_ADMIN'
    | 'ADMIN'
    | 'MANAGER'
    | 'EMPLOYEE';

/** Shape of a user record as stored in Redux and returned from the profile API. */
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

/**
 * Redux slice for the authenticated user's profile.
 * Populated after login from the `/users/profile` API response.
 * Used throughout the app for role-based rendering and personalisation.
 */
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