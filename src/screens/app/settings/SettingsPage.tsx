import { Fragment, useState } from 'react';
import {
  Box, Typography, Avatar, Chip, CircularProgress,
  Paper, Stack, LinearProgress, OutlinedInput, Button, IconButton,
} from '@mui/material';
import {
  CheckCircleRounded, AccessTimeRounded, EmojiEventsRounded,
  EditRounded, SaveRounded, CloseRounded, ShareRounded,
  WorkspacePremiumRounded, BadgeRounded, AccountTreeRounded,
} from '@mui/icons-material';
import TabTitle from '../../../components/tabtitle';
import { useSettings } from '../../../features/settings/hooks/useSettings';
import { settingsStyles as ss } from './Settings.styles';
import { SettingsStatCard, ACHIEVEMENTS } from './components';
import type { IAssignment } from '../../../types/course.types';
import { BRAND } from '../../../constants/brand.constants';
import { service } from '../../../service';
import { HierarchyModal, normaliseNode } from '../../../components/OrgHierarchyTree';
import type { OrgNode } from '../../../components/OrgHierarchyTree';

const PROFILE_FIELDS = [
  { label: 'FULL NAME', key: 'name' as const, placeholder: 'Full name' },
  { label: 'CORPORATE EMAIL', key: 'email' as const, placeholder: 'Email' },
  { label: 'NEW PASSWORD', key: 'password' as const, placeholder: 'Leave blank to keep unchanged', type: 'password' as const },
];

