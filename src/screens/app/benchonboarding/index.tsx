import { Fragment, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { service } from '../../../service';
import {
    Box, Typography, Avatar, Chip, Button, Modal,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Select, MenuItem, FormControl, Pagination, IconButton, InputBase,
} from '@mui/material';
import {
    FilterListRounded, FlashOnRounded, BuildRounded,
    MenuBookRounded, CloseRounded, SearchRounded,
} from '@mui/icons-material';
import TabTitle from '../../../components/tabtitle';

const BRAND_RED = '#8B1A2E';

const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
    'On Bench': { color: '#C41E3A', bg: '#FFF1F2' },
    'Shadowing': { color: '#D97706', bg: '#FFFBEB' },
    'On Project': { color: '#16A34A', bg: '#F0FDF4' },
};

interface Course { _id: string; title: string; duration: string; }

interface Employee {
    _id: string;
    name: string;
    email: string;
    employeeId: string;
    department: string;
    managerName: string;
    officeLocation: string;
    techStack: string[];
    isActive: boolean;
    status: string;
}


const StatCard = ({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: string }) => (
    <Box sx={{ flex: 1, bgcolor: '#fff', border: '1px solid', borderColor: 'grey.200', borderRadius: '12px', p: 2.5, borderTop: `3px solid ${accent}` }}>
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'grey.500', letterSpacing: '0.6px', mb: 1 }}>{label}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography sx={{ fontSize: 28, fontWeight: 800, color: 'grey.900' }}>{value}</Typography>
            <Typography sx={{ fontSize: 13, color: 'grey.500' }}>{sub}</Typography>
        </Box>
    </Box>
);

const PAGE_SIZE = 10;

const BenchOnboarding = () => {
    const { role, department: managerDept } = useSelector((state: RootState) => state.adminProfile);
    console.log(role, managerDept)
    const isManager = role === 'MANAGER';
    const isLND = managerDept?.toLowerCase().includes('l&d') || managerDept?.toLowerCase().includes('learning');

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [deptFilter, setDeptFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [techFilter, setTechFilter] = useState('');
    const [page, setPage] = useState(1);
    const [assignTarget, setAssignTarget] = useState<Employee | null>(null);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedMentor, setSelectedMentor] = useState('');
    const [courseSearch, setCourseSearch] = useState('');
    const [mentorSearch, setMentorSearch] = useState('');
    const [courses, setCourses] = useState<Course[]>([]);
    const [allUsers, setAllUsers] = useState<{ _id: string; name: string; role: string; department?: string }[]>([]);

    useEffect(() => {
        service.getCourses(1, 100)
            .then((res: any) => {
                const list: any[] = res?.data?.courses ?? res?.courses ?? (Array.isArray(res?.data) ? res.data : []);
                setCourses(list.map((c: any) => ({
                    _id: c._id || c.id,
                    title: c.course_title || c.title || '',
                    duration: c.duration_hours ? `${c.duration_hours}h` : (c.duration || ''),
                })));
            })
            .catch(() => { });
    }, []);

    useEffect(() => {
        service.getUsers({ page: 1, limit: 80 })
            .then((res: any) => {
                const list: any[] = res?.data?.users ?? res?.users ?? (Array.isArray(res?.data) ? res.data : []);
                setAllUsers(list.map((u: any) => ({
                    _id: u._id,
                    name: u.name || '',
                    role: u.role || '',
                    department: u.department || '',
                })));
            })
            .catch(() => { });
    }, []);

    useEffect(() => {
        setLoading(true);
        service.getUsers({ page: 1, limit: 80 })
            .then((res: any) => {
                const list: any[] = res?.data?.users ?? res?.users ?? (Array.isArray(res?.data) ? res.data : []);
                const mapped: Employee[] = list
                    .filter((u: any) => u.role?.toUpperCase() !== 'MANAGER')
                    .map((u: any) => ({
                        _id: u._id,
                        name: u.name || '',
                        email: u.email || '',
                        employeeId: u.employeeId || '',
                        department: u.department || '',
                        managerName: u.managerName || '—',
                        officeLocation: u.officeLocation || '—',
                        techStack: Array.isArray(u.technologies) ? u.technologies : [],
                        isActive: u.isActive ?? true,
                        status: { on_bench: 'On Bench', shadowing: 'Shadowing', on_project: 'On Project' }[u.status as string] ?? 'On Bench',
                    }));
                setEmployees(
                    isManager && managerDept
                        ? mapped.filter(e => e.department?.trim().toLowerCase() === managerDept.trim().toLowerCase())
                        : mapped
                );
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [isManager, managerDept]);

    const STATUS_API_MAP: Record<string, string> = {
        'On Bench': 'on_bench',
        'Shadowing': 'shadowing',
        'On Project': 'on_project',
    };

    const handleStatusChange = (id: string, newStatus: string) => {
        setEmployees(prev => prev.map(e => e._id === id ? { ...e, status: newStatus } : e));
        service.updateUserStatus(id, STATUS_API_MAP[newStatus] ?? newStatus.toLowerCase().replace(' ', '_'))
            .catch(() => {
                // revert on failure
                setEmployees(prev => prev.map(e => e._id === id ? { ...e, status: e.status } : e));
            });
    };

    const [assigning, setAssigning] = useState(false);

    const handleAssign = async () => {
        if (!assignTarget || !selectedCourse || !selectedMentor) return;
        setAssigning(true);
        try {
            await service.assignCourse({
                course_id: selectedCourse,
                mentor_id: selectedMentor,
                user_id: assignTarget._id,
            });
            setAssignTarget(null);
            setSelectedCourse('');
            setSelectedMentor('');
            setCourseSearch('');
            setMentorSearch('');
        } finally {
            setAssigning(false);
        }
    };

    const filtered = employees.filter(e =>
        (!deptFilter || e.department === deptFilter) &&
        (!statusFilter || e.status === statusFilter) &&
        (!techFilter || e.techStack.some(t => t.toLowerCase().includes(techFilter.toLowerCase())))
    );

    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
    const departments = [...new Set(employees.map(e => e.department))];

    const totalCount = employees.length;
    const onBenchCount = employees.filter(e => e.status === 'On Bench').length;
    const shadowingCount = employees.filter(e => e.status === 'Shadowing').length;
    const onProjectCount = employees.filter(e => e.status === 'On Project').length;

    return (
        <Fragment>
            <TabTitle title="Team Management" />
            <Box sx={{ width: '100%' }}>

                {/* Header */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'grey.900' }}>Team Management</Typography>
                    <Typography sx={{ color: 'grey.500', fontSize: 13, mt: 0.5 }}>Track and manage resources currently between projects.</Typography>
                </Box>

                {/* Stat Cards */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <StatCard label="TOTAL EMPLOYEES" value={String(totalCount)} sub="All members" accent="#C41E3A" />
                    <StatCard label="ON BENCH" value={String(onBenchCount)} sub="Awaiting project" accent="#2563EB" />
                    <StatCard label="SHADOWING" value={String(shadowingCount)} sub="Billable Ready" accent="#D97706" />
                    <StatCard label="ON PROJECT" value={String(onProjectCount)} sub="Active" accent="#16A34A" />
                </Box>

                {/* Table Card */}
                <Box sx={{ bgcolor: '#fff', border: '1px solid', borderColor: 'grey.200', borderRadius: '12px', overflow: 'hidden' }}>

                    {/* Filters */}
                    <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'grey.100', display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        {!isManager && (
                            <FormControl size="small" sx={{ minWidth: 160 }}>
                                <Select displayEmpty value={deptFilter} onChange={e => { setDeptFilter(e.target.value); setPage(1); }}
                                    startAdornment={<FilterListRounded sx={{ fontSize: 16, color: 'grey.500', mr: 0.5 }} />}
                                    sx={{ fontSize: 13, borderRadius: '8px' }} renderValue={v => v || 'All Departments'}>
                                    <MenuItem value="">All Departments</MenuItem>
                                    {departments.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                                </Select>
                            </FormControl>
                        )}

                        <FormControl size="small" sx={{ minWidth: 140 }}>
                            <Select displayEmpty value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                                startAdornment={<FlashOnRounded sx={{ fontSize: 16, color: 'grey.500', mr: 0.5 }} />}
                                sx={{ fontSize: 13, borderRadius: '8px' }} renderValue={v => v ? `Status: ${v}` : 'Status: All'}>
                                <MenuItem value="">All</MenuItem>
                                {Object.keys(STATUS_CONFIG).map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <Select displayEmpty value={techFilter} onChange={e => { setTechFilter(e.target.value); setPage(1); }}
                                startAdornment={<BuildRounded sx={{ fontSize: 16, color: 'grey.500', mr: 0.5 }} />}
                                sx={{ fontSize: 13, borderRadius: '8px' }} renderValue={v => v ? `Tech: ${v}` : 'Tech Stack: All'}>
                                <MenuItem value="">All</MenuItem>
                                {['React', 'TypeScript', 'Node.js', 'AWS', 'Terraform', 'Azure', 'SwiftUI', 'Kotlin', 'Python', 'PyTorch'].map(t => (
                                    <MenuItem key={t} value={t}>{t}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Typography sx={{ ml: 'auto', fontSize: 13, color: 'grey.500' }}>
                            Showing {filtered.length} employee{filtered.length !== 1 ? 's' : ''}
                        </Typography>
                    </Box>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                                    {['EMPLOYEE NAME', 'EMPLOYEE ID', 'DEPARTMENT', 'MANAGER', 'LOCATION', isLND ? 'HEAD COUNT' : 'STATUS', 'ACTIONS'].map(h => (
                                        <TableCell key={h} sx={{ fontSize: 11, fontWeight: 700, color: 'grey.500', letterSpacing: '0.5px', py: 1.5, whiteSpace: 'nowrap' }}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'grey.400', fontSize: 13 }}>
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : paginated.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'grey.400', fontSize: 13 }}>
                                            No employees found.
                                        </TableCell>
                                    </TableRow>
                                ) : null}
                                {!loading && paginated.map(emp => {
                                    const sc = STATUS_CONFIG[emp.status] ?? STATUS_CONFIG['On Bench'];
                                    const initials = emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                                    const isOnBench = emp.status === 'On Bench';
                                    return (
                                        <TableRow key={emp._id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                            <TableCell sx={{ py: 1.5 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{ width: 38, height: 38, fontSize: 13, fontWeight: 700, bgcolor: '#F3F4F6', color: 'grey.700' }}>{initials}</Avatar>
                                                    <Box>
                                                        <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: 'grey.900' }}>{emp.name}</Typography>
                                                        <Typography sx={{ fontSize: 12, color: 'grey.500' }}>{emp.email}</Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontSize: 13, color: 'grey.700', fontWeight: 500 }}>{emp.employeeId}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={emp.department} size="small" sx={{ fontSize: 11, fontWeight: 700, bgcolor: '#F3F4F6', color: 'grey.600', borderRadius: '6px' }} />
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontSize: 13, color: 'grey.700', fontWeight: 500 }}>{emp.managerName}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontSize: 13, color: 'grey.700', fontWeight: 500 }}>{emp.officeLocation}</Typography>
                                            </TableCell>

                                            {/* STATUS or HEAD COUNT */}
                                            <TableCell>
                                                {isLND ? (
                                                    <Typography sx={{ fontSize: 13, color: 'grey.700', fontWeight: 600 }}>1</Typography>
                                                ) : (
                                                    <Select
                                                        size="small"
                                                        value={emp.status}
                                                        onChange={(e) => handleStatusChange(emp._id, e.target.value as string)}
                                                        sx={{
                                                            width: 140,
                                                            fontSize: 12,
                                                            fontWeight: 600,
                                                            color: sc.color,
                                                            bgcolor: sc.bg,
                                                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                                            '& .MuiSelect-icon': { color: sc.color },
                                                        }}
                                                    >
                                                        {Object.keys(STATUS_CONFIG).map(s => (
                                                            <MenuItem key={s} value={s} sx={{ fontSize: 12, fontWeight: 500 }}>
                                                                {s}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                )}
                                            </TableCell>

                                            {/* ACTIONS — Assign Course only for On Bench */}
                                            <TableCell>
                                                {isOnBench && (
                                                    <Button
                                                        size="small"
                                                        startIcon={<MenuBookRounded sx={{ fontSize: 15 }} />}
                                                        onClick={() => { setAssignTarget(emp); setSelectedCourse(''); setSelectedMentor(''); setCourseSearch(''); setMentorSearch(''); }}
                                                        sx={{
                                                            textTransform: 'none', fontSize: 12, fontWeight: 600,
                                                            color: BRAND_RED, borderColor: '#FECDD3',
                                                            bgcolor: '#FFF1F2', borderRadius: '8px',
                                                            border: '1px solid #FECDD3',
                                                            whiteSpace: 'nowrap',
                                                            '&:hover': { bgcolor: '#FFE4E8' },
                                                        }}
                                                    >
                                                        Assign Course
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 1.5, borderTop: '1px solid', borderColor: 'grey.100' }}>
                        <Typography sx={{ fontSize: 13, color: 'grey.500' }}>Page {page} of {totalPages}</Typography>
                        <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} size="small"
                            sx={{ '& .MuiPaginationItem-root.Mui-selected': { bgcolor: BRAND_RED, color: '#fff', '&:hover': { bgcolor: '#6e1424' } } }} />
                    </Box>
                </Box>
            </Box>

            {/* Assign Course Modal */}
            <Modal open={!!assignTarget} onClose={() => { setAssignTarget(null); setSelectedCourse(''); setSelectedMentor(''); setCourseSearch(''); setMentorSearch(''); }}>
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '95vw', sm: '440px' },
                    bgcolor: '#fff', borderRadius: '16px', outline: 'none', p: 3,
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>Assign Course</Typography>
                        <IconButton size="small" onClick={() => setAssignTarget(null)}><CloseRounded /></IconButton>
                    </Box>

                    {assignTarget && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: '#F9FAFB', borderRadius: '10px', mb: 2.5 }}>
                            <Avatar sx={{ width: 36, height: 36, fontSize: 13, fontWeight: 700, bgcolor: '#F3F4F6', color: 'grey.700' }}>
                                {assignTarget.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </Avatar>
                            <Box>
                                <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: 'grey.900' }}>{assignTarget.name}</Typography>
                                <Typography sx={{ fontSize: 12, color: 'grey.500' }}>{assignTarget.employeeId} · {assignTarget.department}</Typography>
                            </Box>
                        </Box>
                    )}

                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'grey.600', mb: 0.8 }}>Mentor Name</Typography>
                    <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
                        <Select
                            displayEmpty
                            value={selectedMentor}
                            onChange={e => setSelectedMentor(e.target.value)}
                            renderValue={v => {
                                const u = allUsers.find(x => x._id === v);
                                return u ? u.name : <Typography sx={{ color: 'grey.400', fontSize: 13 }}>Select a mentor...</Typography>;
                            }}
                            sx={{ fontSize: 13, borderRadius: '8px' }}
                            MenuProps={{ autoFocus: false, slotProps: { paper: { sx: { maxHeight: 320 } }, list: { sx: { pt: 0, overflowY: 'auto' } } } }}
                            onClose={() => setMentorSearch('')}
                        >
                            <Box sx={{ px: 1.5, py: 1, position: 'sticky', top: 0, bgcolor: '#fff', zIndex: 1, borderBottom: '1px solid #F0F0F0' }}
                                onKeyDown={e => e.stopPropagation()}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, py: 0.6, border: '1px solid #E5E7EB', borderRadius: '8px', bgcolor: '#FAFAFA' }}>
                                    <SearchRounded sx={{ fontSize: 15, color: 'grey.400', flexShrink: 0 }} />
                                    <InputBase autoFocus fullWidth placeholder="Search mentors..." value={mentorSearch} onChange={e => setMentorSearch(e.target.value)} sx={{ fontSize: '13px' }} />
                                </Box>
                            </Box>
                            {allUsers
                                .filter(u => u.name.toLowerCase().includes(mentorSearch.toLowerCase()))
                                .map(u => (
                                    <MenuItem key={u._id} value={u._id}>
                                        <Box>
                                            <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{u.name}</Typography>
                                            <Typography sx={{ fontSize: 11, color: 'grey.500' }}>{u.role}{u.department ? ` · ${u.department}` : ''}</Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            {allUsers.filter(u => u.name.toLowerCase().includes(mentorSearch.toLowerCase())).length === 0 && (
                                <Typography sx={{ px: 2, py: 1.5, fontSize: 13, color: 'grey.400' }}>No mentors found</Typography>
                            )}
                        </Select>
                    </FormControl>

                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'grey.600', mb: 0.8 }}>Select Course</Typography>
                    <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                        <Select
                            displayEmpty
                            value={selectedCourse}
                            onChange={e => setSelectedCourse(e.target.value)}
                            renderValue={v => {
                                const c = courses.find((x: Course) => x._id === v);
                                return c ? c.title : <Typography sx={{ color: 'grey.400', fontSize: 13 }}>Choose a course...</Typography>;
                            }}
                            sx={{ fontSize: 13, borderRadius: '8px' }}
                            MenuProps={{ autoFocus: false, slotProps: { paper: { sx: { maxHeight: 320 } }, list: { sx: { pt: 0, overflowY: 'auto' } } } }}
                            onClose={() => setCourseSearch('')}
                        >
                            <Box sx={{ px: 1.5, py: 1, position: 'sticky', top: 0, bgcolor: '#fff', zIndex: 1, borderBottom: '1px solid #F0F0F0' }}
                                onKeyDown={e => e.stopPropagation()}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, py: 0.6, border: '1px solid #E5E7EB', borderRadius: '8px', bgcolor: '#FAFAFA' }}>
                                    <SearchRounded sx={{ fontSize: 15, color: 'grey.400', flexShrink: 0 }} />
                                    <InputBase autoFocus fullWidth placeholder="Search courses..." value={courseSearch} onChange={e => setCourseSearch(e.target.value)} sx={{ fontSize: '13px' }} />
                                </Box>
                            </Box>
                            {courses
                                .filter((c: Course) => c.title.toLowerCase().includes(courseSearch.toLowerCase()))
                                .map((c: Course) => (
                                    <MenuItem key={c._id} value={c._id}>
                                        <Box>
                                            <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{c.title}</Typography>
                                            <Typography sx={{ fontSize: 11, color: 'grey.500' }}>{c.duration}</Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            {courses.filter((c: Course) => c.title.toLowerCase().includes(courseSearch.toLowerCase())).length === 0 && (
                                <Typography sx={{ px: 2, py: 1.5, fontSize: 13, color: 'grey.400' }}>No courses found</Typography>
                            )}
                        </Select>
                    </FormControl>

                    <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
                        <Button onClick={() => setAssignTarget(null)} sx={{ textTransform: 'none', color: 'grey.600', borderRadius: '8px' }}>Cancel</Button>
                        <Button variant="contained" disabled={!selectedCourse || !selectedMentor || assigning} onClick={handleAssign}
                            sx={{ textTransform: 'none', bgcolor: BRAND_RED, borderRadius: '8px', '&:hover': { bgcolor: '#6e1424' }, '&:disabled': { bgcolor: 'grey.200' } }}>
                            Assign
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Fragment>
    );
};

export default BenchOnboarding;
