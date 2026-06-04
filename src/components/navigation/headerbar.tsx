import { type Dispatch, Fragment, type SetStateAction } from 'react'
import { AppBar, useMediaQuery, Box, Typography, IconButton } from '@mui/material'
import UserSection from './usersection';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import { useMUITheme } from '../../hooks/useMUITheme';

const HeaderBar = ({ isOpen, setIsOpen }: { isOpen: true | false; setIsOpen: Dispatch<SetStateAction<true | false>> }) => {
    const { breakpoints, palette: { common, text } } = useMUITheme();
    const mathUpMd = useMediaQuery(breakpoints?.up("lg"));

    return (
        <Fragment>
            <AppBar
                elevation={0}
                sx={{
                    width: `calc(100% - ${mathUpMd ? isOpen ? "240px" : "60px" : "0px"})`,
                    backgroundColor: common.white, 
                    border: "none", 
                    height: 60, 
                    transition: "ease-in-out  0.2s", 
                    left: mathUpMd ? isOpen ? 240 : 60 : 0,
                    justifyContent: "center"
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <IconButton onClick={() => setIsOpen(!isOpen)}>
                        <MenuOpenRoundedIcon fontSize="medium" sx={{ color: text?.primary, transition: "ease-in-out 0.4s", transform: `rotate(${isOpen ? "0deg" : "180deg"})` }} />
                    </IconButton>
                    <Typography></Typography>
                    {/* <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", }}>
                        <UserSection />
                    </Box> */}
                </Box>
            </AppBar>
        </Fragment>
    )
}

export default HeaderBar