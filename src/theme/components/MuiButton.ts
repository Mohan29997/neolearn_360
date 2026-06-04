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
    },
    variants: [
      {
        props: { variant: 'contained', color: 'primary' },
        style: {
          backgroundColor: palette.error.dark,
          color: palette.common.white,
          fontWeight: 500,

          '&.Mui-disabled': {
            backgroundColor: palette.error.light,
            color: palette.common.white,
          },
          '&.MuiButton-loading': {
            backgroundColor: palette.error.light,
            color: palette.common.white,
          },

          '& .MuiButton-loadingIndicator': {
            color: palette.common.white,
          },

        },
      },
      {
        props: { variant: 'contained', color: 'secondary' },
        style: {
          backgroundColor: palette.secondary.dark,
          color: palette.common.white,
          fontWeight: 500,
          '&.Mui-disabled': {
            backgroundColor: palette.secondary.light,
            color: palette.common.white,
          },

          '&.MuiButton-loading': {
            backgroundColor: palette.primary.dark,
            color: palette.common.white,
          },

          '& .MuiButton-loadingIndicator': {
            color: palette.common.white,
          },

        },
      },
    ],

    defaultProps: {
      disableElevation: true,
      disableFocusRipple: true,
      disableRipple: true,
      disableTouchRipple: true,
      fullWidth: true
    },
  }
};
