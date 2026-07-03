import { Box, Typography, Chip, Modal, IconButton, LinearProgress } from '@mui/material';
import {
  CloseRounded, RouteRounded, PersonRounded,
  CalendarTodayRounded, CheckCircleRounded, AccessTimeRounded,
} from '@mui/icons-material';
import type { ILearningJourney } from '../../../types/course.types';
import { BRAND, SURFACE } from '../../../constants/brand.constants';

interface CourseDetailModalProps {
  journey: ILearningJourney | null;
  open: boolean;
  onClose: () => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  in_progress: { label: 'In Progress', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  completed:   { label: 'Completed',   color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
  not_started: { label: 'Not Started', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
};

const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1.5, borderBottom: `1px solid ${SURFACE.border}` }}>
    <Box sx={{ color: 'grey.400', mt: 0.2, flexShrink: 0 }}>{icon}</Box>
    <Box>
      <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'grey.400', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</Typography>
      <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'grey.900', mt: 0.2 }}>{value}</Typography>
    </Box>
  </Box>
);

const ProgressRow = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
      <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'grey.500', textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</Typography>
      <Typography sx={{ fontSize: 12, fontWeight: 800, color }}>{value}%</Typography>
    </Box>
    <LinearProgress variant="determinate" value={value} sx={{
      height: 8, borderRadius: 4, bgcolor: SURFACE.muted,
      '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 4 },
    }} />
  </Box>
);

const CourseDetailModal = ({ journey, open, onClose }: CourseDetailModalProps) => {
  if (!journey) return null;
  const sc = STATUS_CONFIG[journey.status] ?? STATUS_CONFIG.not_started;
  const initials = journey.employeeName
    ? journey.employeeName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        bgcolor: SURFACE.card, borderRadius: '20px',
        width: { xs: '95vw', sm: 500 },
        outline: 'none', boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2.5, borderBottom: `1px solid ${SURFACE.border}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: BRAND.redBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RouteRounded sx={{ color: BRAND.red, fontSize: 18 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 16, color: 'grey.900', lineHeight: 1.2 }}>Journey Details</Typography>
              <Typography sx={{ fontSize: 12, color: 'grey.400' }}>Learning program assignment</Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={onClose}><CloseRounded /></IconButton>
        </Box>

        {/* Body */}
        <Box sx={{ p: 3 }}>
          {/* Employee card */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5, p: 2, borderRadius: '12px', bgcolor: SURFACE.rowHeader, border: `1px solid ${SURFACE.border}` }}>
            <Box sx={{
              width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
              bgcolor: BRAND.redBg, color: BRAND.red,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 18,
            }}>
              {initials}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 16, color: 'grey.900' }}>{journey.employeeName}</Typography>
              <Typography sx={{ fontSize: 12.5, color: 'grey.500' }}>{journey.employeeEmail}</Typography>
            </Box>
            <Chip label={sc.label} size="small"
              sx={{ fontWeight: 700, fontSize: 12, bgcolor: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }} />
          </Box>

          {/* Progress bars */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2.5, p: 2, borderRadius: '12px', bgcolor: SURFACE.rowHeader, border: `1px solid ${SURFACE.border}` }}>
            <ProgressRow label="Journey Progress" value={journey.progressPercent} color={BRAND.red} />
            <ProgressRow label="Level Progress" value={journey.progressLevel} color="#2563EB" />
          </Box>

          {/* Info rows */}
          <InfoRow icon={<RouteRounded sx={{ fontSize: 18 }} />} label="Learning Program" value={journey.programName} />
          <InfoRow icon={<PersonRounded sx={{ fontSize: 18 }} />} label="Assigned By" value={journey.assignedByName} />
          <InfoRow icon={<CalendarTodayRounded sx={{ fontSize: 18 }} />} label="Start Date" value={fmt(journey.startDate)} />
          <InfoRow icon={<AccessTimeRounded sx={{ fontSize: 18 }} />} label="Due Date" value={fmt(journey.dueDate)} />
          {journey.completedAt && (
            <InfoRow icon={<CheckCircleRounded sx={{ fontSize: 18, color: '#16A34A' }} />} label="Completed On" value={fmt(journey.completedAt)} />
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default CourseDetailModal;
