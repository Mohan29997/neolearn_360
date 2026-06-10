import { useSelector } from "react-redux";
import type { RootState } from "../store";

/**
 * Type-safe version of `useSelector` pre-bound to the app's `RootState`.
 * Prefer this over raw `useSelector` to avoid manual type casting.
 *
 * @example
 * const { name, role } = useAppSelector(state => state.adminProfile);
 */
export const useAppSelector = useSelector.withTypes<RootState>()