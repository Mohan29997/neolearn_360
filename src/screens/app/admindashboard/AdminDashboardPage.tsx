import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, LinearProgress, Chip, CircularProgress,
} from '@mui/material';
import {
  PeopleAltRounded, SchoolRounded, DirectionsRunRounded, CheckCircleRounded,
  AccessTimeRounded, PersonAddRounded, ApartmentRounded,
  StorageRounded, PlayArrowRounded, RouteRounded,
} from '@mui/icons-material';
import { appnavigationpath } from '../../../navigation/appnavigation/apppath';
import TabTitle from '../../../components/tabtitle';
import { StatCard, BenchStatBox, QuickActionCard } from './components';
import EmployeeDashboard from './EmployeeDashboard';
import { useAdminDashboardPage } from './AdminDashboard.hook';
import { BRAND, SURFACE, ACCENT_COLORS } from '../../../constants/brand.constants';
import { dashboardStyles as ds } from './AdminDashboard.styles';
import { STAT_CARD_LABELS } from './AdminDashboard.constants';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const {
    name, isSuperAdmin, isAdmin, isManager, isEmployee,
    roleLabel, welcomeSub, data, loading, lastUpdated,
  } = useAdminDashboardPage();

  if (isEmployee) return <EmployeeDashboard />;

  return (
    <Fragment>
      <TabTitle title="Dashboard" />
      <Box sx={ds.page}>

        <Box sx={ds.welcomeBanner}>
          <Box>
            <Typography sx={{ fontSize: 22, fontWeight: 800, color: 'grey.900' }}>
              Welcome back, {name || roleLabel}
            </Typography>
            <Typography sx={{ fontSize: 13, color: 'grey.500', mt: 0.5 }}>{welcomeSub}</Typography>
          </Box>
          <Box sx={ds.headerBtnRow}>
            <Chip icon={<StorageRounded sx={ds.systemChipIcon} />} label="SYSTEM STATUS: STABLE" sx={ds.systemChip} />
            {isSuperAdmin && (
              <>
                <Button variant="outlined" sx={ds.outlinedBtn}>System Logs</Button>
                <Button variant="contained" startIcon={<PlayArrowRounded />} sx={ds.containedBtn}>Run Diagnostic</Button>
              </>
            )}
            {(isAdmin || isManager) && (
              <Button variant="contained" startIcon={<PersonAddRounded />}
                onClick={() => navigate(appnavigationpath.users)} sx={ds.containedBtn}>
                {isManager ? 'View Team' : 'Add User'}
              </Button>
            )}
          </Box>
        </Box>

        <Box sx={ds.statGrid}>
          <StatCard icon={<PeopleAltRounded />} label={STAT_CARD_LABELS.users(isManager)} value={loading ? '—' : data?.totalUsers.toLocaleString() ?? '—'} badge={{ label: '+12%', up: true }} accent={ACCENT_COLORS.blue} />
          <StatCard icon={<SchoolRounded />} label={STAT_CARD_LABELS.programs} value={loading ? '—' : String(data?.activePrograms ?? '—')} badge={{ label: 'STABLE', up: null }} accent={ACCENT_COLORS.green} />
          <StatCard icon={<DirectionsRunRounded />} label={STAT_CARD_LABELS.bench} value={loading ? '—' : String(data?.benchCount ?? '—')} badge={{ label: '-4%', up: false }} accent={ACCENT_COLORS.amber} />
          <StatCard icon={<CheckCircleRounded />} label={STAT_CARD_LABELS.completion} value={loading ? '—' : `${data?.completionRate ?? 0}%`} badge={{ label: '+8%', up: true }} accent={BRAND.red} />
          <StatCard icon={<RouteRounded />} label={STAT_CARD_LABELS.journeys} value={loading ? '—' : String(data?.learningJourneys ?? '—')} badge={{ label: 'ACTIVE', up: null }} accent={ACCENT_COLORS.blue} />
        </Box>

        <Box sx={ds.twoColGrid}>
          <Box sx={ds.card}>
            <Box sx={ds.cardHeader}>
              <Typography sx={ds.cardTitle}>Department Performance</Typography>
              <Typography onClick={() => navigate(appnavigationpath.departments)} sx={ds.viewReportLink}>View Detailed Report</Typography>
            </Box>
            {loading ? (
              <Box sx={ds.loadingCenter}><CircularProgress size={28} sx={ds.loadingSpinner} /></Box>
            ) : (
              data?.departments.map(dept => (
                <Box key={dept.name} sx={ds.deptRow}>
                  <Box sx={ds.deptRowHeader}>
                    <Typography sx={ds.deptName}>{dept.name}</Typography>
                    <Typography sx={ds.deptPct}>{dept.completion}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={dept.completion} sx={ds.deptBar} />
                </Box>
              ))
            )}
          </Box>

          <Box sx={ds.card}>
            <Box sx={ds.cardHeader}>
              <Typography sx={ds.cardTitle}>Recent Activity</Typography>
              <AccessTimeRounded sx={{ fontSize: 18, color: 'grey.400' }} />
            </Box>
            {loading ? (
              <Box sx={ds.loadingCenter}><CircularProgress size={28} sx={ds.loadingSpinner} /></Box>
            ) : (
              data?.recentActivity.map((item, i) => (
                <Box key={i} sx={ds.activityItem}>
                  <Box sx={ds.activityDot} />
                  <Box>
                    <Typography sx={ds.activityText}>{item.text} <strong>{item.bold}</strong></Typography>
                    <Typography sx={ds.activityTime}>{item.time}</Typography>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Box>

        <Box sx={{ ...ds.twoColGridBottom, mt: 3 }}>
          <Box sx={ds.card}>
            <Box sx={ds.cardHeader}>
              <Typography sx={ds.cardTitle}>Learning Journeys</Typography>
              <Typography onClick={() => navigate(appnavigationpath.learningjourneys)} sx={ds.viewReportLink}>View All</Typography>
            </Box>
            {loading ? (
              <Box sx={ds.loadingCenter}><CircularProgress size={28} sx={ds.loadingSpinner} /></Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderRadius: '10px', bgcolor: BRAND.redBg, border: `1px solid ${BRAND.redBorder}` }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <RouteRounded sx={{ color: BRAND.red, fontSize: 22 }} />
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 14, color: 'grey.900' }}>Active Learning Paths</Typography>
                      <Typography sx={{ fontSize: 12, color: 'grey.500' }}>Structured multi-course journeys in progress</Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: 28, color: BRAND.red, lineHeight: 1 }}>{data?.learningJourneys ?? 0}</Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                  <Box sx={{ p: 1.5, borderRadius: '10px', border: `1px solid ${SURFACE.border}`, bgcolor: SURFACE.rowHeader }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'grey.500', textTransform: 'uppercase', letterSpacing: 0.5 }}>In Progress</Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: 22, color: 'grey.900', mt: 0.5 }}>{data?.learningJourneys ?? 0}</Typography>
                  </Box>
                  <Box sx={{ p: 1.5, borderRadius: '10px', border: `1px solid ${SURFACE.border}`, bgcolor: SURFACE.rowHeader }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'grey.500', textTransform: 'uppercase', letterSpacing: 0.5 }}>Completion Rate</Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: 22, color: 'grey.900', mt: 0.5 }}>{data?.completionRate ?? 0}%</Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>

          <Box sx={ds.card}>
            <Typography sx={{ ...ds.cardTitle, mb: 2.5 }}>Quick Actions</Typography>
            <Box sx={ds.quickActionsCol}>
              {(isSuperAdmin || isAdmin) && <QuickActionCard icon={<PersonAddRounded sx={{ fontSize: 20, color: BRAND.red }} />} title="Add User" sub="Manual entry or CSV upload" onClick={() => navigate(appnavigationpath.users)} />}
              {(isSuperAdmin || isAdmin) && <QuickActionCard icon={<ApartmentRounded sx={{ fontSize: 20, color: BRAND.red }} />} title="Create Department" sub="Set structure and hierarchies" onClick={() => navigate(appnavigationpath.departments)} />}
              <QuickActionCard icon={<SchoolRounded sx={{ fontSize: 20, color: BRAND.red }} />} title="View Courses" sub="Browse available learning content" onClick={() => navigate(appnavigationpath.courses)} />
              {(isSuperAdmin || isAdmin) && <QuickActionCard icon={<RouteRounded sx={{ fontSize: 20, color: BRAND.red }} />} title="Learning Journeys" sub="View structured learning paths" onClick={() => navigate(appnavigationpath.learningjourneys)} />}
            </Box>
          </Box>
        </Box>

        <Box sx={ds.lastUpdatedRow}>
          <AccessTimeRounded sx={{ fontSize: 12, color: 'grey.400' }} />
          <Typography sx={ds.lastUpdatedText}>
            Last updated: {lastUpdated.toLocaleTimeString()} · Auto-refreshes every 30s
          </Typography>
        </Box>
      </Box>
    </Fragment>
  );
};

export default AdminDashboardPage;
