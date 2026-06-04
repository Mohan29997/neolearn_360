import type { Components, Theme } from '@mui/material/styles';

export const MuiButtonBase = (themes: Theme): Components['MuiButtonBase'] => {
    const {  } = themes;

    return {
        styleOverrides: {
            root: {
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
            }
        }
    }
}