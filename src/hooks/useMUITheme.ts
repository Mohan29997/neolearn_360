import { useTheme } from "@mui/material";

/**
 * Convenience wrapper around MUI's `useTheme`.
 * Provides access to the active theme (light/dark palette, typography, shadows)
 * without needing to import `useTheme` directly in every component.
 */
export const useMUITheme = () => {
    const theme = useTheme();
    return theme
}