import { createSlice } from '@reduxjs/toolkit'

/**
 * Auth state shape.
 * `isLogin` uses `null` as the loading/uninitialised sentinel so the app
 * can show a splash screen while checking for a stored token on startup.
 */
export interface IAuthHelperState {
    /** `null` = checking storage; `true` = authenticated; `false` = logged out */
    isLogin: true | false | null;
    currentUser: string | null;
}

const AuthHelperState: IAuthHelperState = {
    isLogin: null,
    currentUser: null,
}

/**
 * Redux slice for authentication state.
 * The `isLogin` flag drives the top-level route split in `App.tsx`:
 * - `null`  → loading splash
 * - `true`  → render `<AppNavigation />`
 * - `false` → render `<AuthNavigation />`
 */
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