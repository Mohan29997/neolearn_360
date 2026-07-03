import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../../store';
import {
  Box, Typography, Button, Avatar, LinearProgress, Chip, CircularProgress,
} from '@mui/material';
import {
  SchoolRounded, CheckCircleRounded, AccessTimeRounded,
  PlayArrowRounded, RouteRounded, OpenInNewRounded,
  MenuBookRounded, EmojiEventsRounded, HourglassTopRounded,
} from '@mui/icons-material';
import { appnavigationpath } from '../../../navigation/appnavigation/apppath';
import TabTitle from '../../../components/tabtitle';
import { StatCard, QuickActionCard } from './components';
import { useEmployeeDashboard } from '../../../features/dashboard/hooks/useEmployeeDashboard';
import { BRAND, SURFACE, STATUS_COLORS, ACCENT_COLORS } from '../../../constants/brand.constants';
import type { IAssignment } from '../../../types/course.types';

function getCourseTitle(a: IAssignment): string {
  if (typeof a.course_id === 'object' && a.course_id) {
    return a.course_id.course_title ?? a.course_id.title ?? a.course_title ?? 'Course';
  }
  return a.course_title ?? 'Course';
}

function getMentorName(a: IAssignment): string | null {
  if (typeof a.mentor_id === 'object' && a.mentor_id) {
    return (a.mentor_id as { name?: string }).name ?? null;
  }
  return a.mentor_name ?? null;
}

