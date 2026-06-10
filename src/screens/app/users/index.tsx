import { Fragment, useState, useEffect, useRef, useMemo } from 'react';
import {
    Box, Typography, Button, Select, MenuItem, InputBase,
    Avatar, Chip, IconButton, Modal, FormControl,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Pagination, CircularProgress, OutlinedInput, Switch,
} from '@mui/material';
import {
    PersonAddRounded, FileDownloadRounded,
    EditRounded, MoreVertRounded, SearchRounded, CloseRounded, SaveRounded,
} from '@mui/icons-material';
import TabTitle from '../../../components/tabtitle';
import { service } from '../../../service';
import CreateUserForm from './createuser';
import { BRAND_RED } from './createuser/styles';

const PAGE_SIZE = 20;

interface User {
    _id: string;
    employeeId: string;
    name: string;
    email: string;
    role: string;
    department?: string;
    officeLocation?: string;
    isActive: boolean;
}

const Users = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [deptFilter, setDeptFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState<string[]>([]);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [editForm, setEditForm] = useState({ employeeId: '', name: '', email: '', password: '', isActive: true });
    const [editSubmitting, setEditSubmitting] = useState(false);

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const searchRef = useRef('');

    const doFetch = (searchVal: string) => {
        setLoading(true);
        const params: Record<string, any> = { page: 1, limit: 90 };
        if (searchVal) params.search = searchVal;
        service.getUsers(params)
            .then((res: any) => {
                // axios interceptor sets response.data = response.data.data
                // so res is the AxiosResponse object, res.data = { users, pagination }
                const list = res?.data?.users ?? res?.users ?? (Array.isArray(res?.data) ? res.data : []);
                setAllUsers(list);
            })
            .catch(() => setAllUsers([]))
            .finally(() => setLoading(false));
    };

    // fetch on mount
    useEffect(() => {
        doFetch('');
        service.getRoles()
            .then((res: any) => setRoles(Array.isArray(res) ? res : []))
            .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
        searchRef.current = value;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => doFetch(value), 400);
    };

    // reset page when filters change
    useEffect(() => { setPage(1); }, [deptFilter, roleFilter, statusFilter]);

    // client-side filter — status mapped from isActive
    const filtered = useMemo(() => allUsers.filter(u => {
        const statusLabel = u.isActive ? 'Active' : 'Inactive';
        return (
            (!deptFilter   || u.department === deptFilter) &&
            (!roleFilter   || u.role === roleFilter) &&
            (!statusFilter || statusLabel === statusFilter)
        );
    }), [allUsers, deptFilter, roleFilter, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageUsers = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const deptOptions = useMemo(() =>
        [...new Set(allUsers.map(u => u.department).filter(Boolean))] as string[],
        [allUsers]);
    const roleOptions = useMemo(() =>
        roles.length ? roles : [...new Set(allUsers.map(u => u.role).filter(Boolean))] as string[],
        [roles, allUsers]);

    const openEdit = (user: User) => {
        setEditUser(user);
        setEditForm({ employeeId: user.employeeId ?? '', name: user.name ?? '', email: user.email ?? '', password: '', isActive: user.isActive });
    };

    const handleEditSubmit = async () => {
        if (!editUser) return;
        if (!editForm.name || !editForm.email) {
            return;
        }
        setEditSubmitting(true);
        const payload: Record<string, any> = {
            employeeId: editForm.employeeId,
            name: editForm.name,
            email: editForm.email,
            isActive: editForm.isActive,
        };
        if (editForm.password) payload.password = editForm.password;
        try {
            await service.updateAdminUser(editUser._id, payload);
            setEditUser(null);
            doFetch(searchRef.current);
        } finally {
            setEditSubmitting(false);
        }
    };

    const clearFilters = () => { setDeptFilter(''); setRoleFilter(''); setStatusFilter(''); setSearch(''); };

    const handleExport = () => {
        const rows = [
            ['Employee ID', 'Name', 'Email', 'Role', 'Department', 'Office Location', 'Status'],
            ...filtered.map(u => [
                u.employeeId ?? '',
                u.name ?? '',
                u.email ?? '',
                u.role ?? '',
                u.department ?? '',
                u.officeLocation ?? '',
                u.isActive ? 'Active' : 'Inactive',
            ]),
        ];
        const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Fragment>
            <TabTitle title="User Management" />
            <Box sx={{ width: '100%' }}>

                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
                    <Box>
                        <Typography variant="h4" fontWeight={700} sx={{ color: 'grey.900' }}>User Management</Typography>
                        <Typography sx={{ color: 'grey.500', fontSize: 13, mt: 0.5 }}>Manage and oversee all enterprise learners</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Button variant="outlined" startIcon={<FileDownloadRounded />} onClick={handleExport}
                            sx={{ textTransform: 'none', fontSize: 13, borderColor: 'grey.300', color: 'grey.700', borderRadius: '8px' }}>
                            Export List
                        </Button>
                        <Button variant="contained" startIcon={<PersonAddRounded />} onClick={() => setModalOpen(true)}
                            sx={{ textTransform: 'none', fontSize: 13, borderRadius: '8px', background: BRAND_RED, '&:hover': { background: '#a01828' } }}>
                            Add User
                        </Button>
                    </Box>
                </Box>

                {/* Filters */}
                <Box sx={{ background: '#fff', border: '1px solid', borderColor: 'grey.200', borderRadius: '12px', p: 2.5, mb: 2.5 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr auto' }, gap: 2, alignItems: 'center' }}>
                        <Box>
                            <Typography sx={{ fontSize: 11, fontWeight: 600, color: 'grey.500', mb: 0.5 }}>DEPARTMENT</Typography>
                            <FormControl fullWidth size="small">
                                <Select displayEmpty value={deptFilter} onChange={e => setDeptFilter(e.target.value)} sx={{ fontSize: 13, borderRadius: '8px' }}>
                                    <MenuItem value="">All Departments</MenuItem>
                                    {deptOptions.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: 11, fontWeight: 600, color: 'grey.500', mb: 0.5 }}>ROLE</Typography>
                            <FormControl fullWidth size="small">
                                <Select displayEmpty value={roleFilter} onChange={e => setRoleFilter(e.target.value)} sx={{ fontSize: 13, borderRadius: '8px' }}>
                                    <MenuItem value="">All Roles</MenuItem>
                                    {roleOptions.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: 11, fontWeight: 600, color: 'grey.500', mb: 0.5 }}>STATUS</Typography>
                            <FormControl fullWidth size="small">
                                <Select displayEmpty value={statusFilter} onChange={e => setStatusFilter(e.target.value)} sx={{ fontSize: 13, borderRadius: '8px' }}>
                                    <MenuItem value="">All Status</MenuItem>
                                    {['Active', 'Inactive', 'Pending'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Box>
                        <Button onClick={clearFilters}
                            sx={{ textTransform: 'none', fontSize: 13, color: BRAND_RED, fontWeight: 600, whiteSpace: 'nowrap', mt: { xs: 0, sm: 2.5 } }}>
                            Clear Filters
                        </Button>
                    </Box>
                </Box>

                {/* Table */}
                <Box sx={{ background: '#fff', border: '1px solid', borderColor: 'grey.200', borderRadius: '12px', overflow: 'hidden' }}>
                    <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'grey.100', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SearchRounded sx={{ color: 'grey.400', fontSize: 18 }} />
                        <InputBase fullWidth placeholder="Search users, roles, or departments..."
                            value={search} onChange={e => handleSearchChange(e.target.value)} sx={{ fontSize: 13 }} />
                    </Box>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ background: '#F9FAFB' }}>
                                    {['USER DETAILS', 'DEPARTMENT', 'ROLE', 'STATUS', 'ACTIONS'].map(h => (
                                        <TableCell key={h} sx={{ fontSize: 11, fontWeight: 700, color: 'grey.500', letterSpacing: '0.5px', py: 1.5 }}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                            <CircularProgress size={28} sx={{ color: BRAND_RED }} />
                                        </TableCell>
                                    </TableRow>
                                ) : pageUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'grey.400', fontSize: 13 }}>
                                            No users found
                                        </TableCell>
                                    </TableRow>
                                ) : pageUsers.map(user => {
                                    const initials = (user.name ?? '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                                    const statusLabel = user.isActive ? 'Active' : 'Inactive';
                                    const statusColor = user.isActive ? '#15803D' : '#6B7280';
                                    return (
                                        <TableRow key={user._id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                            <TableCell sx={{ py: 1.5 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{ width: 38, height: 38, fontSize: 13, fontWeight: 700, bgcolor: '#F3F4F6', color: 'grey.700' }}>
                                                        {initials}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: 'grey.900' }}>{user.name}</Typography>
                                                        <Typography sx={{ fontSize: 12, color: 'grey.500' }}>{user.email}</Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={user.department || '—'} size="small"
                                                    sx={{ fontSize: 12, bgcolor: '#F3F4F6', color: 'grey.700', borderRadius: '6px' }} />
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontSize: 13, color: 'grey.700' }}>{user.role}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
                                                    <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: statusColor }} />
                                                    <Typography sx={{ fontSize: 13, color: statusColor, fontWeight: 500 }}>{statusLabel}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                    <IconButton size="small" sx={{ color: 'grey.500' }} onClick={() => openEdit(user)}><EditRounded fontSize="small" /></IconButton>
                                                    <IconButton size="small" sx={{ color: 'grey.500' }}><MoreVertRounded fontSize="small" /></IconButton>
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
                            {filtered.length > 0
                                ? `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length.toLocaleString()} users`
                                : 'No users found'}
                        </Typography>
                        <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)}
                            size="small" siblingCount={1} boundaryCount={1}
                            sx={{ '& .MuiPaginationItem-root.Mui-selected': { bgcolor: BRAND_RED, color: '#fff', '&:hover': { bgcolor: '#a01828' } } }}
                        />
                    </Box>
                </Box>
            </Box>

            {/* Edit User Modal */}
            <Modal open={!!editUser} onClose={() => setEditUser(null)}>
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '95vw', sm: '480px' },
                    bgcolor: '#fff', borderRadius: '16px', outline: 'none', p: 3,
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                        <Typography variant="h5" fontWeight={700} sx={{ color: 'grey.900' }}>Edit User</Typography>
                        <IconButton size="small" onClick={() => setEditUser(null)}><CloseRounded /></IconButton>
                    </Box>

                    {([
                        { label: 'Employee ID', key: 'employeeId', placeholder: 'e.g. NADM001' },
                        { label: 'Full Name', key: 'name', placeholder: 'Enter full name' },
                        { label: 'Email', key: 'email', placeholder: 'Enter email' },
                        { label: 'New Password', key: 'password', placeholder: 'Leave blank to keep unchanged', type: 'password' },
                    ] as const).map(({ label, key, placeholder, type }) => (
                        <Box key={key} sx={{ mb: 2 }}>
                            <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'grey.600', mb: 0.5 }}>{label}</Typography>
                            <OutlinedInput
                                fullWidth size="small" type={type ?? 'text'} placeholder={placeholder}
                                value={editForm[key]}
                                onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                                sx={{ fontSize: 13, borderRadius: '8px' }}
                            />
                        </Box>
                    ))}

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'grey.700' }}>Active Status</Typography>
                        <Switch
                            checked={editForm.isActive}
                            onChange={e => setEditForm(f => ({ ...f, isActive: e.target.checked }))}
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': { color: BRAND_RED },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: BRAND_RED },
                            }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
                        <Button onClick={() => setEditUser(null)}
                            sx={{ textTransform: 'none', color: 'grey.600', borderRadius: '8px' }}>
                            Cancel
                        </Button>
                        <Button variant="contained" startIcon={<SaveRounded />} disabled={editSubmitting} onClick={handleEditSubmit}
                            sx={{ textTransform: 'none', bgcolor: BRAND_RED, borderRadius: '8px', '&:hover': { bgcolor: '#a01828' } }}>
                            {editSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Add User Modal */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '95vw', sm: '80vw', md: '760px' },
                    maxHeight: '90vh', overflowY: 'auto',
                    bgcolor: '#f7f9fc', borderRadius: '16px', outline: 'none', p: 3,
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h5" fontWeight={700} sx={{ color: 'grey.900' }}>Add New User</Typography>
                        <IconButton onClick={() => setModalOpen(false)} size="small"><CloseRounded /></IconButton>
                    </Box>
                    <CreateUserForm onSuccess={() => { setModalOpen(false); doFetch(searchRef.current); }} />
                </Box>
            </Modal>
        </Fragment>
    );
};

export default Users;
