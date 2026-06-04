import { createSlice } from '@reduxjs/toolkit'

export interface IAuthHelperState {
    isLogin: true | false | null;
    currentUser: string | null;
}
const AuthHelperState: IAuthHelperState = {
    isLogin: null,
    currentUser: null,
}

export const AuthHelper = createSlice({
    name: 'AuthHelper',
    initialState: AuthHelperState,
    reducers: {
        setIsLogin: (state, action) => {
            state.isLogin = action?.payload?.isLogin
        },
        setCurrentUser: (state, action) => {
            state.currentUser = action?.payload?.currentUser
        },
    },
})

// Action creators are generated for each case reducer function
export const { setIsLogin, setCurrentUser } = AuthHelper.actions

export default AuthHelper.reducer