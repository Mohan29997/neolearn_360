import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";

/**
 * Type-safe version of `useDispatch` pre-bound to the app's `AppDispatch`.
 * Prefer this over raw `useDispatch` so thunk dispatch types are inferred correctly.
 *
 * @example
 * const dispatch = useAppDispatch();
 * dispatch(setIsLogin({ isLogin: true }));
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()