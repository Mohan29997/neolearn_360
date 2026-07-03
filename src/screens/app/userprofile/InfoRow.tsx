import { Box, Typography } from '@mui/material';
import { userProfileStyles as ups } from './UserProfile.styles';

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <Box sx={ups.infoRowRoot}>
    <Box sx={ups.infoRowIcon}>{icon}</Box>
    <Box>
      <Typography sx={ups.infoLabel}>{label}</Typography>
      <Typography sx={ups.infoValue}>{value || '—'}</Typography>
    </Box>
  </Box>
);

export default InfoRow;