const SettingsPage = () => {
  const { profile, loading, editing, saving, form, assignedCourses, setEditing, setForm, handleSave, cancelEdit } = useSettings();
  const [orgModalOpen, setOrgModalOpen] = useState(false);
  const [orgTree, setOrgTree] = useState<OrgNode | null>(null);
  const [orgTreeLoading, setOrgTreeLoading] = useState(false);
  const [orgTreeError, setOrgTreeError] = useState('');
  const [orgTreeLoaded, setOrgTreeLoaded] = useState(false);

  const openHierarchy = () => {
    setOrgModalOpen(true);
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

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
      <CircularProgress sx={{ color: BRAND.red }} />
    </Box>
  );

  if (!profile) return (
    <Typography sx={{ color: 'grey.500', textAlign: 'center', py: 10 }}>Unable to load profile.</Typography>
  );

  const initials = profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const completedCourses = assignedCourses.filter((c: IAssignment) => c.status === 'completed').length;
  const ongoingCourses = assignedCourses.filter((c: IAssignment) => c.status !== 'completed');

  return (
    <Fragment>
      <TabTitle title="User Profile" />

      <Box sx={ss.heroBanner}>
        <Box sx={ss.heroBg} />
        <Box sx={ss.heroProfileRow}>
          <Box sx={ss.heroInner}>
            <Box sx={ss.avatarWrapper}>
              <Avatar sx={ss.avatar}>{initials}</Avatar>
              {editing && (
                <Box sx={ss.editAvatarOverlay}>
                  <EditRounded sx={{ fontSize: 13, color: '#fff' }} />
                </Box>
              )}
            </Box>
            <Box sx={ss.profileInfo}>
              <Box sx={ss.profileNameRow}>
                <Typography sx={ss.profileName}>{profile.name}</Typography>
                <Chip label={profile.isActive ? 'Active' : 'Inactive'} size="small"
                  sx={profile.isActive ? ss.activeChip : ss.inactiveChip} />
              </Box>
              <Typography sx={ss.profileRole}>
                {profile.role.replace(/_/g, ' ')}
                {profile.department && <> &nbsp;·&nbsp; {profile.department}</>}
              </Typography>
            </Box>
            <Box sx={{ ...ss.exportBtnArea, display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Button startIcon={<ShareRounded sx={{ fontSize: 15 }} />} variant="outlined" size="small" sx={ss.exportBtn}>
                Export Profile
              </Button>
              <Button
                startIcon={<AccountTreeRounded sx={{ fontSize: 15 }} />}
                variant="contained"
                size="small"
                onClick={openHierarchy}
                sx={{
                  textTransform: 'none', fontWeight: 600, fontSize: 13,
                  borderRadius: '10px', bgcolor: BRAND.red, px: 2,
                  '&:hover': { bgcolor: BRAND.redDark },
                  boxShadow: 'none',
                }}
              >
                Hierarchy
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={ss.bodyGrid}>
        <Stack spacing={3}>
          <Paper elevation={0} sx={ss.panel}>
            <Box sx={ss.panelHeader}>
              <Box sx={ss.panelHeaderLeft}>
                <Box sx={ss.panelIconBox}><BadgeRounded sx={ss.panelIcon} /></Box>
                <Typography sx={ss.panelTitle}>Personal Information</Typography>
              </Box>
              {!editing ? (
                <IconButton size="small" onClick={() => setEditing(true)} sx={ss.editIconBtn}>
                  <EditRounded sx={{ fontSize: 16 }} />
                </IconButton>
              ) : (
                <Box sx={ss.editActionsRow}>
                  <IconButton size="small" onClick={cancelEdit} sx={ss.cancelIconBtn}><CloseRounded sx={{ fontSize: 16 }} /></IconButton>
                  <IconButton size="small" disabled={saving} onClick={handleSave} sx={ss.editIconBtn}><SaveRounded sx={{ fontSize: 16 }} /></IconButton>
                </Box>
              )}
            </Box>
            {editing ? (
              <Stack spacing={1.5}>
                {PROFILE_FIELDS.map(({ label, key, placeholder, type }) => (
                  <Box key={key}>
                    <Typography sx={ss.fieldLabel}>{label}</Typography>
                    <OutlinedInput fullWidth size="small" type={type ?? 'text'} placeholder={placeholder}
                      value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      sx={ss.fieldInput} />
                  </Box>
                ))}
              </Stack>
            ) : (
              <Stack spacing={1.8}>
                {[
                  { label: 'FULL NAME', value: profile.name },
                  { label: 'EMPLOYEE ID', value: profile.employeeId },
                  { label: 'CORPORATE EMAIL', value: profile.email },
                  { label: 'ROLE', value: profile.role?.replace(/_/g, ' ') ?? '—' },
                  { label: 'DEPARTMENT', value: profile.department ?? '—' },
                  { label: 'MANAGER', value: profile.managerName ?? '—' },
                  { label: 'OFFICE LOCATION', value: profile.officeLocation ?? '—' },
                  { label: 'WORK STATUS', value: profile.status?.replace(/_/g, ' ') ?? '—' },
                ].map(({ label, value }) => (
                  <Box key={label}>
                    <Typography sx={ss.fieldValueLabel}>{label}</Typography>
                    <Typography sx={ss.fieldValue}>{value}</Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>

          {profile.technologies?.length > 0 && (
            <Paper elevation={0} sx={ss.panel}>
              <Box sx={ss.panelHeader}>
                <Box sx={ss.panelHeaderLeft}>
                  <Box sx={ss.panelIconBox}><WorkspacePremiumRounded sx={ss.panelIcon} /></Box>
                  <Typography sx={ss.panelTitle}>Skills &amp; Competencies</Typography>
                </Box>
              </Box>
              <Box sx={ss.skillsChipBox}>
                {profile.technologies.map(t => <Chip key={t} label={t} size="small" sx={ss.skillChip} />)}
              </Box>
            </Paper>
          )}
        </Stack>

        <Stack spacing={3}>
          <Box sx={ss.statsRow}>
            <SettingsStatCard icon={<CheckCircleRounded sx={{ fontSize: 20, color: BRAND.red }} />} value={completedCourses} label="Courses Completed" />
            <SettingsStatCard icon={<CheckCircleRounded sx={{ fontSize: 20, color: BRAND.red }} />} value={assignedCourses.length} label="Assigned Courses" />
            <SettingsStatCard icon={<AccessTimeRounded sx={{ fontSize: 20, color: BRAND.red }} />} value={assignedCourses.length * 8} label="Total Learning Hours" />
          </Box>

          <Paper elevation={0} sx={ss.panel}>
            <Box sx={ss.panelHeader}>
              <Box sx={ss.panelHeaderLeft}>
                <EmojiEventsRounded sx={ss.ongoingIcon} />
                <Typography sx={ss.panelTitle}>Ongoing Programs</Typography>
              </Box>
            </Box>
            {ongoingCourses.length === 0 ? (
              <Typography sx={{ fontSize: 13, color: 'grey.400', textAlign: 'center', py: 3 }}>No ongoing courses</Typography>
            ) : (
              <Stack spacing={2.5}>
                {ongoingCourses.slice(0, 4).map((c: IAssignment) => (
                  <Box key={c._id}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                        <Box sx={ss.courseIconBox}><WorkspacePremiumRounded sx={{ fontSize: 18, color: 'grey.500' }} /></Box>
                        <Box>
                          <Typography sx={ss.courseTitle}>{c.course_title ?? 'Untitled Course'}</Typography>
                          <Typography sx={ss.courseSub}>Self-paced &nbsp;·&nbsp; {c.status?.replace(/_/g, ' ')}</Typography>
                        </Box>
                      </Box>
                      <Typography sx={ss.coursePct}>{c.progress_percent ?? 0}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={c.progress_percent ?? 0} sx={ss.progressBar} />
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>

          <Paper elevation={0} sx={ss.panel}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
              <EmojiEventsRounded sx={ss.ongoingIcon} />
              <Typography sx={ss.panelTitle}>Recent Achievements</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {ACHIEVEMENTS.map(({ icon, label }) => (
                <Box key={label} sx={ss.achievementBox}>
                  <Box sx={ss.achievementIcon}>{icon}</Box>
                  <Typography sx={ss.achievementLabel}>{label}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Stack>
      </Box>

      <HierarchyModal
        open={orgModalOpen}
        onClose={() => setOrgModalOpen(false)}
        loading={orgTreeLoading}
        error={orgTreeError}
        tree={orgTree}
        onRetry={() => { setOrgTreeLoaded(false); openHierarchy(); }}
      />
    </Fragment>
  );
};

export default SettingsPage;
