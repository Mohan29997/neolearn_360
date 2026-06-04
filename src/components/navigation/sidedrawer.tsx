import { type Dispatch, Fragment, type SetStateAction, useEffect } from 'react'
import {
    Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
    Tooltip, Typography, useMediaQuery, ButtonBase
} from '@mui/material'
import { AddRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useMUITheme } from '../../hooks/useMUITheme';
import { navigations } from './navigations';

const ACTIVE_BG = '#C41E3A';
const DARK_BTN_BG = '#1C1C2E';

const SideDrawer = ({ isOpen, setIsOpen }: { isOpen: true | false; setIsOpen: Dispatch<SetStateAction<true | false>> }) => {
    const Navigate = useNavigate();
    const { breakpoints, palette: { common } } = useMUITheme();
    const mathUpMd = useMediaQuery(breakpoints?.up("lg"));

    useEffect(() => {
        if (mathUpMd) setIsOpen(true)
        else setIsOpen(false)
    }, [mathUpMd]);

    const isActive = (paths?: string[]) => paths?.includes(window?.location?.pathname) ?? false;

    return (
        <Fragment>
            <Drawer
                open={isOpen}
                onClose={() => setIsOpen(false)}
                variant={mathUpMd ? "permanent" : "temporary"}
                sx={{
                    width: isOpen ? 240 : 60,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: isOpen ? 240 : 60,
                        border: 'none',
                        boxShadow: '2px 0 8px rgba(0,0,0,0.08)',
                        backgroundColor: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        overflowX: 'hidden',
                    },
                }}
            >
                {/* Logo */}
                <Box sx={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: isOpen ? 2 : 1.2,
                    borderBottom: '1px solid rgba(0,0,0,0.07)',
                    flexShrink: 0,
                    overflow: 'hidden',
                }}>
                    <Box sx={{
                        width: 34,
                        height: 34,
                        borderRadius: '8px',
                        backgroundColor: ACTIVE_BG,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '12px', lineHeight: 1, userSelect: 'none' }}>NL</Typography>
                    </Box>
                    {isOpen && (
                        <Box sx={{ overflow: 'hidden' }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#1a1a2e', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                                NeoLearn360
                            </Typography>
                            <Typography sx={{ color: '#999', fontSize: '10px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                                Enterprise L&amp;D
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Nav Items */}
                <List sx={{ flex: 1, py: 1, px: 0.8, overflowY: 'auto', overflowX: 'hidden' }}>
                    {navigations().filter(item => item.visible).map((value, index) => {
                        const active = isActive(value?.isActive);
                        return (
                            <Tooltip
                                key={index}
                                placement="right"
                                title={!isOpen ? value.name : ''}
                                arrow
                            >
                                <ListItemButton
                                    selected={active}
                                    onClick={() => { Navigate(value.navigator); if (!mathUpMd) setIsOpen(false); }}
                                    sx={{
                                        borderRadius: '8px',
                                        mb: 0.3,
                                        px: isOpen ? 1.5 : 1,
                                        py: 0.9,
                                        minHeight: 42,
                                        justifyContent: isOpen ? 'flex-start' : 'center',
                                        '&.Mui-selected': {
                                            backgroundColor: ACTIVE_BG,
                                            '&:hover': { backgroundColor: ACTIVE_BG },
                                            '& .MuiListItemIcon-root': { color: '#fff' },
                                            '& .MuiListItemText-primary': { color: '#fff', fontWeight: 600 },
                                        },
                                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
                                    }}
                                >
                                    <ListItemIcon sx={{
                                        minWidth: isOpen ? 36 : 'unset',
                                        color: active ? '#fff' : '#555',
                                        justifyContent: 'center',
                                    }}>
                                        {value.icon(active ? '#fff' : '#555')}
                                    </ListItemIcon>
                                    {isOpen && (
                                        <ListItemText
                                            primary={
                                                <Typography noWrap sx={{ fontSize: '13px', fontWeight: active ? 600 : 400, color: active ? '#fff' : '#333' }}>
                                                    {value.name}
                                                </Typography>
                                            }
                                        />
                                    )}
                                </ListItemButton>
                            </Tooltip>
                        );
                    })}
                </List>

                {/* Assign Training Button */}
                <Box sx={{ px: 1.5, pb: 2.5, flexShrink: 0 }}>
                    <ButtonBase
                        sx={{
                            width: '100%',
                            backgroundColor: DARK_BTN_BG,
                            borderRadius: '8px',
                            py: 1.2,
                            px: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: isOpen ? 'flex-start' : 'center',
                            gap: 1,
                            '&:hover': { backgroundColor: '#2a2a40' },
                        }}
                    >
                        <AddRounded fontSize="small" sx={{ color: common.white, flexShrink: 0 }} />
                        {isOpen && (
                            <Typography sx={{ color: common.white, fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap' }}>
                                Assign Training
                            </Typography>
                        )}
                    </ButtonBase>
                </Box>
            </Drawer>
        </Fragment>
    )
}

export default SideDrawer;
