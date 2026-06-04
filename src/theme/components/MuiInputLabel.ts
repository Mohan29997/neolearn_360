import type { Components, Theme } from '@mui/material/styles';

export const MuiInputLabel = (theme: Theme): Components["MuiInputLabel"] => {
    const { palette, typography } = theme;

    return {
        styleOverrides: {
            root: {
                color: palette?.text?.primary,
                fontFamily: typography?.fontFamily,
                fontSize: '14px',
                fontWeight: 500,
                opacity: 0.8
            }
        }
    }
}