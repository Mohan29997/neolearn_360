import { type ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom';

const NavigationProvider = ({ children }: { children?: ReactNode }) => {
    return (
        <BrowserRouter>
            {children}
        </BrowserRouter>
    )
}

export default NavigationProvider