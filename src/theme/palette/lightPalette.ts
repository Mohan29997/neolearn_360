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

export const lightPalette: PaletteOptions = {
    mode: "light",
    primary: {
        light: '#76B0F1',
        main: '#2065D1',
        dark: '#103996',
        contrastText: "#fff",
    },
    secondary: {
        light: '#84A9FF',
        main: '#3366FF',
        dark: '#1939B7',
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
        light: '#74CAFF',
        main: '#1890FF',
        dark: '#0C53B7',
        contrastText: "#fff",
    },
    success: {
        light: '#AAF27F',
        main: '#54D62C',
        dark: '#229A16',
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
        white: "#FFFFFF",
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