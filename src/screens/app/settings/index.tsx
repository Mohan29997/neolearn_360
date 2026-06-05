import { Fragment, useEffect, useState } from 'react';
import {
    Box, Typography, Avatar, Chip, CircularProgress,
    Paper, Stack, LinearProgress, OutlinedInput, Button, IconButton,
} from '@mui/material';
import {
    CheckCircleRounded, AccessTimeRounded, EmojiEventsRounded,
    EditRounded, SaveRounded, CloseRounded, ShareRounded, EmailRounded,
    LockRounded, StarRounded, WhatshotRounded, WorkspacePremiumRounded, BadgeRounded,
} from '@mui/icons-material';
import TabTitle from '../../../components/tabtitle';
import { service } from '../../../service';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setProfile } from '../../../store/reducer/AdminProfile';

const BRAND_RED = '#8B1A2E';

interface ProfileData {
    _id: string;
    employeeId: string;
    name: string;
    email: string;
    role: string;
    department?: string;
    managerName?: string;
    officeLocation?: string;
    status?: string;
    technologies: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface AssignedCourse {
    _id: string;
    course_id: string;
    course_title: string;
    status: string;
    progress_percent: number;
    department?: string;
    mentor_name?: string;
}

const ACHIEVEMENTS = [
    { icon: <StarRounded sx={{ fontSize: 22, color: BRAND_RED }} />, label: 'Fast Learner' },
    { icon: <WhatshotRounded sx={{ fontSize: 22, color: BRAND_RED }} />, label: '7 Day Streak' },
    { icon: <EmojiEventsRounded sx={{ fontSize: 22, color: BRAND_RED }} />, label: 'Top 10%' },
    { icon: <WorkspacePremiumRounded sx={{ fontSize: 22, color: BRAND_RED }} />, label: 'Mentor Badge' },
    { icon: <LockRounded sx={{ fontSize: 22, color: '#ccc' }} />, label: 'Locked' },
];

const StatCard = ({ icon, value, label }: { icon: React.ReactNode; value: number | string; label: string }) => (
    <Paper elevation={0} sx={{ flex: 1, border: '1px solid', borderColor: 'grey.200', borderRadius: '14px', p: 3, textAlign: 'center' }}>
        <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
            {icon}
        </Box>
        <Typography sx={{ fontSize: 32, fontWeight: 800, color: 'grey.900', lineHeight: 1 }}>{value}</Typography>
        <Typography sx={{ fontSize: 12, color: 'grey.500', mt: 0.5 }}>{label}</Typography>
    </Paper>
);

const Settings = () => {
    const dispatch = useAppDispatch();
    const [profile, setProfileState] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [assignedCourses, setAssignedCourses] = useState<AssignedCourse[]>([]);

    useEffect(() => {
        service.getuserprofile()
            .then((res: any) => {
                const data = res?.data?.data ?? res?.data ?? res;
                setProfileState(data);
                setForm({ name: data.name, email: data.email, password: '' });
            })
            .catch(() => {})
            .finally(() => setLoading(false));

        service.getAssignedCourses({ page: 1, limit: 90 })
            .then((res: any) => {
                const list = res?.data?.assignments ?? res?.data ?? [];
                setAssignedCourses(Array.isArray(list) ? list : []);
            })
            .catch(() => {});
    }, []);

    const handleSave = async () => {
        if (!profile) return;
        setSaving(true);
        const payload: Record<string, any> = { name: form.name, email: form.email };
        if (form.password) payload.password = form.password;
        try {
            await service.updateAdminUser(profile._id, payload);
            const updated = { ...profile, name: form.name, email: form.email };
            setProfileState(updated);
            dispatch(setProfile(updated));
            setEditing(false);
        } finally {
            setSaving(false);
        }
    };

    const initials = profile?.name
        ? profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : 'U';

    const completedCourses = assignedCourses.filter(c => c.status === 'completed').length;
    const ongoingCourses = assignedCourses.filter(c => c.status !== 'completed');

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
            <CircularProgress sx={{ color: BRAND_RED }} />
        </Box>
    );

    if (!profile) return (
        <Typography sx={{ color: 'grey.500', textAlign: 'center', py: 10 }}>Unable to load profile.</Typography>
    );

