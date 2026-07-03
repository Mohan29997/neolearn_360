import { Box, Typography } from '@mui/material';
import { benchStyles as bs } from './BenchOnboarding.styles';
import type { BenchStatCardProps } from './BenchOnboarding.types';

const BenchStatCard = ({ label, value, sub, accent }: BenchStatCardProps) => (
  <Box sx={bs.statCard(accent)}>
    <Typography sx={bs.statLabel}>{label}</Typography>
    <Box sx={bs.statValueRow}>
      <Typography sx={bs.statValue}>{value}</Typography>
      <Typography sx={bs.statSub}>{sub}</Typography>
    </Box>
  </Box>
);

export default BenchStatCard;
