import type { Components, Theme } from '@mui/material/styles';

export const MuiFormHelperText = (theme: Theme): Components["MuiFormHelperText"] => {
    const { palette, typography } = theme;

    return {
        styleOverrides: {
            root: {
                color: palette?.error?.main,
                fontFamily: typography?.fontFamily,
                fontSize: '12px',
                fontWeight: 500,
                opacity: 0.8
            }
        }
    }
}