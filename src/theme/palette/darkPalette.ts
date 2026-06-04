import type { PaletteOptions } from "@mui/material";
import { alpha } from '@mui/material/styles';

const GREY = {
    50: "#F9FAFB",
    100: "#F2F4F7",
    200: "#EAECF0",
    300: "#D0D5DD",
    400: "#98A2B3",
    500: "#667085",
    600: "#475467",
    700: "#344054",
    800: "#1D2939",
    900: "#101828",
};

export const darkPalette: PaletteOptions = {
    mode: "light",
    primary: {
        light: "#AFD3CA",
        main: "#71B1A1",
        dark: "#129575",
        contrastText: "#fff",
    },
    secondary: {
        light: "#e3f2fd",
        main: "#e3f2fd",
        dark: "#e3f2fd",
        contrastText: "#fff",
    },
    error: {
        light: "#8A4848",
        main: "#8A2C2C",
        dark: "#8A0303",
        contrastText: "#fff",
    },
    warning: {
        light: "#ffb74d",
        main: "#ffb74d",
        dark: "#f57c00",
        contrastText: "#fff",
    },
    info: {
        light: "#4fc3f7",
        main: "#29b6f6",
        dark: "#0288d1",
        contrastText: "#fff",
    },
    success: {
        light: "#A1D8B5",
        main: "#4CB572",
        dark: "#135E4B",
        contrastText: "#fff",
    },
    grey: GREY,
    background: {
        default: "#f7f9fc",
        paper: "#ffffff",
    },
    text: {
        primary: "#101828",
        secondary: "#F2F4F7",
        disabled: "#667085",
    },
    common: {
        black: "#101828",
        white: "#F9FAFB",
    },
    divider: alpha(GREY[200], 0.24),
    action: {
        active: GREY[600],
        hover: alpha(GREY[500], 0.08),
        selected: alpha(GREY[500], 0.16),
        disabled: alpha(GREY[500], 0.8),
        disabledBackground: alpha(GREY[500], 0.24),
        focus: alpha(GREY[500], 0.24),
        hoverOpacity: 0.08,
        disabledOpacity: 0.48,
        selectedOpacity: 0,
        focusOpacity: 0,
        activatedOpacity: 0,
    },
};