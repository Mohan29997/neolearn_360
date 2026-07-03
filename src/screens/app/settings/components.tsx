import { Box, Typography, Paper } from '@mui/material';
import {
  StarRounded, WhatshotRounded, EmojiEventsRounded,
  WorkspacePremiumRounded, LockRounded,
} from '@mui/icons-material';
import { BRAND } from '../../../constants/brand.constants';

export const SettingsStatCard = ({ icon, value, label }: { icon: React.ReactNode; value: number | string; label: string }) => (
  <Paper elevation={0} sx={{ flex: 1, border: '1px solid', borderColor: 'grey.200', borderRadius: '14px', p: 3, textAlign: 'center' }}>
    <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: BRAND.redBg, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
      {icon}
    </Box>
    <Typography sx={{ fontSize: 32, fontWeight: 800, color: 'grey.900', lineHeight: 1 }}>{value}</Typography>
    <Typography sx={{ fontSize: 12, color: 'grey.500', mt: 0.5 }}>{label}</Typography>
  </Paper>
);

export const ACHIEVEMENTS = [
  { icon: <StarRounded sx={{ fontSize: 22, color: BRAND.red }} />, label: 'Fast Learner' },
  { icon: <WhatshotRounded sx={{ fontSize: 22, color: BRAND.red }} />, label: '7 Day Streak' },
  { icon: <EmojiEventsRounded sx={{ fontSize: 22, color: BRAND.red }} />, label: 'Top 10%' },
  { icon: <WorkspacePremiumRounded sx={{ fontSize: 22, color: BRAND.red }} />, label: 'Mentor Badge' },
  { icon: <LockRounded sx={{ fontSize: 22, color: '#ccc' }} />, label: 'Locked' },
];
