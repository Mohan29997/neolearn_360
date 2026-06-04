import type { Components, Theme } from '@mui/material/styles';

export const MuiAvatar = (theme: Theme): Components["MuiAvatar"] => {
    const { typography: { fontFamily }, } = theme;

    return {
        styleOverrides: {
            root: {
                position: "relative",
                display: "flex",
                webkitBoxAlign: "center",
                alignItems: "center",
                webkitBoxPack: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: "14px",
                lineHeight: 1,
                borderRadius: "50%",
                overflow: "hidden",
                userSelect: "none",
                fontWeight: 600,
                fontFamily: fontFamily
            }
        }
    };
}
