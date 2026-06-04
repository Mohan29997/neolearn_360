import { CloseRounded } from "@mui/icons-material";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import { ErrorRounded, WarningRounded, PrivacyTipRounded, CheckCircleRounded } from '@mui/icons-material';
import { closeSnackbar, type SnackbarKey, type SnackbarMessage } from "notistack";

export default function SnackBar(key: SnackbarKey, message: SnackbarMessage, variant = 'default') {
  const { shape: { borderRadius }, palette: { primary, info, error, success, warning, common } } = useTheme();

  const borderColor = () => {
    // var color;
    switch (variant) {
      case "success":
        return /* color = */ success?.main;
      case "info":
        return /* color = */ info?.main;
      case "warning":
        return /* color = */ warning?.main;
      case "error":
        return /* color = */ error?.main;
      default:
        return /* color = */ primary?.main;
    }
  }
  const notificationIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircleRounded sx={{ fontSize: "18px", color: common.white}} />;
      case "info":
        return <PrivacyTipRounded sx={{ fontSize: "18px", color: common.white}} />;
      case "warning":
        return <WarningRounded sx={{ fontSize: "18px", color: common.white}} />;
      case "error":
        return <ErrorRounded sx={{ fontSize: "18px", color: common.white}} />;
      default:
      return <></>;
    }
  };

  return (
    <Paper sx={{ maxWidth: 350, padding: '10px', borderRadius: `${Number(borderRadius)}px`, backgroundColor: borderColor() }}>
      <Box onClick={() => closeSnackbar(key)} sx={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: "10px" }}>
          {notificationIcon()}
          <Typography variant="caption" color={common.white}>{message}</Typography>
        </Box>
          <CloseRounded sx={{ fontSize: "18px", color: common.white}} />
      </Box>
    </Paper>
  )
}