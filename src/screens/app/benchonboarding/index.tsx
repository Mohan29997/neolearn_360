import { Fragment, useState } from 'react';
import {
    Box, Typography, Button, Avatar, Chip, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Select, MenuItem, FormControl, Pagination, InputBase,
} from '@mui/material';
import {
    PersonAddAlt1Rounded, TrendingUpRounded,
    FilterListRounded, FlashOnRounded, BuildRounded,
} from '@mui/icons-material';
import TabTitle from '../../../components/tabtitle';

const BRAND_RED = '#8B1A2E';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    'On Bench':    { label: 'On Bench',    color: '#C41E3A', bg: '#FFF1F2' },
    'In Training': { label: 'In Training', color: '#2563EB', bg: '#EFF6FF' },
    'Available':   { label: 'Available',   color: '#16A34A', bg: '#F0FDF4' },
    'Shadowing':   { label: 'Shadowing',   color: '#D97706', bg: '#FFFBEB' },
};

const MOCK_EMPLOYEES = [
    { _id: '1', name: 'Alexander Mitchell', email: 'alex.m@neosoft.com', employeeId: 'NS-10294', department: 'FRONTEND TECH', benchDuration: '12 Days', techStack: ['React', 'TypeScript'], status: 'On Bench' },
    { _id: '2', name: 'Sarah Jenkins',      email: 's.jenkins@neosoft.com', employeeId: 'NS-11452', department: 'BACKEND OPS',    benchDuration: '05 Days', techStack: ['Node.js', 'AWS'],        status: 'In Training' },
    { _id: '3', name: 'David Chen',         email: 'david.chen@neosoft.com', employeeId: 'NS-09871', department: 'CLOUD ARCHITECTURE', benchDuration: '22 Days', techStack: ['Terraform', 'Azure'],   status: 'Available' },
    { _id: '4', name: 'Maya Rodriguez',     email: 'maya.r@neosoft.com',  employeeId: 'NS-12003', department: 'MOBILE DEV',      benchDuration: '02 Days', techStack: ['SwiftUI', 'Kotlin'],     status: 'Shadowing' },
    { _id: '5', name: 'James Wilson',       email: 'j.wilson@neosoft.com', employeeId: 'NS-10884', department: 'DATA SCIENCE',   benchDuration: '08 Days', techStack: ['Python', 'PyTorch'],     status: 'On Bench' },
];

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
    const [deptFilter, setDeptFilter]     = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [techFilter, setTechFilter]     = useState('');
    const [page, setPage]                 = useState(1);

    const filtered = MOCK_EMPLOYEES.filter(e =>
        (!deptFilter   || e.department === deptFilter) &&
        (!statusFilter || e.status === statusFilter) &&
        (!techFilter   || e.techStack.some(t => t.toLowerCase().includes(techFilter.toLowerCase())))
    );

    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;

    const departments = [...new Set(MOCK_EMPLOYEES.map(e => e.department))];

    return (
        <Fragment>
            <TabTitle title="Bench Onboarding" />
            <Box sx={{ width: '100%' }}>

                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
                    <Box>
                        <Typography variant="h4" fontWeight={800} sx={{ color: 'grey.900' }}>Bench Onboarding</Typography>
                        <Typography sx={{ color: 'grey.500', fontSize: 13, mt: 0.5 }}>Track and manage resources currently between projects.</Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<PersonAddAlt1Rounded />}
                        sx={{ textTransform: 'none', fontSize: 13, fontWeight: 700, borderRadius: '8px', bgcolor: BRAND_RED, px: 2.5, '&:hover': { bgcolor: '#6e1424' } }}
                    >
                        Add Employee to Bench
                    </Button>
                </Box>

                {/* Stat Cards */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <StatCard label="TOTAL ON BENCH"  value="42" sub="↗ 12%"          accent="#C41E3A" />
                    <StatCard label="IN TRAINING"     value="18" sub="Active POCs"     accent="#2563EB" />
                    <StatCard label="SHADOWING"       value="09" sub="Billable Ready"  accent="#16A34A" />
                    <StatCard label="AVG. DURATION"   value="14d" sub="Bench Age"      accent="#D97706" />
                </Box>

                {/* Table Card */}
                <Box sx={{ bgcolor: '#fff', border: '1px solid', borderColor: 'grey.200', borderRadius: '12px', overflow: 'hidden' }}>

                    {/* Filters */}
                    <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'grey.100', display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <FormControl size="small" sx={{ minWidth: 160 }}>
                            <Select
                                displayEmpty
                                value={deptFilter}
                                onChange={e => { setDeptFilter(e.target.value); setPage(1); }}
                                startAdornment={<FilterListRounded sx={{ fontSize: 16, color: 'grey.500', mr: 0.5 }} />}
                                sx={{ fontSize: 13, borderRadius: '8px' }}
                                renderValue={v => v || 'All Departments'}
                            >
                                <MenuItem value="">All Departments</MenuItem>
                                {departments.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 140 }}>
                            <Select
                                displayEmpty
                                value={statusFilter}
                                onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                                startAdornment={<FlashOnRounded sx={{ fontSize: 16, color: 'grey.500', mr: 0.5 }} />}
                                sx={{ fontSize: 13, borderRadius: '8px' }}
                                renderValue={v => v ? `Status: ${v}` : 'Status: All'}
                            >
                                <MenuItem value="">All</MenuItem>
                                {Object.keys(STATUS_CONFIG).map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <Select
                                displayEmpty
                                value={techFilter}
                                onChange={e => { setTechFilter(e.target.value); setPage(1); }}
                                startAdornment={<BuildRounded sx={{ fontSize: 16, color: 'grey.500', mr: 0.5 }} />}
                                sx={{ fontSize: 13, borderRadius: '8px' }}
                                renderValue={v => v ? `Tech: ${v}` : 'Tech Stack: All'}
                            >
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
                                    {['EMPLOYEE NAME', 'EMPLOYEE ID', 'DEPARTMENT', 'BENCH DURATION', 'TECH STACK', 'STATUS'].map(h => (
                                        <TableCell key={h} sx={{ fontSize: 11, fontWeight: 700, color: 'grey.500', letterSpacing: '0.5px', py: 1.5, whiteSpace: 'nowrap' }}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginated.map(emp => {
                                    const sc = STATUS_CONFIG[emp.status] ?? STATUS_CONFIG['On Bench'];
                                    const initials = emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
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
                                                <Chip label={emp.department} size="small" sx={{ fontSize: 11, fontWeight: 700, bgcolor: '#F3F4F6', color: 'grey.600', borderRadius: '6px', letterSpacing: '0.3px' }} />
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontSize: 13, color: 'grey.700', fontWeight: 500 }}>{emp.benchDuration}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                    {emp.techStack.map(t => (
                                                        <Chip key={t} label={t} size="small" sx={{ fontSize: 11, fontWeight: 600, bgcolor: '#FFF1F2', color: BRAND_RED, border: '1px solid #FECDD3', borderRadius: '6px', width: 'fit-content' }} />
                                                    ))}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                    <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: sc.color }} />
                                                    <Typography sx={{ fontSize: 13, color: sc.color, fontWeight: 600 }}>{sc.label}</Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 1.5, borderTop: '1px solid', borderColor: 'grey.100' }}>
                        <Typography sx={{ fontSize: 13, color: 'grey.500' }}>
                            Page {page} of {totalPages}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Pagination
                                count={totalPages} page={page} onChange={(_, v) => setPage(v)} size="small"
                                sx={{ '& .MuiPaginationItem-root.Mui-selected': { bgcolor: BRAND_RED, color: '#fff', '&:hover': { bgcolor: '#6e1424' } } }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography sx={{ fontSize: 13, color: 'grey.500' }}>Rows per page:</Typography>
                                <Box sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: '6px', px: 1, py: 0.3 }}>
                                    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>10</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Fragment>
    );
};

export default BenchOnboarding;
