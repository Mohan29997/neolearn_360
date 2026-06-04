import { createSlice } from '@reduxjs/toolkit'

export interface IAdminProfileState {
    _currentUser: string | null;
}
const AdminProfileState: IAdminProfileState = {
    _currentUser: null,
}

export const AdminProfile = createSlice({
    name: 'AdminProfile',
    initialState: AdminProfileState,
    reducers: {
        setProfile: (state, action) => {
            state._currentUser = action?.payload?._currentUser
        },
    },
})

// Action creators are generated for each case reducer function
export const { setProfile } = AdminProfile.actions

export default AdminProfile.reducer