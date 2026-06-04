import type { Components, Theme } from '@mui/material/styles';
import { cyanBlur, redBlur } from '../../assets/images';
import { customShadow } from '../customShadows';

export const MuiPaper = (theme: Theme): Components["MuiPaper"] => {
    const { palette, transitions, shape: { borderRadius } } = theme;

    return {
        defaultProps: {
            elevation: 0
        },
        styleOverrides: {
            root: {
                width: '100%',
                boxShadow: customShadow?.paper,
                border: `1px solid ${palette?.divider}`,
                backdropFilter: "blur(20px)",
                backgroundColor: palette?.common?.white,
                backgroundImage: `url(${cyanBlur}), url(${redBlur})`,
                backgroundRepeat: "no-repeat, no-repeat",
                backgroundPosition: "right top, left bottom",
                backgroundSize: "50%, 50%",
                padding: "10px",
                overflow: "hidden",
                transition: transitions.create(transitions?.easing?.easeInOut, {
                    duration: transitions?.duration?.standard
                }),
            },
            rounded: {
                borderRadius: `${Number(borderRadius) / 2}px`
            }
        }
    }
}