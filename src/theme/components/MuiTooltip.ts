import type { Components, Theme } from '@mui/material/styles';

export const MuiTooltip = (themes: Theme): Components['MuiTooltip'] => {
    const { shape: { borderRadius }, palette, typography } = themes;

    return {
        styleOverrides: {
            tooltip: {
                padding: '0px',
                fontSize: '12px',
                fontWeight: 400,
                fontFamily: typography?.fontFamily,
                color: palette?.common.white,
                backgroundColor: "transparent",
                borderRadius: `${Number(borderRadius) / 2}px`,
            },
            arrow: {
                color: palette?.common?.white,
            },
        }
    }
}