    return (
        <Fragment>
            <TabTitle title="User Profile" />

            {/* Hero Banner */}
            <Box sx={{ borderRadius: '16px', overflow: 'hidden', mb: 0, position: 'relative' }}>
                <Box sx={{
                    height: 160, bgcolor: BRAND_RED,
                    backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.07) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(0,0,0,0.15) 0%, transparent 50%)',
                }} />
                {/* Profile row overlapping banner */}
                <Box sx={{ bgcolor: '#fff', px: 3, pb: 2.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2.5, mt: '-48px' }}>
                        <Box sx={{ position: 'relative', flexShrink: 0 }}>
                            <Avatar sx={{
                                width: 100, height: 100, bgcolor: BRAND_RED, fontSize: 32, fontWeight: 800,
                                border: '4px solid #fff', boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                            }}>
                                {initials}
                            </Avatar>
                            {editing && (
                                <Box sx={{
                                    position: 'absolute', bottom: 4, right: 4, width: 26, height: 26,
                                    borderRadius: '50%', bgcolor: BRAND_RED, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                    border: '2px solid #fff',
                                }}>
                                    <EditRounded sx={{ fontSize: 13, color: '#fff' }} />
                                </Box>
                            )}
                        </Box>

                        <Box sx={{ flex: 1, pb: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                <Typography sx={{ fontWeight: 800, fontSize: 22, color: 'grey.900' }}>{profile.name}</Typography>
                                <Chip label={profile.isActive ? 'Active' : 'Inactive'} size="small"
                                    sx={{ fontSize: 11, fontWeight: 700, bgcolor: profile.isActive ? '#DCFCE7' : '#F3F4F6', color: profile.isActive ? '#15803D' : '#6B7280', borderRadius: '6px' }} />
                            </Box>
                            <Typography sx={{ fontSize: 13, color: 'grey.500', mt: 0.3 }}>
                                {profile.role.replace(/_/g, ' ')}
                                {profile.department && <> &nbsp;·&nbsp; {profile.department}</>}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, pb: 0.5, flexShrink: 0 }}>
                            <Button startIcon={<ShareRounded sx={{ fontSize: 15 }} />} variant="outlined" size="small"
                                sx={{ textTransform: 'none', fontSize: 12, borderRadius: '8px', borderColor: 'grey.300', color: 'grey.700', fontWeight: 600 }}>
                                Export Profile
                            </Button>
                            <Button startIcon={<EmailRounded sx={{ fontSize: 15 }} />} variant="contained" size="small"
                                component="a" href={`mailto:${profile.email}`}
                                sx={{ textTransform: 'none', fontSize: 12, borderRadius: '8px', bgcolor: BRAND_RED, fontWeight: 600, '&:hover': { bgcolor: '#a01828' } }}>
                                Contact Admin
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Body */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '300px 1fr' }, gap: 3, mt: 3 }}>

                {/* LEFT COLUMN */}
                <Stack spacing={3}>

                    {/* Personal Info */}
                    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: '14px', p: 2.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <BadgeRounded sx={{ fontSize: 15, color: BRAND_RED }} />
                                </Box>
                                <Typography sx={{ fontWeight: 700, fontSize: 14, color: 'grey.800' }}>Personal Information</Typography>
                            </Box>
                            {!editing ? (
                                <IconButton size="small" onClick={() => setEditing(true)} sx={{ color: BRAND_RED }}>
                                    <EditRounded sx={{ fontSize: 16 }} />
                                </IconButton>
                            ) : (
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <IconButton size="small" onClick={() => { setEditing(false); setForm({ name: profile.name, email: profile.email, password: '' }); }} sx={{ color: 'grey.500' }}>
                                        <CloseRounded sx={{ fontSize: 16 }} />
                                    </IconButton>
                                    <IconButton size="small" disabled={saving} onClick={handleSave} sx={{ color: BRAND_RED }}>
                                        <SaveRounded sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </Box>
                            )}
                        </Box>

                        {editing ? (
                            <Stack spacing={1.5}>
                                {([
                                    { label: 'FULL NAME', key: 'name', placeholder: 'Full name' },
                                    { label: 'CORPORATE EMAIL', key: 'email', placeholder: 'Email' },
                                    { label: 'NEW PASSWORD', key: 'password', placeholder: 'Leave blank to keep unchanged', type: 'password' },
                                ] as const).map(({ label, key, placeholder, type }) => (
                                    <Box key={key}>
                                        <Typography sx={{ fontSize: 10, fontWeight: 700, color: 'grey.400', letterSpacing: '0.6px', mb: 0.4 }}>{label}</Typography>
                                        <OutlinedInput fullWidth size="small" type={type ?? 'text'} placeholder={placeholder}
                                            value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                            sx={{ fontSize: 13, borderRadius: '8px' }} />
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
                                        <Typography sx={{ fontSize: 10, fontWeight: 700, color: 'grey.400', letterSpacing: '0.6px' }}>{label}</Typography>
                                        <Typography sx={{ fontSize: 13.5, color: 'grey.800', fontWeight: 500, mt: 0.2 }}>{value}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                        )}
                    </Paper>

                    {/* Skills */}
                    {profile.technologies?.length > 0 && (
                        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: '14px', p: 2.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <WorkspacePremiumRounded sx={{ fontSize: 15, color: BRAND_RED }} />
                                    </Box>
                                    <Typography sx={{ fontWeight: 700, fontSize: 14, color: 'grey.800' }}>Skills & Competencies</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                                {profile.technologies.map(t => (
                                    <Chip key={t} label={t} size="small"
                                        sx={{ fontSize: 12, fontWeight: 500, bgcolor: '#F9FAFB', border: '1px solid', borderColor: 'grey.200', borderRadius: '6px', color: 'grey.700' }} />
                                ))}
                            </Box>
                        </Paper>
                    )}
                </Stack>

                {/* RIGHT COLUMN */}
                <Stack spacing={3}>

                    {/* Stats */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <StatCard icon={<CheckCircleRounded sx={{ fontSize: 20, color: BRAND_RED }} />} value={completedCourses} label="Courses Completed" />
                        <StatCard icon={<CheckCircleRounded sx={{ fontSize: 20, color: BRAND_RED }} />} value={assignedCourses.length} label="Assigned Courses" />
                        <StatCard icon={<AccessTimeRounded sx={{ fontSize: 20, color: BRAND_RED }} />}
                            value={assignedCourses.length * 8}
                            label="Total Learning Hours" />
                    </Box>

                    {/* Ongoing Programs */}
                    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: '14px', p: 2.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <EmojiEventsRounded sx={{ fontSize: 20, color: BRAND_RED }} />
                                <Typography sx={{ fontWeight: 700, fontSize: 15, color: 'grey.800' }}>Ongoing Programs</Typography>
                            </Box>
                        </Box>

                        {ongoingCourses.length === 0 ? (
                            <Typography sx={{ fontSize: 13, color: 'grey.400', textAlign: 'center', py: 3 }}>No ongoing courses</Typography>
                        ) : (
                            <Stack spacing={2.5}>
                                {ongoingCourses.slice(0, 4).map((c) => {
                                    const progress = c.progress_percent ?? 0;
                                    const title = c.course_title ?? 'Untitled Course';
                                    return (
                                        <Box key={c._id}>
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                                                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                                    <Box sx={{ width: 38, height: 38, borderRadius: '10px', bgcolor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                        <WorkspacePremiumRounded sx={{ fontSize: 18, color: 'grey.500' }} />
                                                    </Box>
                                                    <Box>
                                                        <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: 'grey.900' }}>{title}</Typography>
                                                        <Typography sx={{ fontSize: 12, color: 'grey.500' }}>
                                                            {c.department || 'Self-paced'} &nbsp;·&nbsp; {c.status?.replace(/_/g, ' ')}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Typography sx={{ fontSize: 13, fontWeight: 700, color: BRAND_RED, flexShrink: 0, ml: 1 }}>{progress}%</Typography>
                                            </Box>
                                            <LinearProgress variant="determinate" value={progress}
                                                sx={{ height: 6, borderRadius: 4, bgcolor: '#F3F4F6', '& .MuiLinearProgress-bar': { bgcolor: BRAND_RED, borderRadius: 4 } }} />
                                        </Box>
                                    );
                                })}
                            </Stack>
                        )}
                    </Paper>

                    {/* Recent Achievements */}
                    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: '14px', p: 2.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                            <EmojiEventsRounded sx={{ fontSize: 20, color: BRAND_RED }} />
                            <Typography sx={{ fontWeight: 700, fontSize: 15, color: 'grey.800' }}>Recent Achievements</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            {ACHIEVEMENTS.map(({ icon, label }) => (
                                <Box key={label} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.8 }}>
                                    <Box sx={{ width: 56, height: 56, borderRadius: '14px', bgcolor: '#F9FAFB', border: '1px solid', borderColor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {icon}
                                    </Box>
                                    <Typography sx={{ fontSize: 11, color: 'grey.600', fontWeight: 500, textAlign: 'center' }}>{label}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>

                </Stack>
            </Box>
        </Fragment>
    );
};

export default Settings;
