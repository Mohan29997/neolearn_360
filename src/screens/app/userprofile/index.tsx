import { Fragment, useEffect, useState } from 'react';
import {
    Box, Typography, Avatar, Chip, Divider, CircularProgress,
    Grid, Paper, Stack,
} from '@mui/material';
import {
    BadgeRounded, EmailRounded, WorkRounded,
    CalendarTodayRounded, CodeRounded, VerifiedUserRounded,
} from '@mui/icons-material';
import TabTitle from '../../../components/tabtitle';
import { service } from '../../../service';

const BRAND_RED = '#8B1A2E';

interface ProfileData {
    _id: string;
    employeeId: string;
    name: string;
    email: string;
    role: string;
    department?: string;
    technologies: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
        <Box sx={{ mt: 0.2, color: 'grey.400', flexShrink: 0 }}>{icon}</Box>
        <Box>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: 'grey.500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</Typography>
            <Typography sx={{ fontSize: 13.5, color: 'grey.800', fontWeight: 500, mt: 0.2 }}>{value || '—'}</Typography>
        </Box>
    </Box>
);

const UserProfile = () => {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        service.getuserprofile()
            .then((res: any) => setProfile(res?.data ?? res))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const initials = profile?.name
        ? profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : 'U';

    const formatDate = (iso: string) =>
        iso ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

    return (
        <Fragment>
            <TabTitle title="My Profile" />
            <Box sx={{ maxWidth: 860, mx: 'auto' }}>
                <Typography variant="h4" fontWeight={700} sx={{ color: 'grey.900', mb: 0.5 }}>My Profile</Typography>
                <Typography sx={{ color: 'grey.500', fontSize: 13, mb: 3 }}>Your account details and information</Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress sx={{ color: BRAND_RED }} />
                    </Box>
                ) : !profile ? (
                    <Typography sx={{ color: 'grey.500', textAlign: 'center', py: 10 }}>Unable to load profile.</Typography>
                ) : (
                    <Grid container spacing={3}>
                        {/* Avatar Card */}
                        <Grid item xs={12} md={4}>
                            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: '16px', p: 3, textAlign: 'center' }}>
                                <Avatar
                                    sx={{ width: 88, height: 88, bgcolor: BRAND_RED, fontSize: 28, fontWeight: 700, mx: 'auto', mb: 2 }}
                                >
                                    {initials}
                                </Avatar>
                                <Typography sx={{ fontWeight: 700, fontSize: 17, color: 'grey.900' }}>{profile.name}</Typography>
                                <Typography sx={{ fontSize: 12, color: 'grey.500', mt: 0.3 }}>{profile.email}</Typography>

                                <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                                    <Chip
                                        label={profile.role.replace(/_/g, ' ')}
                                        size="small"
                                        sx={{ fontSize: 11, fontWeight: 700, bgcolor: '#FFF1F2', color: BRAND_RED, border: `1px solid #FECDD3`, borderRadius: '6px' }}
                                    />
                                    <Chip
                                        label={profile.isActive ? 'Active' : 'Inactive'}
                                        size="small"
                                        sx={{
                                            fontSize: 11, fontWeight: 700, borderRadius: '6px',
                                            bgcolor: profile.isActive ? '#DCFCE7' : '#F3F4F6',
                                            color: profile.isActive ? '#15803D' : '#6B7280',
                                        }}
                                    />
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Details Card */}
                        <Grid item xs={12} md={8}>
                            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: '16px', p: 3, height: '100%' }}>
                                <Typography sx={{ fontWeight: 700, fontSize: 14, color: 'grey.700', mb: 2 }}>Account Information</Typography>
                                <Stack spacing={2.5}>
                                    <InfoRow icon={<BadgeRounded sx={{ fontSize: 17 }} />} label="Employee ID" value={profile.employeeId} />
                                    <InfoRow icon={<EmailRounded sx={{ fontSize: 17 }} />} label="Email Address" value={profile.email} />
                                    <InfoRow icon={<WorkRounded sx={{ fontSize: 17 }} />} label="Department" value={profile.department ?? '—'} />
                                    <InfoRow icon={<VerifiedUserRounded sx={{ fontSize: 17 }} />} label="Role" value={profile.role.replace(/_/g, ' ')} />
                                </Stack>

                                <Divider sx={{ my: 2.5, borderStyle: 'dashed' }} />

                                <Typography sx={{ fontWeight: 700, fontSize: 14, color: 'grey.700', mb: 2 }}>Activity</Typography>
                                <Stack spacing={2.5}>
                                    <InfoRow icon={<CalendarTodayRounded sx={{ fontSize: 17 }} />} label="Member Since" value={formatDate(profile.createdAt)} />
                                    <InfoRow icon={<CalendarTodayRounded sx={{ fontSize: 17 }} />} label="Last Updated" value={formatDate(profile.updatedAt)} />
                                </Stack>
                            </Paper>
                        </Grid>

                        {/* Technologies Card */}
                        {profile.technologies?.length > 0 && (
                            <Grid item xs={12}>
                                <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: '16px', p: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <CodeRounded sx={{ fontSize: 18, color: 'grey.500' }} />
                                        <Typography sx={{ fontWeight: 700, fontSize: 14, color: 'grey.700' }}>Technologies</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {profile.technologies.map(tech => (
                                            <Chip
                                                key={tech}
                                                label={tech}
                                                size="small"
                                                sx={{ fontSize: 12, fontWeight: 500, bgcolor: '#F3F4F6', color: 'grey.700', borderRadius: '6px' }}
                                            />
                                        ))}
                                    </Box>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                )}
            </Box>
        </Fragment>
    );
};

export default UserProfile;
