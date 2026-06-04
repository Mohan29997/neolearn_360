import { Fragment, useState, type MouseEvent } from 'react';
import { Box, useTheme, Avatar, Typography, IconButton, Divider, Stack, MenuItem, Popover } from '@mui/material'
import { DashboardRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
// import { setUserId } from '../../store/reducer/InitialUser';
import UserLogout from './userlogout';
import { StorageManager } from '../../storagemanager';

const UserSection = () => {
  const Navigate = useNavigate();
  const { palette: { primary, common, } } = useTheme();
  const [open, setOpen] = useState<HTMLButtonElement | null>(null);

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const onLogout = () => {
    StorageManager.removeItems();
    sessionStorage.clear();
    handleClose()
  };

  return (
    <Fragment>
      <IconButton
        onClick={handleOpen}
        sx={{ background: primary?.light, borderRadius: "50%", }}
      >
        <Avatar
          src={"/profileImage.png"}
          alt={"GB"}
          sx={{
            // color: primary?.main,
            width: "36px",
            height: "36px",
            border: `1px solid ${primary?.light}`,
            transition: "ease-in-out 0.3s"
          }} />
      </IconButton>

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
            Govinda Biswas
          </Typography>
          <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", }}>
            DM
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