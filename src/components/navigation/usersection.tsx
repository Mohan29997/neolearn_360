import { Fragment, useState, type MouseEvent } from 'react';
import { Box, useTheme, Avatar, Typography, Divider, Stack, MenuItem, Popover } from '@mui/material'
import { DashboardRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import UserLogout from './userlogout';
import { StorageManager } from '../../storagemanager';
import { setIsLogin } from '../../store/reducer/AuthHelper';
import { resetProfile } from '../../store/reducer/AdminProfile';
import { useAppSelector } from '../../hooks/useAppSelector';

const UserSection = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const { palette: { primary, common, } } = useTheme();
  const [open, setOpen] = useState<HTMLElement | null>(null);
  const profile = useAppSelector((state) => state.adminProfile);

  const handleOpen = (event: MouseEvent<HTMLDivElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const onLogout = () => {
    StorageManager.removeItems();
    sessionStorage.clear();
    dispatch(setIsLogin({ isLogin: false }));
    dispatch(resetProfile());
    handleClose();
  };

  return (
    <Fragment>
      <Avatar
        onClick={handleOpen}
        sx={{
          width: 38,
          height: 38,
          bgcolor: primary?.main,
          cursor: 'pointer',
          fontSize: '15px',
          fontWeight: 700,
        }}
      >
        {profile?.name ? profile.name.charAt(0).toUpperCase() : 'A'}
      </Avatar>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          width: "250px",
        }}
      >
        <Box sx={{
          width: "14px",
          height: "14px",
          position: "absolute",
          borderBottomLeftRadius: "3.5px",
          clipPath: "polygon(0% 0%, 100% 100%, 0% 100%)",
          border: "1px solid rgba(145, 158, 171, 0.12)",
          backdropFilter: "blur(6px)",
          backgroundColor: common.white,
          top: "-6.5px",
          transform: "rotate(135deg)",
          right: "10px",
        }} />

        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant='h5' noWrap sx={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", color: "#212B36" }}>
            {profile?.name || 'Admin User'}
          </Typography>
          <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", }}>
            {profile?.role?.replace('_', ' ') || ''}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />
        <Stack sx={{ display: "flex", flexDirection: "column", padding: "8px" }}>
          {MENU_OPTIONS().map((option) => (
            <MenuItem key={option?.label} onClick={() => { Navigate(option?.route); handleClose() }} sx={{ marginBottom: "4px", gap: "10px" }}>
              {option?.icon()}
              <Typography variant='h6' sx={{ fontWeight: 400, }}>{option?.label}</Typography>
            </MenuItem>
          ))}
        </Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />

        <UserLogout onLogout={onLogout} />
      </Popover>
    </Fragment>
  )
}

export default UserSection

const MENU_OPTIONS = () => [
  {
    label: 'Home',
    route: '/',
    icon: () => {
      return (
        <DashboardRounded fontSize="small" />
      )
    },
  },

];