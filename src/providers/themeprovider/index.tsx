import { type ReactNode } from 'react'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { getTheme } from '../../theme';

const MUIThemeProvider = ({ children }: { children: ReactNode }) => {

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={getTheme("light")}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </StyledEngineProvider>
    )
}

export default MUIThemeProvider 