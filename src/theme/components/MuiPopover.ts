import type { Components, Theme } from '@mui/material/styles';
import { cyanBlur, redBlur } from '../../assets/images';
import { customShadow } from '../customShadows';

export const MuiPopover = (theme: Theme): Components["MuiPopover"] => {
    const { palette, shape: { borderRadius } } = theme;

    return {
        styleOverrides: {
            root: {},
            paper: {
                opacity: 1,
                transform: "none",
                transition: "1 313ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 208ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                // top: "52px",
                // left: "157px",
                transformOrigin: "200px 0px",
                position: "absolute",
                minWidth: "16px",
                minHeight: "16px",
                maxWidth: "calc(100% - 32px)",
                maxHeight: "calc(100% - 32px)",
                outline: "0px",
                backdropFilter: "blur(20px)",
                backgroundColor: palette?.common?.white, // "rgba(255, 255, 255, 0.9)",
                backgroundImage: `url(${cyanBlur}), url(${redBlur})`,
                backgroundRepeat: "no-repeat, no-repeat",
                backgroundPosition: "right top, left bottom",
                backgroundSize: "50%, 50%",
                boxShadow: customShadow?.paper,
                borderRadius: `${borderRadius}px`,
                overflow: "inherit",
                marginLeft: "6px",
                padding: "0px",
            }
        }
    }
}