import type { Components, Theme } from '@mui/material/styles';

export const MuiOutlinedInput = (theme: Theme): Components["MuiOutlinedInput"] => {
     const { palette, typography, shape } = theme;

     return {
          styleOverrides: {
               root: {
                    background: palette?.grey[50],
                    borderRadius: theme?.shape?.borderRadius,
                    alignIftems: "baseline",
                    '& .MuiOutlinedInput-notchedOutline': {
                         border: `1.5px solid ${palette?.grey[400]}`,
                         transition: 'ease-in 0.2s',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                         border: `2px solid ${palette?.error?.main}`,
                         transition: 'ease-in 0.2s',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                         border: `2px solid ${palette?.error?.light}`,
                         transition: 'ease-in 0.2s',
                    },
                    '&.MuiInputBase-multiline': {
                         padding: 1
                    },
                    '&.MuiInputBase-root': {
                         alignIftems: "baseline"
                    },
               },
               input: {
                    color: palette?.text?.primary,
                    fontSize: '14px',
                    fontWeight: 600,
                    fontStyle: 'normal',
                    fontFamily: typography?.fontFamily,
                    background: palette?.grey[50],
                    // padding: '15.5px 14px',
                    borderRadius: shape?.borderRadius,
                    '&.MuiInputBase-inputSizeSmall': {
                         padding: '10px 14px',
                         height: "21px",
                         '&.MuiInputBase-inputAdornedStart': {
                              paddingLeft: 0
                         }
                    },
                    "&::placeholder": {
                         color: palette?.grey[500],
                         fontSize: '14px',
                         fontWeight: 600,
                         fontFamily: typography?.fontFamily,
                         fontStyle: 'normal',
                         opacity: 0.6
                    },
               },
               notchedOutline: {
                    borderRadius: shape?.borderRadius
               }
          }
     }
}