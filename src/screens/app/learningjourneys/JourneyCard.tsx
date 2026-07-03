import { Box, Typography, Chip, LinearProgress } from '@mui/material';
import { PersonRounded, CalendarTodayRounded, RouteRounded } from '@mui/icons-material';
import type { ILearningJourney } from '../../../types/course.types';
import { BRAND, SURFACE } from '../../../constants/brand.constants';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  in_progress: { label: 'In Progress', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  completed:   { label: 'Completed',   color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
  not_started: { label: 'Not Started', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
};

const fmt = (d: string) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

interface JourneyCardProps {
  journey: ILearningJourney;
  onClick: () => void;
}

const ProgressBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
      <Typography sx={{ fontSize: 11, fontWeight: 600, color: 'grey.500', textTransform: 'uppercase', letterSpacing: 0.4 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 11, fontWeight: 700, color }}>
        {value}%
      </Typography>
    </Box>
    <LinearProgress
      variant="determinate"
      value={value}
      sx={{
        height: 6, borderRadius: 3,
        bgcolor: SURFACE.muted,
        '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 3 },
      }}
    />
  </Box>
);

const JourneyCard = ({ journey, onClick }: JourneyCardProps) => {
  const sc = STATUS_CONFIG[journey.status] ?? STATUS_CONFIG.not_started;
  const initials = journey.employeeName
    ? journey.employeeName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <Box onClick={onClick} sx={{
      bgcolor: SURFACE.card,
      border: `1px solid ${SURFACE.border}`,
      borderRadius: '14px',
      p: 2.5,
      mb: 2,
      cursor: 'pointer',
      transition: 'box-shadow 0.2s, border-color 0.2s',
      '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.09)', borderColor: BRAND.red },
    }}>
      {/* Top row: employee info + status */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flex: 1, minWidth: 0 }}>
          <Box sx={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
            bgcolor: BRAND.redBg, color: BRAND.red,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 15,
          }}>
            {initials}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 15, color: 'grey.900' }}>{journey.employeeName}</Typography>
              <Typography sx={{ fontSize: 12, color: 'grey.400' }}>{journey.employeeEmail}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.3 }}>
              <RouteRounded sx={{ fontSize: 14, color: BRAND.red, flexShrink: 0 }} />
              <Typography sx={{ fontWeight: 600, fontSize: 13.5, color: 'grey.700' }}>{journey.programName}</Typography>
            </Box>
            <Typography sx={{ fontSize: 12, color: 'grey.400' }}>
              Assigned by <strong style={{ color: '#6B7280' }}>{journey.assignedByName}</strong>
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, flexShrink: 0 }}>
          <Chip
            label={sc.label} size="small"
            sx={{ fontWeight: 700, fontSize: 12, bgcolor: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarTodayRounded sx={{ fontSize: 12, color: 'grey.400' }} />
              <Typography sx={{ fontSize: 11.5, color: 'grey.500' }}>
                Start: <strong>{fmt(journey.startDate)}</strong>
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarTodayRounded sx={{ fontSize: 12, color: journey.status === 'completed' ? '#16A34A' : 'grey.400' }} />
              <Typography sx={{ fontSize: 11.5, color: journey.status === 'completed' ? '#16A34A' : 'grey.500' }}>
                {journey.status === 'completed' ? 'Completed: ' : 'Due: '}
                <strong>{fmt(journey.status === 'completed' ? (journey.completedAt ?? '') : journey.dueDate)}</strong>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Progress bars */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, pt: 2, borderTop: `1px solid ${SURFACE.border}` }}>
        <ProgressBar label="Journey Progress" value={journey.progressPercent} color={BRAND.red} />
        <ProgressBar label="Level Progress" value={journey.progressLevel} color="#2563EB" />
      </Box>
    </Box>
  );
};

export default JourneyCard;
