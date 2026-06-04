import type { Components, Theme } from '@mui/material/styles';

export const MuiAlert = (theme: Theme): Components["MuiAlert"] => {
    const { palette, typography, } = theme;

    return {
        styleOverrides: {
            root: {
                fontFamily: typography?.fontFamily,
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: `${theme?.shape?.borderRadius}px`,
                marginTop: "3px",
                marginBottom: "3px",
            },
            standardSuccess: {
                backgroundColor: palette?.success?.light,
                color: palette?.success?.dark,
            },
            standardError: {
                backgroundColor: palette?.error?.light,
                color: palette?.error?.dark,
            },
            standardWarning: {
                backgroundColor: palette?.warning?.light,
                color: palette?.warning?.dark
            },
            standardInfo: {
                backgroundColor: palette?.info?.light,
                color: palette?.info?.dark,
            },
        }
    };
}