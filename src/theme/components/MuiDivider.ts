import type { Components, Theme } from '@mui/material/styles';

export const MuiDivider = (theme: Theme): Components["MuiDivider"] => {
    const { palette,  shape: { borderRadius } } = theme;

    return {
        styleOverrides: {
            root: {
                width: '100%',
                backgroundColor: palette.grey[200],
            },
        }
    }
}