const EmployeeDashboard = () => {
  const { name, role, department } = useSelector((state: RootState) => state.adminProfile);
  const navigate = useNavigate();
  const { assignments, loading, lastUpdated, total, completed, inProgress, completionPct } =
    useEmployeeDashboard();

  const roleLabel = role === 'EMPLOYEE' ? 'Employee' : role ?? 'Employee';

  return (
    <Fragment>
      <TabTitle title="My Dashboard" />
      <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: SURFACE.page }}>

        {/* Welcome Banner */}
        <Box sx={{ bgcolor: SURFACE.card, border: `1px solid ${SURFACE.border}`, borderRadius: '12px', p: 3, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 52, height: 52, bgcolor: BRAND.red, fontWeight: 800, fontSize: 20 }}>
              {name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: 22, fontWeight: 800, color: 'grey.900' }}>
                Hi, {name || 'there'} 👋
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.4 }}>
                <Chip label={roleLabel} size="small" sx={{ bgcolor: BRAND.redBg, color: BRAND.red, fontWeight: 700, fontSize: 11, border: `1px solid ${BRAND.redBorder}` }} />
                {department && <Chip label={department} size="small" sx={{ bgcolor: SURFACE.muted, color: 'grey.600', fontWeight: 600, fontSize: 11 }} />}
                <Typography sx={{ fontSize: 12, color: 'grey.400' }}>Keep up the great work!</Typography>
              </Box>
            </Box>
          </Box>
          <Button variant="contained" startIcon={<PlayArrowRounded />} onClick={() => navigate(appnavigationpath.courserequests)}
            sx={{ textTransform: 'none', fontSize: 13, fontWeight: 600, bgcolor: BRAND.red, borderRadius: '8px', '&:hover': { bgcolor: BRAND.redDark } }}>
            Continue Learning
          </Button>
        </Box>

        {/* Stat Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3, '@media (max-width:900px)': { gridTemplateColumns: 'repeat(2,1fr)' } }}>
          <StatCard icon={<MenuBookRounded />} label="ASSIGNED COURSES" value={loading ? '—' : String(total)} badge={{ label: 'Total', up: null }} accent={ACCENT_COLORS.blue} />
          <StatCard icon={<CheckCircleRounded />} label="COMPLETED" value={loading ? '—' : String(completed)} badge={{ label: 'Done', up: null }} accent={ACCENT_COLORS.green} />
          <StatCard icon={<HourglassTopRounded />} label="IN PROGRESS" value={loading ? '—' : String(inProgress)} badge={{ label: 'Active', up: null }} accent={ACCENT_COLORS.amber} />
          <StatCard icon={<EmojiEventsRounded />} label="COMPLETION RATE" value={loading ? '—' : `${completionPct}%`} badge={{ label: completionPct >= 50 ? '+Good' : 'Keep going', up: completionPct >= 50 }} accent={BRAND.red} />
        </Box>

        {/* My Courses + Quick Links */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 2, mb: 3, '@media (max-width:800px)': { gridTemplateColumns: '1fr' } }}>

          <Box sx={{ bgcolor: SURFACE.card, border: `1px solid ${SURFACE.border}`, borderRadius: '12px', p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 15, color: 'grey.900' }}>My Courses</Typography>
              <Typography onClick={() => navigate(appnavigationpath.courserequests)}
                sx={{ fontSize: 13, fontWeight: 600, color: BRAND.red, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                View All
              </Typography>
            </Box>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress size={28} sx={{ color: BRAND.red }} /></Box>
            ) : assignments.length === 0 ? (
              <Box sx={{ py: 5, textAlign: 'center' }}>
                <SchoolRounded sx={{ fontSize: 40, color: 'grey.200', mb: 1 }} />
                <Typography sx={{ fontSize: 13, color: 'grey.400' }}>No courses assigned yet.</Typography>
              </Box>
            ) : assignments.slice(0, 5).map((a, i) => {
              const courseTitle = getCourseTitle(a);
              const mentor = getMentorName(a);
              const status = a.status ?? 'assigned';
              const sc = status === 'completed'
                ? STATUS_COLORS.completed
                : status === 'in_progress'
                ? STATUS_COLORS.in_progress
                : STATUS_COLORS.assigned;
              const pct = status === 'completed' ? 100 : status === 'in_progress' ? 50 : 0;
              return (
                <Box key={i} sx={{ mb: 2.5, pb: 2.5, borderBottom: i < Math.min(assignments.length, 5) - 1 ? `1px solid ${SURFACE.muted}` : 'none' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                    <Box>
                      <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: 'grey.900' }}>{courseTitle}</Typography>
                      {mentor && <Typography sx={{ fontSize: 11.5, color: 'grey.500', mt: 0.2 }}>Mentor: {mentor}</Typography>}
                    </Box>
                    <Chip label={status.replace('_', ' ')} size="small"
                      sx={{ bgcolor: sc.bg, color: sc.color, fontWeight: 700, fontSize: 10, textTransform: 'capitalize', border: `1px solid ${sc.color}30` }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress variant="determinate" value={pct} sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: SURFACE.muted, '& .MuiLinearProgress-bar': { bgcolor: sc.color, borderRadius: 3 } }} />
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: 'grey.500', minWidth: 30 }}>{pct}%</Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>

          <Box sx={{ bgcolor: SURFACE.card, border: `1px solid ${SURFACE.border}`, borderRadius: '12px', p: 3 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 15, color: 'grey.900', mb: 2.5 }}>Quick Links</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <QuickActionCard icon={<MenuBookRounded sx={{ fontSize: 20, color: BRAND.red }} />} title="My Courses" sub="View all assigned courses" onClick={() => navigate(appnavigationpath.courserequests)} />
              <QuickActionCard icon={<RouteRounded sx={{ fontSize: 20, color: BRAND.red }} />} title="Learning Journeys" sub="Explore structured paths" onClick={() => navigate(appnavigationpath.learningjourneys)} />
              <QuickActionCard icon={<SchoolRounded sx={{ fontSize: 20, color: BRAND.red }} />} title="Course Catalog" sub="Browse available courses" onClick={() => navigate(appnavigationpath.courses)} />
              <QuickActionCard icon={<OpenInNewRounded sx={{ fontSize: 20, color: BRAND.red }} />} title="Assigned Mentors" sub="View mentor details" onClick={() => navigate(appnavigationpath.courserequests)} />
            </Box>
          </Box>
        </Box>

        {/* Progress Overview */}
        <Box sx={{ bgcolor: SURFACE.card, border: `1px solid ${SURFACE.border}`, borderRadius: '12px', p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 15, color: 'grey.900' }}>Overall Learning Progress</Typography>
            <AccessTimeRounded sx={{ fontSize: 18, color: 'grey.400' }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'grey.700' }}>Completion Progress</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: BRAND.red }}>{completionPct}%</Typography>
            </Box>
            <LinearProgress variant="determinate" value={completionPct} sx={{ height: 10, borderRadius: 5, bgcolor: SURFACE.muted, '& .MuiLinearProgress-bar': { bgcolor: BRAND.red, borderRadius: 5 } }} />
            <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
              {[
                { color: ACCENT_COLORS.green, label: `Completed (${completed})` },
                { color: ACCENT_COLORS.blue, label: `In Progress (${inProgress})` },
                { color: ACCENT_COLORS.amber, label: `Pending (${total - completed - inProgress})` },
              ].map(({ color, label }) => (
                <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color }} />
                  <Typography sx={{ fontSize: 12, color: 'grey.600' }}>{label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 2, gap: 0.5 }}>
          <AccessTimeRounded sx={{ fontSize: 12, color: 'grey.400' }} />
          <Typography sx={{ fontSize: 11, color: 'grey.400' }}>
            Last updated: {lastUpdated.toLocaleTimeString()} · Auto-refreshes every 30s
          </Typography>
        </Box>
      </Box>
    </Fragment>
  );
};

export default EmployeeDashboard;
