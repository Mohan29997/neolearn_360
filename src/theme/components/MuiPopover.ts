import type { Components, Theme } from '@mui/material/styles';
import { customShadow } from '../customShadows';

export const MuiPopover = (theme: Theme): Components["MuiPopover"] => {
    const { palette, shape: { borderRadius } } = theme;

    return {
        styleOverrides: {
            root: {},
            paper: {
                opacity: 1,
                transition: "opacity 313ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 208ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                width: "auto",
                minWidth: "16px",
                minHeight: "16px",
                maxWidth: "calc(100% - 32px)",
                maxHeight: "calc(100% - 32px)",
                outline: "0px",
                border: "none",
                backdropFilter: "blur(20px)",
                backgroundColor: palette?.common?.white, // "rgba(255, 255, 255, 0.9)",
                backgroundImage: "none",
                boxShadow: customShadow?.paper,
                borderRadius: `${borderRadius}px`,
                overflow: "inherit",
                padding: "0px",
            }
        }
    }
}