import type { Components, Theme } from '@mui/material/styles';

export const MuiTab = (theme: Theme): Components["MuiTab"] => {
    const { palette, typography, } = theme;

    return {
        defaultProps: {
            disableFocusRipple: true,
            disableRipple: true,
        },
        styleOverrides: {
            root: {
                minHeight: "44px",
                height: "44px",
                fontWeight: 600, // Regular
                color: palette?.text?.disabled,
                lineHeight: "normal",
                fontSize: "14px",
                fontFamily: typography?.fontFamily,
                textTransform: 'capitalize',
                "& .MuiTab-root.Mui-selected": {
                    fontWeight: 600, // Regular
                    color: palette?.text?.primary,
                    lineHeight: "normal",
                    fontSize: "14px",
                    textTransform: 'capitalize',
                    fontFamily: typography?.fontFamily,
                }
            }
        }
    };
};