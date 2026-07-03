import { Fragment, useState } from 'react';
import {
  Box, Typography, Avatar, Chip, Divider, CircularProgress,
  Grid, Paper, Stack, Button,
} from '@mui/material';
import {
  BadgeRounded, EmailRounded, WorkRounded,
  CalendarTodayRounded, CodeRounded, VerifiedUserRounded, AccountTreeRounded,
} from '@mui/icons-material';
import TabTitle from '../../../components/tabtitle';
import { useProfile } from '../../../features/profile/hooks/useProfile';
import InfoRow from './InfoRow';
import { userProfileStyles as ups } from './UserProfile.styles';
import { BRAND } from '../../../constants/brand.constants';
import { service } from '../../../service';
import { HierarchyModal, normaliseNode } from '../../../components/OrgHierarchyTree';
import type { OrgNode } from '../../../components/OrgHierarchyTree';

const formatDate = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

const UserProfilePage = () => {
  const { profile, loading } = useProfile();
  const [orgTreeOpen, setOrgTreeOpen] = useState(false);
  const [orgTree, setOrgTree] = useState<OrgNode | null>(null);
  const [orgTreeLoading, setOrgTreeLoading] = useState(false);
  const [orgTreeError, setOrgTreeError] = useState('');
  const [orgTreeLoaded, setOrgTreeLoaded] = useState(false);

  const openHierarchy = () => {
    setOrgTreeOpen(true);
    if (orgTreeLoaded || orgTreeLoading) return;
    setOrgTreeLoading(true);
    setOrgTreeError('');
    service.getOrgTree()
      .then((res: unknown) => {
        const r = res as Record<string, unknown>;
        const raw = r?.data ?? r;
        const node = normaliseNode(Array.isArray(raw) ? raw[0] : raw);
        if (node) { setOrgTree(node); }
        else { setOrgTreeError('No hierarchy data returned from server.'); }
      })
      .catch(() => { setOrgTreeError('Failed to load hierarchy. Please try again.'); })
      .finally(() => { setOrgTreeLoading(false); setOrgTreeLoaded(true); });
  };

  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <Fragment>
      <TabTitle title="My Profile" />
      <Box sx={{ maxWidth: 860, mx: 'auto' }}>
        <Typography variant="h4" fontWeight={700} sx={ups.pageTitle}>My Profile</Typography>
        <Typography sx={ups.pageSub}>Your account details and information</Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: BRAND.red }} />
          </Box>
        ) : !profile ? (
          <Typography sx={{ color: 'grey.500', textAlign: 'center', py: 10 }}>Unable to load profile.</Typography>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={ups.avatarCard}>
                <Avatar sx={ups.avatar}>{initials}</Avatar>
                <Typography sx={ups.profileName}>{profile.name}</Typography>
                <Typography sx={ups.profileEmail}>{profile.email}</Typography>
                <Box sx={ups.chipsRow}>
                  <Chip label={profile.role.replace(/_/g, ' ')} size="small" sx={ups.roleChip} />
                  <Chip label={profile.isActive ? 'Active' : 'Inactive'} size="small"
                    sx={profile.isActive ? ups.activeChip : ups.inactiveChip} />
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<AccountTreeRounded sx={{ fontSize: 16 }} />}
                  onClick={openHierarchy}
                  sx={{
                    mt: 2, fontSize: 12, fontWeight: 600, textTransform: 'none',
                    borderColor: BRAND.red, color: BRAND.red, borderRadius: '8px',
                    '&:hover': { bgcolor: BRAND.redBg, borderColor: BRAND.red },
                  }}
                >
                  View Hierarchy
                </Button>
              </Paper>
            </Grid>

            <Grid item xs={12} md={8}>
              <Paper elevation={0} sx={ups.detailsCard}>
                <Typography sx={ups.sectionTitle}>Account Information</Typography>
                <Stack spacing={2.5}>
                  <InfoRow icon={<BadgeRounded sx={{ fontSize: 17 }} />} label="Employee ID" value={profile.employeeId} />
                  <InfoRow icon={<EmailRounded sx={{ fontSize: 17 }} />} label="Email Address" value={profile.email} />
                  <InfoRow icon={<WorkRounded sx={{ fontSize: 17 }} />} label="Department" value={profile.department ?? '—'} />
                  <InfoRow icon={<VerifiedUserRounded sx={{ fontSize: 17 }} />} label="Role" value={profile.role.replace(/_/g, ' ')} />
                </Stack>
                <Divider sx={{ my: 2.5, borderStyle: 'dashed' }} />
                <Typography sx={ups.sectionTitle}>Activity</Typography>
                <Stack spacing={2.5}>
                  <InfoRow icon={<CalendarTodayRounded sx={{ fontSize: 17 }} />} label="Member Since" value={formatDate(profile.createdAt)} />
                  <InfoRow icon={<CalendarTodayRounded sx={{ fontSize: 17 }} />} label="Last Updated" value={formatDate(profile.updatedAt)} />
                </Stack>
              </Paper>
            </Grid>

            {profile.technologies?.length > 0 && (
              <Grid item xs={12}>
                <Paper elevation={0} sx={ups.techCard}>
                  <Box sx={ups.techHeader}>
                    <CodeRounded sx={{ fontSize: 18, color: 'grey.500' }} />
                    <Typography sx={{ fontWeight: 700, fontSize: 14, color: 'grey.700' }}>Technologies</Typography>
                  </Box>
                  <Box sx={ups.techChipBox}>
                    {profile.technologies.map(tech => (
                      <Chip key={tech} label={tech} size="small" sx={ups.techChip} />
                    ))}
                  </Box>
                </Paper>
              </Grid>
            )}
          </Grid>
        )}
      </Box>

      <HierarchyModal
        open={orgTreeOpen}
        onClose={() => setOrgTreeOpen(false)}
        loading={orgTreeLoading}
        error={orgTreeError}
        tree={orgTree}
        onRetry={() => { setOrgTreeLoaded(false); openHierarchy(); }}
      />
    </Fragment>
  );
};

export default UserProfilePage;
