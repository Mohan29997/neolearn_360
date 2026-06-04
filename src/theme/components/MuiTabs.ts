import type { Components, Theme } from '@mui/material/styles';

export const MuiTabs = (theme: Theme): Components["MuiTabs"] => {
    const { palette, typography,} = theme;

    return {
        styleOverrides: {
            root: {
                minHeight: "44px",
                height: "44px",
                fontFamily: typography?.fontFamily,
                "& .MuiTabs-indicator": {
                    backgroundColor: palette?.primary?.main,
                    height: 2,
                },
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
}