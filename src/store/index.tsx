import { configureStore } from '@reduxjs/toolkit'
import AuthHelper from './reducer/AuthHelper'
import AdminProfile from './reducer/AdminProfile'

export const store = configureStore({
    reducer: {
        authHelper: AuthHelper,
        adminProfile: AdminProfile,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch