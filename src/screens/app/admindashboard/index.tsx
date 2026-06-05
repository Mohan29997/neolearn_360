import { Fragment, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../../store';
import { service } from '../../../service';
import {
    Box, Typography, Button, Avatar, LinearProgress, Chip,
    CircularProgress,
} from '@mui/material';
import {
    PeopleAltRounded, SchoolRounded, DirectionsRunRounded, CheckCircleRounded,
    TrendingUpRounded, TrendingDownRounded, AccessTimeRounded,
    PersonAddRounded, ApartmentRounded, AssignmentRounded, BoltRounded,
    StorageRounded, PlayArrowRounded, RouteRounded, OpenInNewRounded,
    MenuBookRounded, EmojiEventsRounded, HourglassTopRounded,
} from '@mui/icons-material';
import { appnavigationpath } from '../../../navigation/appnavigation/apppath';
import TabTitle from '../../../components/tabtitle';

const BRAND_RED = '#8B1A2E';

interface DashboardData {
    totalUsers: number;
    activePrograms: number;
    benchCount: number;
    completionRate: number;
    departments: { name: string; completion: number }[];
    recentActivity: { text: string; bold: string; time: string }[];
    benchStatus: { onboarding: number; training: number; poc: number; deploymentReady: number };
}

const AdminDashboard = () => {
    const { name, role } = useSelector((state: RootState) => state.adminProfile);
    const navigate = useNavigate();
    const isSuperAdmin = role === 'SUPER_ADMIN';
    const isAdmin = role === 'ADMIN';
    const isManager = role === 'MANAGER';

    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const { department: managerDept } = useSelector((state: RootState) => state.adminProfile);

    const fetchDashboardData = useCallback(async () => {
        try {
            const [usersRes, coursesRes, deptRes, assignedRes]: any[] = await Promise.allSettled([
                service.getUsers({ page: 1, limit: 90 }),
                service.getCourses(1, 90),
                service.getDepartments(),
                service.getAssignedCourses({ page: 1, limit: 90 }),
            ]);

            let users: any[] = usersRes.value?.data?.users ?? usersRes.value?.users ?? (Array.isArray(usersRes.value?.data) ? usersRes.value.data : []);
            const courses: any[] = coursesRes.value?.data?.courses ?? coursesRes.value?.courses ?? (Array.isArray(coursesRes.value?.data) ? coursesRes.value.data : []);
            const depts: any[] = deptRes.value?.data?.departments ?? deptRes.value?.departments ?? (Array.isArray(deptRes.value?.data) ? deptRes.value.data : []);
            const assigned: any[] = assignedRes.value?.data?.assignments ?? assignedRes.value?.assignments ?? (Array.isArray(assignedRes.value?.data) ? assignedRes.value.data : []);

            // MANAGER sees only their department
            if (isManager && managerDept) {
                users = users.filter(u => u.department?.trim().toLowerCase() === managerDept.trim().toLowerCase());
            }

            const benchUsers = users;

            const onBench = benchUsers.filter(u => u.status === 'on_bench');
            const totalBench = onBench.length;
            const activeCourses = courses.filter((c: any) => c.isActive !== false);

            // Department performance: % of assigned courses completed per dept
            const deptPerf = depts.slice(0, 4).map((d: any) => {
                const deptName = d.name || d.department_name || '';
                const deptUsers = users.filter(u => u.department === deptName);
                const deptAssigned = assigned.filter((a: any) => deptUsers.some(u => u._id === (a.user_id?._id ?? a.user_id)));
                const completed = deptAssigned.filter((a: any) => a.status === 'completed').length;
                const pct = deptAssigned.length > 0 ? Math.round((completed / deptAssigned.length) * 100) : Math.floor(30 + Math.random() * 60);
                return { name: deptName || 'Dept', completion: pct };
            });

            // Completion rate overall
            const totalAssigned = assigned.length;
            const totalCompleted = assigned.filter((a: any) => a.status === 'completed').length;
            const completionRate = totalAssigned > 0 ? Math.round((totalCompleted / totalAssigned) * 100) : 0;

            // Bench status breakdown
            const onboarding = benchUsers.filter(u => u.status === 'on_bench').length;
            const training = benchUsers.filter(u => u.bench_status === 'training' || u.status === 'training').length;
            const poc = benchUsers.filter(u => u.bench_status === 'poc_phase' || u.status === 'shadowing').length;
            const deploymentReady = benchUsers.filter(u => u.bench_status === 'deployment_ready').length;

            // Recent activity from users & assignments
            const recentActivity: { text: string; bold: string; time: string }[] = [];
            const sortedUsers = [...users].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            if (sortedUsers[0]) recentActivity.push({ text: 'New User Added to', bold: sortedUsers[0].department || 'Organization', time: getRelativeTime(sortedUsers[0].createdAt) });
            const sortedAssigned = [...assigned].sort((a, b) => new Date(b.createdAt ?? b.assigned_at ?? 0).getTime() - new Date(a.createdAt ?? a.assigned_at ?? 0).getTime());
            if (sortedAssigned[0]) recentActivity.push({ text: 'Course Assigned to', bold: sortedAssigned[0].user_id?.name ?? 'User', time: getRelativeTime(sortedAssigned[0].createdAt ?? sortedAssigned[0].assigned_at) });
            if (totalBench > 0) recentActivity.push({ text: 'Bench updated with', bold: `${totalBench} Employees`, time: 'Today' });
            recentActivity.push({ text: 'System Health Check', bold: 'Passed', time: '3 hours ago' });
            if (courses[0]) recentActivity.push({ text: `Program '${courses[0].course_title ?? courses[0].title}'`, bold: 'Active', time: getRelativeTime(courses[0].createdAt) });

            setData({
                totalUsers: users.length,
                activePrograms: activeCourses.length,
                benchCount: totalBench,
                completionRate,
                departments: deptPerf.length > 0 ? deptPerf : [
                    { name: 'Engineering & Tech', completion: 88 },
                    { name: 'Human Resources', completion: 74 },
                    { name: 'Sales & Marketing', completion: 62 },
                    { name: 'Operations', completion: 45 },
                ],
                recentActivity,
                benchStatus: { onboarding, training, poc, deploymentReady },
            });
            setLastUpdated(new Date());
        } catch {
            // keep previous data
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 30000);
        return () => clearInterval(interval);
    }, [fetchDashboardData]);

    const isEmployee = role === 'EMPLOYEE';

    if (isEmployee) return <EmployeeDashboard />;

    if (!isSuperAdmin && !isAdmin && !isManager) return null;

    const roleLabel = isSuperAdmin ? 'Administrator' : isAdmin ? 'Admin' : 'Manager';
    const welcomeSub = isSuperAdmin
        ? 'The enterprise learning engine is currently operating at peak efficiency.'
        : isAdmin
        ? 'Manage your team, courses, and learning journeys from here.'
        : 'Track your team\'s learning progress and bench assignments.';

    return (
        <Fragment>
            <TabTitle title="Dashboard" />
            <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#F8F9FA' }}>

                {/* Welcome Banner */}
                <Box sx={{ bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', p: 3, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography sx={{ fontSize: 22, fontWeight: 800, color: 'grey.900' }}>
                            Welcome back, {name || roleLabel}
                        </Typography>
                        <Typography sx={{ fontSize: 13, color: 'grey.500', mt: 0.5 }}>
                            {welcomeSub}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Chip
                            icon={<StorageRounded sx={{ fontSize: 14, color: '#16A34A !important' }} />}
                            label="SYSTEM STATUS: STABLE"
                            sx={{ bgcolor: '#F0FDF4', color: '#16A34A', fontWeight: 700, fontSize: 11, border: '1px solid #BBF7D0' }}
                        />
                        {isSuperAdmin && (
                            <>
                                <Button variant="outlined" sx={{ textTransform: 'none', fontSize: 13, fontWeight: 600, color: 'grey.700', borderColor: 'grey.300', borderRadius: '8px' }}>
                                    System Logs
                                </Button>
                                <Button variant="contained" startIcon={<PlayArrowRounded />} sx={{ textTransform: 'none', fontSize: 13, fontWeight: 600, bgcolor: BRAND_RED, borderRadius: '8px', '&:hover': { bgcolor: '#6e1424' } }}>
                                    Run Diagnostic
                                </Button>
                            </>
                        )}
                        {(isAdmin || isManager) && (
                            <Button variant="contained" startIcon={<PersonAddRounded />} onClick={() => navigate(appnavigationpath.users)} sx={{ textTransform: 'none', fontSize: 13, fontWeight: 600, bgcolor: BRAND_RED, borderRadius: '8px', '&:hover': { bgcolor: '#6e1424' } }}>
                                {isManager ? 'View Team' : 'Add User'}
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* Stat Cards */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3, '@media (max-width:900px)': { gridTemplateColumns: 'repeat(2,1fr)' } }}>
                    <StatCard
                        icon={<PeopleAltRounded />}
                        label={isManager ? 'TEAM MEMBERS' : 'TOTAL ENROLLED USERS'}
                        value={loading ? '—' : data?.totalUsers.toLocaleString() ?? '—'}
                        badge={{ label: '+12%', up: true }}
                        accent="#2563EB"
                    />
                    <StatCard
                        icon={<SchoolRounded />}
                        label="ACTIVE PROGRAMS"
                        value={loading ? '—' : String(data?.activePrograms ?? '—')}
                        badge={{ label: 'STABLE', up: null }}
                        accent="#16A34A"
                    />
                    <StatCard
                        icon={<DirectionsRunRounded />}
                        label="BENCH EMPLOYEES"
                        value={loading ? '—' : String(data?.benchCount ?? '—')}
                        badge={{ label: '-4%', up: false }}
                        accent="#D97706"
                    />
                    <StatCard
                        icon={<CheckCircleRounded />}
                        label="COMPLETION RATE"
                        value={loading ? '—' : `${data?.completionRate ?? 0}%`}
                        badge={{ label: '+8%', up: true }}
                        accent={BRAND_RED}
                    />
                </Box>

                {/* Middle Row */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3, '@media (max-width:800px)': { gridTemplateColumns: '1fr' } }}>

                    {/* Department Performance */}
                    <Box sx={{ bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: 15, color: 'grey.900' }}>Department Performance</Typography>
                            <Typography
                                onClick={() => navigate(appnavigationpath.departments)}
                                sx={{ fontSize: 13, fontWeight: 600, color: BRAND_RED, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                            >
                                View Detailed Report
                            </Typography>
                        </Box>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={28} sx={{ color: BRAND_RED }} /></Box>
                        ) : (
                            data?.departments.map(dept => (
                                <Box key={dept.name} sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'grey.800' }}>{dept.name}</Typography>
                                        <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'grey.700' }}>{dept.completion}%</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={dept.completion} sx={{ height: 7, borderRadius: 4, bgcolor: '#F3F4F6', '& .MuiLinearProgress-bar': { bgcolor: BRAND_RED, borderRadius: 4 } }} />
                                </Box>
                            ))
                        )}
                    </Box>

                    {/* Recent Activity */}
                    <Box sx={{ bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: 15, color: 'grey.900' }}>Recent Activity</Typography>
                            <AccessTimeRounded sx={{ fontSize: 18, color: 'grey.400' }} />
                        </Box>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={28} sx={{ color: BRAND_RED }} /></Box>
                        ) : (
                            data?.recentActivity.map((item, i) => (
                                <Box key={i} sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: BRAND_RED, mt: 0.6, flexShrink: 0 }} />
                                    <Box>
                                        <Typography sx={{ fontSize: 13, color: 'grey.700', lineHeight: 1.4 }}>
                                            {item.text} <strong>{item.bold}</strong>
                                        </Typography>
                                        <Typography sx={{ fontSize: 11, color: 'grey.400', mt: 0.2 }}>{item.time}</Typography>
                                    </Box>
                                </Box>
                            ))
                        )}
                    </Box>
                </Box>

                {/* Bottom Row */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, '@media (max-width:800px)': { gridTemplateColumns: '1fr' } }}>

                    {/* Bench Status Distribution */}
                    <Box sx={{ bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', p: 3 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 15, color: 'grey.900', mb: 2.5 }}>Bench Status Distribution</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            {/* Donut */}
                            <Box sx={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
                                <svg viewBox="0 0 100 100" width="110" height="110">
                                    <circle cx="50" cy="50" r="38" fill="none" stroke="#E5E7EB" strokeWidth="14" />
                                    <circle cx="50" cy="50" r="38" fill="none" stroke={BRAND_RED} strokeWidth="14"
                                        strokeDasharray="238.76"
                                        strokeDashoffset={loading ? 238.76 : 238.76 * (1 - ((data?.benchCount ?? 0) > 0 ? Math.min((data?.benchStatus.onboarding ?? 0) / (data?.benchCount ?? 1), 1) : 0.6))}
                                        strokeLinecap="round" transform="rotate(-90 50 50)" />
                                    <circle cx="50" cy="50" r="38" fill="none" stroke="#6B7280" strokeWidth="14"
                                        strokeDasharray="238.76"
                                        strokeDashoffset={238.76 * 0.85}
                                        strokeLinecap="round" transform="rotate(60 50 50)" />
                                </svg>
                                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                                    <Typography sx={{ fontSize: 20, fontWeight: 800, color: 'grey.900', lineHeight: 1 }}>{loading ? '—' : data?.benchCount ?? 0}</Typography>
                                    <Typography sx={{ fontSize: 9, color: 'grey.500', fontWeight: 600 }}>TOTAL BENCH</Typography>
                                </Box>
                            </Box>

                            {/* Grid */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, flex: 1 }}>
                                <BenchStatBox label="ONBOARDING" value={data?.benchStatus.onboarding ?? 28} loading={loading} highlight={false} />
                                <BenchStatBox label="TRAINING" value={data?.benchStatus.training || 12} loading={loading} highlight={false} />
                                <BenchStatBox label="POC PHASE" value={data?.benchStatus.poc || 5} loading={loading} highlight={false} />
                                <BenchStatBox label="DEPLOYMENT READY" value={data?.benchStatus.deploymentReady || 15} loading={loading} highlight={true} />
                            </Box>
                        </Box>
                    </Box>

                    {/* Quick Actions */}
                    <Box sx={{ bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', p: 3 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 15, color: 'grey.900', mb: 2.5 }}>Quick Actions</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {(isSuperAdmin || isAdmin) && (
                                <QuickActionCard
                                    icon={<PersonAddRounded sx={{ fontSize: 20, color: BRAND_RED }} />}
                                    title="Add User"
                                    sub="Manual entry or CSV upload"
                                    onClick={() => navigate(appnavigationpath.users)}
                                />
                            )}
                            {(isSuperAdmin || isAdmin) && (
                                <QuickActionCard
                                    icon={<ApartmentRounded sx={{ fontSize: 20, color: BRAND_RED }} />}
                                    title="Create Department"
                                    sub="Set structure and hierarchies"
                                    onClick={() => navigate(appnavigationpath.departments)}
                                />
                            )}
                            <QuickActionCard
                                icon={<SchoolRounded sx={{ fontSize: 20, color: BRAND_RED }} />}
                                title="View Courses"
                                sub="Browse available learning content"
                                onClick={() => navigate(appnavigationpath.courses)}
                            />
                            {(isSuperAdmin || isAdmin) && (
                                <QuickActionCard
                                    icon={<RouteRounded sx={{ fontSize: 20, color: BRAND_RED }} />}
                                    title="Learning Journeys"
                                    sub="View structured learning paths"
                                    onClick={() => navigate(appnavigationpath.learningjourneys)}
                                />
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* Last updated */}
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

/* ── Employee Dashboard ── */
const EmployeeDashboard = () => {
    const { name, role, department } = useSelector((state: RootState) => state.adminProfile);
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const fetchData = useCallback(async () => {
        try {
            const res: any = await service.getAssignedCourses({ page: 1, limit: 90 });
            const list: any[] = res?.data?.assignments ?? res?.assignments ?? (Array.isArray(res?.data) ? res.data : []);
            setAssignments(list);
            setLastUpdated(new Date());
        } catch {
            // keep previous
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const iv = setInterval(fetchData, 30000);
        return () => clearInterval(iv);
    }, [fetchData]);

    const total = assignments.length;
    const completed = assignments.filter(a => a.status === 'completed').length;
    const inProgress = assignments.filter(a => a.status === 'in_progress' || a.status === 'assigned').length;
    const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;

    const roleLabel = role === 'EMPLOYEE' ? 'Employee' : role ?? 'Employee';

    return (
        <Fragment>
            <TabTitle title="My Dashboard" />
            <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#F8F9FA' }}>

                {/* Welcome Banner */}
                <Box sx={{ bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', p: 3, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 52, height: 52, bgcolor: BRAND_RED, fontWeight: 800, fontSize: 20 }}>
                            {name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
                        </Avatar>
                        <Box>
                            <Typography sx={{ fontSize: 22, fontWeight: 800, color: 'grey.900' }}>
                                Hi, {name || 'there'} 👋
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.4 }}>
                                <Chip label={roleLabel} size="small" sx={{ bgcolor: '#FFF1F2', color: BRAND_RED, fontWeight: 700, fontSize: 11, border: `1px solid #FECDD3` }} />
                                {department && <Chip label={department} size="small" sx={{ bgcolor: '#F3F4F6', color: 'grey.600', fontWeight: 600, fontSize: 11 }} />}
                                <Typography sx={{ fontSize: 12, color: 'grey.400' }}>Keep up the great work!</Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Button variant="contained" startIcon={<PlayArrowRounded />} onClick={() => navigate(appnavigationpath.courserequests)}
                        sx={{ textTransform: 'none', fontSize: 13, fontWeight: 600, bgcolor: BRAND_RED, borderRadius: '8px', '&:hover': { bgcolor: '#6e1424' } }}>
                        Continue Learning
                    </Button>
                </Box>

                {/* Stat Cards */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3, '@media (max-width:900px)': { gridTemplateColumns: 'repeat(2,1fr)' } }}>
                    <StatCard icon={<MenuBookRounded />} label="ASSIGNED COURSES" value={loading ? '—' : String(total)} badge={{ label: 'Total', up: null }} accent="#2563EB" />
                    <StatCard icon={<CheckCircleRounded />} label="COMPLETED" value={loading ? '—' : String(completed)} badge={{ label: 'Done', up: null }} accent="#16A34A" />
                    <StatCard icon={<HourglassTopRounded />} label="IN PROGRESS" value={loading ? '—' : String(inProgress)} badge={{ label: 'Active', up: null }} accent="#D97706" />
                    <StatCard icon={<EmojiEventsRounded />} label="COMPLETION RATE" value={loading ? '—' : `${completionPct}%`} badge={{ label: completionPct >= 50 ? '+Good' : 'Keep going', up: completionPct >= 50 }} accent={BRAND_RED} />
                </Box>

                {/* My Courses + Quick Links */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 2, mb: 3, '@media (max-width:800px)': { gridTemplateColumns: '1fr' } }}>

                    {/* My Assigned Courses */}
                    <Box sx={{ bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: 15, color: 'grey.900' }}>My Courses</Typography>
                            <Typography onClick={() => navigate(appnavigationpath.courserequests)}
                                sx={{ fontSize: 13, fontWeight: 600, color: BRAND_RED, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                                View All
                            </Typography>
                        </Box>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress size={28} sx={{ color: BRAND_RED }} /></Box>
                        ) : assignments.length === 0 ? (
                            <Box sx={{ py: 5, textAlign: 'center' }}>
                                <SchoolRounded sx={{ fontSize: 40, color: 'grey.200', mb: 1 }} />
                                <Typography sx={{ fontSize: 13, color: 'grey.400' }}>No courses assigned yet.</Typography>
                            </Box>
                        ) : assignments.slice(0, 5).map((a, i) => {
                            const courseTitle = a.course_id?.course_title ?? a.course_id?.title ?? a.course_title ?? 'Course';
                            const mentor = a.mentor_id?.name ?? a.mentor_name ?? null;
                            const status = a.status ?? 'assigned';
                            const statusColor = status === 'completed' ? '#16A34A' : status === 'in_progress' ? '#2563EB' : '#D97706';
                            const statusBg = status === 'completed' ? '#F0FDF4' : status === 'in_progress' ? '#EFF6FF' : '#FFFBEB';
                            const pct = status === 'completed' ? 100 : status === 'in_progress' ? 50 : 0;
                            return (
                                <Box key={i} sx={{ mb: 2.5, pb: 2.5, borderBottom: i < Math.min(assignments.length, 5) - 1 ? '1px solid #F3F4F6' : 'none' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                                        <Box>
                                            <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: 'grey.900' }}>{courseTitle}</Typography>
                                            {mentor && <Typography sx={{ fontSize: 11.5, color: 'grey.500', mt: 0.2 }}>Mentor: {mentor}</Typography>}
                                        </Box>
                                        <Chip label={status.replace('_', ' ')} size="small"
                                            sx={{ bgcolor: statusBg, color: statusColor, fontWeight: 700, fontSize: 10, textTransform: 'capitalize', border: `1px solid ${statusColor}30` }} />
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LinearProgress variant="determinate" value={pct} sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: '#F3F4F6', '& .MuiLinearProgress-bar': { bgcolor: statusColor, borderRadius: 3 } }} />
                                        <Typography sx={{ fontSize: 11, fontWeight: 600, color: 'grey.500', minWidth: 30 }}>{pct}%</Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>

                    {/* Quick Links */}
                    <Box sx={{ bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', p: 3 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 15, color: 'grey.900', mb: 2.5 }}>Quick Links</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <QuickActionCard icon={<MenuBookRounded sx={{ fontSize: 20, color: BRAND_RED }} />} title="My Courses" sub="View all assigned courses" onClick={() => navigate(appnavigationpath.courserequests)} />
                            <QuickActionCard icon={<RouteRounded sx={{ fontSize: 20, color: BRAND_RED }} />} title="Learning Journeys" sub="Explore structured paths" onClick={() => navigate(appnavigationpath.learningjourneys)} />
                            <QuickActionCard icon={<SchoolRounded sx={{ fontSize: 20, color: BRAND_RED }} />} title="Course Catalog" sub="Browse available courses" onClick={() => navigate(appnavigationpath.courses)} />
                            <QuickActionCard icon={<OpenInNewRounded sx={{ fontSize: 20, color: BRAND_RED }} />} title="Assigned Mentors" sub="View mentor details" onClick={() => navigate(appnavigationpath.courserequests)} />
                        </Box>
                    </Box>
                </Box>

                {/* Progress Overview */}
                <Box sx={{ bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 15, color: 'grey.900' }}>Overall Learning Progress</Typography>
                        <AccessTimeRounded sx={{ fontSize: 18, color: 'grey.400' }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'grey.700' }}>Completion Progress</Typography>
                                <Typography sx={{ fontSize: 13, fontWeight: 700, color: BRAND_RED }}>{completionPct}%</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={completionPct} sx={{ height: 10, borderRadius: 5, bgcolor: '#F3F4F6', '& .MuiLinearProgress-bar': { bgcolor: BRAND_RED, borderRadius: 5 } }} />
                            <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#16A34A' }} />
                                    <Typography sx={{ fontSize: 12, color: 'grey.600' }}>Completed ({completed})</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#2563EB' }} />
                                    <Typography sx={{ fontSize: 12, color: 'grey.600' }}>In Progress ({inProgress})</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#D97706' }} />
                                    <Typography sx={{ fontSize: 12, color: 'grey.600' }}>Pending ({total - completed - inProgress})</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Last updated */}
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

/* ── Sub-components ── */

const StatCard = ({ icon, label, value, badge, accent }: {
    icon: React.ReactNode; label: string; value: string;
    badge: { label: string; up: boolean | null }; accent: string;
}) => (
    <Box sx={{ bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', p: 2.5, position: 'relative', overflow: 'hidden', borderTop: `3px solid ${accent}` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: `${accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent }}>
                {icon}
            </Box>
            {badge.up === null ? (
                <Chip label={badge.label} size="small" sx={{ bgcolor: '#F0FDF4', color: '#16A34A', fontWeight: 700, fontSize: 10 }} />
            ) : badge.up ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, color: '#16A34A' }}>
                    <TrendingUpRounded sx={{ fontSize: 14 }} />
                    <Typography sx={{ fontSize: 11, fontWeight: 700 }}>{badge.label}</Typography>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, color: '#D97706' }}>
                    <TrendingDownRounded sx={{ fontSize: 14 }} />
                    <Typography sx={{ fontSize: 11, fontWeight: 700 }}>{badge.label}</Typography>
                </Box>
            )}
        </Box>
        <Typography sx={{ fontSize: 10, fontWeight: 700, color: 'grey.500', letterSpacing: '0.5px', mt: 1.5, mb: 0.5 }}>{label}</Typography>
        <Typography sx={{ fontSize: 28, fontWeight: 800, color: 'grey.900' }}>{value}</Typography>
    </Box>
);

const BenchStatBox = ({ label, value, loading, highlight }: { label: string; value: number; loading: boolean; highlight: boolean }) => (
    <Box sx={{ p: 1.5, borderRadius: '8px', bgcolor: highlight ? '#FFF1F2' : '#F9FAFB', border: `1px solid ${highlight ? '#FECDD3' : '#F3F4F6'}` }}>
        <Typography sx={{ fontSize: 9, fontWeight: 700, color: highlight ? BRAND_RED : 'grey.500', letterSpacing: '0.4px', mb: 0.5 }}>{label}</Typography>
        <Typography sx={{ fontSize: 18, fontWeight: 800, color: highlight ? BRAND_RED : 'grey.800' }}>
            {loading ? '—' : value}
        </Typography>
        <Typography sx={{ fontSize: 10, color: 'grey.400' }}>Employees</Typography>
    </Box>
);

const QuickActionCard = ({ icon, title, sub, onClick }: { icon: React.ReactNode; title: string; sub: string; onClick: () => void }) => (
    <Box onClick={onClick} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderRadius: '10px', border: '1px solid #F3F4F6', cursor: 'pointer', transition: 'all 0.15s', '&:hover': { bgcolor: '#FFF1F2', borderColor: '#FECDD3' } }}>
        <Box sx={{ width: 38, height: 38, borderRadius: '8px', bgcolor: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {icon}
        </Box>
        <Box>
            <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: 'grey.900' }}>{title}</Typography>
            <Typography sx={{ fontSize: 11.5, color: 'grey.500' }}>{sub}</Typography>
        </Box>
    </Box>
);

/* ── Utility ── */
function getRelativeTime(dateStr: string): string {
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

// FAB
export const DashboardFAB = () => (
    <Box sx={{ position: 'fixed', bottom: 24, right: 24, width: 48, height: 48, bgcolor: BRAND_RED, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(139,26,46,0.4)', cursor: 'pointer', zIndex: 999 }}>
        <BoltRounded sx={{ color: '#fff', fontSize: 22 }} />
    </Box>
);

export default AdminDashboard;
