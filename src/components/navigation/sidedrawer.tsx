import { type Dispatch, Fragment, type SetStateAction, useEffect } from 'react'
import { Avatar, Box, ButtonBase, Drawer, Paper, Tooltip, Typography, useMediaQuery } from '@mui/material'
import { ChevronRightRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useMUITheme } from '../../hooks/useMUITheme';
import { navigations } from './navigations';
import type { RootState } from '../../store';
import { useAppSelector } from '../../hooks/useAppSelector';
import { hexToRgbColor } from '../../utils/hexToRgbColor';

const SideDrawer = ({ isOpen, setIsOpen }: { isOpen: true | false; setIsOpen: Dispatch<SetStateAction<true | false>> }) => {
    const Navigate = useNavigate();
    const { name, role } = useAppSelector((state: RootState) => state.adminProfile);
    const { breakpoints, palette: { primary, success, text, error } } = useMUITheme();
    const mathUpMd = useMediaQuery(breakpoints?.up("lg"));

    useEffect(() => {
        if (mathUpMd) {
            setIsOpen(true)
        } else {
            setIsOpen(false)
        }
    }, [mathUpMd]);

    return (
        <Fragment>
            <Drawer
                open={isOpen}
                onClose={() => { setIsOpen(!isOpen) }}
                variant={mathUpMd ? "permanent" : "temporary"} // permanent  temporary
                sx={{
                    width: isOpen ? 240 : 60,
                    border: 'none',
                    ...(!isOpen && !mathUpMd && {
                        display: "none",
                    }),
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: isOpen ? 240 : 60,
                        ...(!isOpen && {
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "flex-start",
                        }),
                        p: 0,
                        border: 'none',
                        boxShadow: 'none',
                        overflowY: 'hidden',
                        overflowX: 'hidden',

                        borderRightWidth: 1,
                        borderRightStyle: "solid",
                        borderRightColor: hexToRgbColor(error.light, .5)
                    },
                }}
            >
                <Box sx={{ height: 80, justifyContent: "center", alignItems: "center", display: "flex", m: 1 }}>
                    {isOpen ?
                        <Typography variant="h4" color={error.dark} sx={{ fontWeight: 700 }}>Neo Learn 360</Typography>
                        :
                        <Typography variant="h4" color={error.dark} sx={{ fontWeight: 700 }}>SB</Typography>
                    }
                </Box>

                <Box sx={{ overflow: "auto", height: "100%" }}>
                    <Box sx={{ /* paddingLeft: !mathUpMd ? 16 : 0, paddingRight: !mathUpMd ? 16 : 0, */ display: "flex", flexDirection: "column", gap: "5px" }}>
                        {navigations()?.filter((item) => item?.visible === true)?.map((value, index) => {

                            return (
                                <ButtonBase
                                    key={index}
                                    onClick={() => { Navigate(value?.navigator); if (!mathUpMd) { setIsOpen(false) } }}
                                    sx={{
                                        width: !isOpen ? "fit-content" : 'auto',
                                        justifyContent: "space-between",
                                        transition: "ease-in-out 0.3s",
                                        borderRadius: `${Number(0)}px`,
                                        pl: 1 / 2,
                                        pr: 1 / 2,
                                        ...(value?.isActive?.includes(window?.location?.pathname) && {
                                            backgroundColor: primary?.dark
                                        }),
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", }}>
                                        <Tooltip
                                            placement="right"
                                            arrow={!isOpen}
                                            title={
                                                <Paper sx={{ ...(isOpen && { display: "none" }) }}>
                                                    <Typography variant="h6" sx={{ transition: "ease-in-out 0.4s" }}>{value?.name}</Typography>
                                                </Paper>
                                            }
                                        >
                                            <Box sx={{
                                                padding: "0px",
                                                width: "40px",
                                                height: "40px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}>
                                                {value?.icon(value?.isActive?.includes(window?.location?.pathname) ? text.secondary : text?.primary)}
                                            </Box>
                                        </Tooltip>
                                        <Typography variant="h6" sx={{
                                            ...(!isOpen && { display: "none" }),
                                            color: value?.isActive?.includes(window?.location?.pathname) ? text.secondary : text.primary,
                                            transition: "ease-in-out 0.4s"
                                        }}>{value?.name}</Typography>
                                    </Box>
                                    <ChevronRightRounded sx={{ color: value?.isActive?.includes(window?.location?.pathname) ? text.secondary : text.primary, ...(!isOpen && { display: "none" }), transition: "ease-in-out 0.4s" }} />
                                </ButtonBase>
                            )
                        })}
                    </Box>

                </Box>

                <Box
                    onClick={() => { }}
                    sx={{
                        cursor: "pointer",
                        height: 80,
                        paddingInline: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        borderTopWidth: 1,
                        borderTopStyle: "solid",
                        borderTopColor: hexToRgbColor(error.light, .5)

                    }}>
                    <Avatar src={'/image.png'} alt={"GB"} />
                    {isOpen &&
                        <Box>
                            <Typography variant='h5' color="primary" sx={{ color: primary.dark }}>{name}</Typography>
                            <Typography variant='h6' sx={{ color: success.dark }}>{role}</Typography>
                        </Box>
                    }
                </Box>
            </Drawer>
        </Fragment >
    )
}

export default SideDrawer;



