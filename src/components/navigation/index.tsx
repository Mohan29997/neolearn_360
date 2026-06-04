import { Fragment, useState, type ReactNode } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import SideDrawer from './sidedrawer';
import HeaderBar from './headerbar';

const Navigation = ({ children }: { children?: ReactNode }) => {
    const { breakpoints, } = useTheme();
    const mathUpMd = useMediaQuery(breakpoints?.up("lg"));
    const [isOpen, setIsOpen] = useState(true);

    return (
        <Fragment>
            <Box sx={{ width: "100%" }}>
                <Box sx={{ width: "100%", display: 'flex', overflow: 'hidden' }}>
                    <HeaderBar isOpen={isOpen} setIsOpen={setIsOpen} />
                    <SideDrawer isOpen={isOpen} setIsOpen={setIsOpen} />


                    <Box sx={{
                        display: 'flex',
                        flexDirection: "column",
                        flexGrow: 1,
                        width: `calc(100% - ${mathUpMd ? isOpen ? "240px" : "60px" : "0px"})`,
                        pt: 1,
                        pb: 1,
                        pl: { xs: 1.5, sm: 1.4, md: 1, lg: 1, xl: 2 },
                        pr: { xs: 1.5, sm: 1.4, md: 1, lg: 1, xl: 2 },
                    }}>
                        <Box sx={{ height: 60, }} />
                        {children}
                        <Box sx={{ height: 20, }} />
                    </Box>
                </Box>
            </Box>
        </Fragment>
    )
}

export default Navigation