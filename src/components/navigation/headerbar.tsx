import { type Dispatch, Fragment, type SetStateAction } from 'react'
import { AppBar, useMediaQuery, Box, IconButton, InputBase, Avatar, Typography, Tooltip } from '@mui/material'
import {
    MenuOpenRounded,
    SearchRounded,
    NotificationsNoneRounded,
    HelpOutlineRounded,
    AppsRounded,
    LogoutRounded,
} from '@mui/icons-material';
import { useMUITheme } from '../../hooks/useMUITheme';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../hooks/useAppSelector';
import { StorageManager } from '../../storagemanager';
import { setIsLogin } from '../../store/reducer/AuthHelper';
import { resetProfile } from '../../store/reducer/AdminProfile';
import { hexToRgbColor } from '../../utils/hexToRgbColor';

const HeaderBar = ({ isOpen, setIsOpen }: { isOpen: true | false; setIsOpen: Dispatch<SetStateAction<true | false>> }) => {
    const { breakpoints, palette: { common, text, error } } = useMUITheme();
    const mathUpMd = useMediaQuery(breakpoints?.up("lg"));
    const dispatch = useDispatch();
    const profile = useAppSelector((state) => state.adminProfile);

    const initials = profile?.name
        ? profile.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
        : 'A';

    const handleLogout = () => {
        StorageManager.removeItems();
        sessionStorage.clear();
        dispatch(setIsLogin({ isLogin: false }));
        dispatch(resetProfile());
    };

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
                    justifyContent: "center",
                    borderBottomWidth: 1,
                    borderBottomStyle: "solid",
                    borderBottomColor: hexToRgbColor(error.light, .5)
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <IconButton onClick={() => setIsOpen(!isOpen)}>
                        <MenuOpenRounded fontSize="medium" sx={{ color: text?.primary, transition: "ease-in-out 0.4s", transform: `rotate(${isOpen ? "0deg" : "180deg"})` }} />
                    </IconButton>
                    <Typography></Typography>
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
                        <Tooltip title="Support">
                            <IconButton size="small"><HelpOutlineRounded sx={{ color: text?.secondary }} /></IconButton>
                        </Tooltip>
                        <Tooltip title="Notifications">
                            <IconButton size="small"><NotificationsNoneRounded sx={{ color: text?.secondary }} /></IconButton>
                        </Tooltip>
                        <Tooltip title={profile?.name || 'Profile'}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: '#8B1A2E', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                                {initials}
                            </Avatar>
                        </Tooltip>
                        <Tooltip title="Logout">
                            <IconButton size="small" onClick={handleLogout}><LogoutRounded sx={{ color: text?.secondary }} /></IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </AppBar>
        </Fragment>
    )
}

export default HeaderBar
