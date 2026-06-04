import type { Components, Theme } from '@mui/material/styles';

export const MuiAutocomplete = (theme: Theme): Components["MuiAutocomplete"] => {

    return {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    padding: "0px"
                }
            }
        }
    }
}