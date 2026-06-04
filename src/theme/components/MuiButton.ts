import type { Components, Theme } from '@mui/material/styles';

export const MuiButton = (themes: Theme): Components['MuiButton'] => {
  const { palette, typography, shape: { borderRadius }, } = themes;

  return {
    styleOverrides: {
      root: {
        fontFamily: typography?.fontFamily,
        backgroundImage: 'none',
        fontSize: '16px',
        textTransform: "capitalize",
        borderRadius: `${borderRadius}px`,

        // REMOVE FOCUS BORDER
        '&:focus': {
          outline: 'none',
        },
        '&:focus-visible': {
          outline: 'none',
          boxShadow: 'none',
        },
        '&.Mui-focusVisible': {
          outline: 'none',
          boxShadow: 'none',
        },
      },
      sizeLarge: {
        height: 45,
      },
      sizeMedium: {
        height: 40,
      },
      sizeSmall: {
        height: 35,
      },

      containedInherit: {
        color: palette.grey[800],
        // boxShadow: customShadows?.z8,
        fontWeight: 500,
        '&:hover': {
          backgroundColor: palette?.grey[400],
        },
      },
      containedPrimary: {
        // boxShadow: customShadows?.primary,
        backgroundColor: palette?.primary?.dark,
        color: palette?.common?.white,
        fontWeight: 500,
        "&:disabled": {
          backgroundColor: palette?.primary?.light,
        }
      },
      containedSecondary: {
        // boxShadow: theme.customShadows.secondary,
        backgroundColor: palette?.secondary?.dark,
        color: palette?.common?.white,
        fontWeight: 500,
        "&:disabled": {
          backgroundColor: palette?.secondary?.light,
        },
        "&:hover": {
          backgroundColor: palette?.secondary?.dark,
        }
      },
      containedInfo: {
        color: palette?.common?.white,
        backgroundColor: palette?.info?.dark,
        // boxShadow: customShadows?.info,
        fontWeight: 500,
        "&:disabled": {
          backgroundColor: palette?.info?.light,
        },
        '&:hover': {
          backgroundColor: palette?.info?.dark,
        },
      },
      containedSuccess: {
        color: palette?.common?.black,
        backgroundColor: palette?.success?.main,
        // boxShadow: customShadows?.success,
        fontWeight: 500,
        "&:disabled": {
          backgroundColor: palette?.success?.light,
        },
        '&:hover': {
          backgroundColor: palette?.success?.dark,
        },
      },
      containedWarning: {
        color: palette?.common?.black,
        // boxShadow: customShadows.warning,
        backgroundColor: palette?.warning?.main,
        fontWeight: 500,
        "&:disabled": {
          backgroundColor: palette?.warning?.light,
        },
        '&:hover': {
          backgroundColor: palette?.warning?.dark,
        },
      },
      containedError: {
        color: palette?.common?.white,
        // boxShadow: customShadows.error,
        backgroundColor: palette?.error?.main,
        fontWeight: 500,
        "&:disabled": {
          backgroundColor: palette?.error?.light,
        },
        '&:hover': {
          backgroundColor: palette?.error?.dark,
        },
      },


      textInherit: {
        color: palette?.text?.primary,
        padding: 0,
        margin: 0,
        fontWeight: 600,
        backgroundColor: "transparent",
        '&:hover': {
          backgroundColor: "transparent",
        },
        '&:active': {
          backgroundColor: "transparent",
        }
      },
      textPrimary: {
        fontWeight: 600,
        color: palette?.text?.primary,
        padding: 0,
        margin: 0,
        height: 'auto',
        backgroundColor: "transparent",
        '&:hover': {
          backgroundColor: "transparent",
        },
        '&:active': {
          backgroundColor: "transparent",
        },
        '&:focus': {
          backgroundColor: "transparent",
        }
      },
      textSecondary: {
        fontWeight: 600,
        color: palette?.text?.secondary,
        padding: 0,
        margin: 0,
        backgroundColor: "transparent",
        '&:hover': {
          backgroundColor: "transparent",
        },
      },
      textInfo: {
        fontWeight: 600,
        color: palette?.info?.main,
        padding: 0,
        margin: 0,
        backgroundColor: "transparent",
        '&:hover': {
          backgroundColor: "transparent",
        },
      },
      textSuccess: {
        fontWeight: 600,
        color: palette?.success?.main,
        padding: 0,
        margin: 0,
        backgroundColor: "transparent",
        '&:hover': {
          backgroundColor: "transparent",
        },
      },
      textWarning: {
        fontWeight: 600,
        color: palette?.warning?.main,
        padding: 0,
        margin: 0,
        backgroundColor: "transparent",
        '&:hover': {
          backgroundColor: "transparent",
        },
      },
      textError: {
        fontWeight: 600,
        color: palette?.error?.main,
        padding: 0,
        margin: 0,
        backgroundColor: "transparent",
        '&:hover': {
          backgroundColor: "transparent",
        },
      },
    },
    defaultProps: {
      disableElevation: true,
      disableFocusRipple: true,
      disableRipple: true,
      disableTouchRipple: true,
      fullWidth: true
    },
  }
};
