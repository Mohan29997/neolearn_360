import { Fragment, useState, type MouseEvent } from 'react';
import { Box, useTheme, Avatar, Typography, IconButton, Divider, Stack, MenuItem, Popover } from '@mui/material'
import { DashboardRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
// import { setUserId } from '../../store/reducer/InitialUser';
import UserLogout from './userlogout';
import { StorageManager } from '../../storagemanager';
import type { RootState } from '../../store';
import { useAppSelector } from '../../hooks/useAppSelector';

const UserSection = () => {
  const Navigate = useNavigate();
  const { name, role } = useAppSelector((state: RootState) => state.adminProfile);
  const { palette: { primary, common, } } = useTheme();
  const [open, setOpen] = useState<HTMLButtonElement | null>(null);

  const handleClose = () => {
    setOpen(null);
  };

  const onLogout = () => {
    StorageManager.removeItems();
    sessionStorage.clear();
    handleClose()
  };

  return (
    <Box sx={{ gap: 1, display: "flex", flexDirection: "row", alignItems: "center" }}>
      <Box sx={{  }}>
        <Typography variant="h6" sx={{ fontWeight: 700, textAlign: "end" }}>{name || "Neo Learn 360"}</Typography>
        <Typography variant="caption" sx={{ fontWeight: 600, textAlign: "end" }}>{role || "Neo Learn 360"}</Typography>
      </Box>
      <Avatar
        src={"/profileImage.png"}
        alt={name.charAt(0)}
        sx={{
          // color: primary?.main,
          width: "36px",
          height: "36px",
          border: `1px solid ${primary?.light}`,
          transition: "ease-in-out 0.3s"
        }} />
    </Box>
  )
}

export default UserSection;