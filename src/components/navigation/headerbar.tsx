import { type Dispatch, Fragment, type SetStateAction } from 'react'
import { AppBar, useMediaQuery, Box, Typography, IconButton, InputBase } from '@mui/material'
import {
    MenuOpenRounded,
    SearchRounded,
    NotificationsNoneRounded,
    HelpOutlineRounded,
    AppsRounded,
} from '@mui/icons-material';
import { useMUITheme } from '../../hooks/useMUITheme';
import { useAppSelector } from '../../hooks/useAppSelector';
import UserSection from './usersection';

const HeaderBar = ({ isOpen, setIsOpen }: { isOpen: true | false; setIsOpen: Dispatch<SetStateAction<true | false>> }) => {
    const { breakpoints, palette: { common, text, error } } = useMUITheme();
    const mathUpMd = useMediaQuery(breakpoints?.up("lg"));
    const profile = useAppSelector((state) => state?.adminProfile);

    return (
        <Fragment>
            <AppBar
                elevation={0}
                sx={{
                    width: `calc(100% - ${mathUpMd ? isOpen ? "240px" : "60px" : "0px"})`,
                    backgroundColor: common.white,
                    borderBottom: '1px solid rgba(0,0,0,0.08)',
                    height: 60,
                    transition: 'ease-in-out 0.2s',
                    left: mathUpMd ? (isOpen ? 240 : 60) : 0,
                    justifyContent: 'center',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, height: '100%' }}>
                    {/* Left: menu toggle + search */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                        <IconButton size="small" onClick={() => setIsOpen(!isOpen)}>
                            <MenuOpenRounded fontSize="small" sx={{ color: text.secondary, transition: 'ease-in-out 0.4s', transform: `rotate(${isOpen ? '0deg' : '180deg'})` }} />
                        </IconButton>

                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '8px',
                            px: 1.5,
                            py: 0.5,
                            gap: 1,
                            maxWidth: 420,
                            width: '100%',
                        }}>
                            <SearchRounded fontSize="small" sx={{ color: '#aaa' }} />
                            <InputBase
                                placeholder="Search employees, courses, or resources..."
                                sx={{ fontSize: '13px', color: text.primary, flex: 1 }}
                            />
                        </Box>
                    </Box>

                    {/* Right: icons + user */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <IconButton size="small">
                            <NotificationsNoneRounded fontSize="small" sx={{ color: text.secondary }} />
                        </IconButton>
                        <IconButton size="small">
                            <HelpOutlineRounded fontSize="small" sx={{ color: text.secondary }} />
                        </IconButton>
                        <IconButton size="small">
                            <AppsRounded fontSize="small" sx={{ color: text.secondary }} />
                        </IconButton>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1, cursor: 'pointer' }}>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px', color: text.primary, lineHeight: 1.3 }}>
                                    {profile?.name || 'Admin User'}
                                </Typography>
                                <Typography variant="caption" sx={{ fontSize: '10px', color: error.dark, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {profile?.role?.replace('_', ' ') || 'System Architect'}
                                </Typography>
                            </Box>
                            <UserSection />
                        </Box>
                    </Box>
                </Box>
            </AppBar>
        </Fragment>
    )
}

export default HeaderBar
