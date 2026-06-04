import type { Components, Theme } from '@mui/material/styles';

export const MuiSkeleton = (theme: Theme): Components["MuiSkeleton"] => {
    const {  shape: { borderRadius } } = theme;

    return {
        styleOverrides: {
            root: {
                width: '100%',
                backgroundColor: "rgba(16, 24, 40, 0.11)",
            },
            rounded: {
                borderRadius: `${Number(borderRadius) / 2}px`
            }
        }
    }
}