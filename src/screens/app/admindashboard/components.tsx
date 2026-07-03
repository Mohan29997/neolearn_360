import { Box, Typography, Chip } from '@mui/material';
import { TrendingUpRounded, TrendingDownRounded, BoltRounded } from '@mui/icons-material';
import { statCardStyles as scs, benchStatBoxStyles as bss, quickActionStyles as qas, fabStyles } from './DashboardComponents.styles';

export const StatCard = ({ icon, label, value, badge, accent }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge: { label: string; up: boolean | null };
  accent: string;
}) => (
  <Box sx={scs.card(accent)}>
    <Box sx={scs.topRow}>
      <Box sx={scs.iconBox(accent)}>{icon}</Box>
      {badge.up === null ? (
        <Chip label={badge.label} size="small" sx={scs.stableChip} />
      ) : badge.up ? (
        <Box sx={scs.upBadge}>
          <TrendingUpRounded sx={{ fontSize: 14 }} />
          <Typography sx={{ fontSize: 11, fontWeight: 700 }}>{badge.label}</Typography>
        </Box>
      ) : (
        <Box sx={scs.downBadge}>
          <TrendingDownRounded sx={{ fontSize: 14 }} />
          <Typography sx={{ fontSize: 11, fontWeight: 700 }}>{badge.label}</Typography>
        </Box>
      )}
    </Box>
    <Typography sx={scs.label}>{label}</Typography>
    <Typography sx={scs.value}>{value}</Typography>
  </Box>
);

export const BenchStatBox = ({ label, value, loading, highlight }: {
  label: string;
  value: number;
  loading: boolean;
  highlight: boolean;
}) => (
  <Box sx={bss.box(highlight)}>
    <Typography sx={bss.label(highlight)}>{label}</Typography>
    <Typography sx={bss.value(highlight)}>{loading ? '—' : value}</Typography>
    <Typography sx={bss.subLabel}>Employees</Typography>
  </Box>
);

export const QuickActionCard = ({ icon, title, sub, onClick }: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  onClick: () => void;
}) => (
  <Box onClick={onClick} sx={qas.card}>
    <Box sx={qas.iconBox}>{icon}</Box>
    <Box>
      <Typography sx={qas.title}>{title}</Typography>
      <Typography sx={qas.sub}>{sub}</Typography>
    </Box>
  </Box>
);

export const DashboardFAB = () => (
  <Box sx={fabStyles.root}>
    <BoltRounded sx={{ color: '#fff', fontSize: 22 }} />
  </Box>
);

export function getRelativeTime(dateStr: string): string {
  if (!dateStr) return 'Recently';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} minute${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}
