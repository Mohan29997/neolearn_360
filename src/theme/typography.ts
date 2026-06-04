import type { ThemeOptions, PaletteOptions } from '@mui/material/styles';

export const typography = (colors: PaletteOptions): ThemeOptions['typography'] => {

  return {
    fontFamily: "Open Sans",
    h1: {
      fontWeight: 800, // Bold
      color: colors.text?.primary,
      lineHeight: "normal",
      fontSize: "38px",
    },
    h2: {
      fontWeight: 700, // Bold
      color: colors.text?.primary,
      lineHeight: "normal",
      fontSize: "30px",
    },
    h3: {
      fontWeight: 600, // Regular & Bold
      color: colors.text?.primary,
      lineHeight: "normal",
      fontSize: "24px",
    },
    h4: {
      fontWeight: 600, // Bold
      color: colors.text?.primary,
      lineHeight: "normal",
      fontSize: "20px",
    },
    h5: {
      fontWeight: 600, // Regular & Medium & Bold
      color: colors.text?.primary,
      lineHeight: "normal",
      fontSize: "16px",
    },
    h6: {
      fontWeight: 500, // Regular
      color: colors.text?.primary,
      lineHeight: "normal",
      fontSize: "14px",
    },
    subtitle1: {
      fontWeight: 500, // Regular
      color: colors?.grey?.[700],
      lineHeight: "normal",
      fontSize: "14px",
    },
    subtitle2: {
      fontWeight: 300, // Medium
      color: colors?.grey?.[600],
      lineHeight: "normal",
      fontSize: "12px",
    },
    body1: {
      fontWeight: 300, // Regular
      color: colors.text?.primary,
      lineHeight: "normal",
      fontSize: "14px",
    },
    body2: {
      fontWeight: 300, // Regular
      color: colors.text?.primary,
      lineHeight: "normal",
      fontSize: "12px",
    },
    caption: {
      fontWeight: 300, // Regular
      color: colors.text?.primary,
      lineHeight: "normal",
      fontSize: "12px",
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '1px',
      color: colors.text?.secondary,
    }
  };
};
