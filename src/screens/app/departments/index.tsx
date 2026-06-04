import { Fragment, useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Button, InputBase, IconButton, Modal,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Pagination, CircularProgress, Chip,
} from '@mui/material';
import { AddRounded, SearchRounded, CloseRounded, CorporateFareRounded, EditRounded } from '@mui/icons-material';
import TabTitle from '../../../components/tabtitle';
import { service } from '../../../service';
import CreateDepartmentForm from './createdepartment';
import { BRAND_RED } from './createdepartment/styles';

const PAGE_SIZE = 10;

interface Department {
    _id: string;
    name: string;
    description: string;
    managerName?: string;
    employeeId?: string;
    isActive: boolean;
    createdAt: string;
}

const Departments = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editDept, setEditDept] = useState<Department | null>(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchDepartments = useCallback(() => {
        setLoading(true);
        service.getDepartments()
            .then((res: any) => {
                const raw = res?.data;
                const list = Array.isArray(raw) ? raw : (raw?.departments ?? raw?.data ?? []);
                setDepartments(list);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchDepartments(); }, [fetchDepartments]);

    const openAdd = () => { setEditDept(null); setModalOpen(true); };
    const openEdit = (dept: Department) => { setEditDept(dept); setModalOpen(true); };
    const closeModal = () => { setModalOpen(false); setEditDept(null); };

    const filtered = departments.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.description?.toLowerCase().includes(search.toLowerCase())
    );

    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;

    return (
        <Fragment>
            <TabTitle title="Departments" />
            <Box sx={{ width: '100%' }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
                    <Box>
                        <Typography variant="h4" fontWeight={700} sx={{ color: 'grey.900' }}>Departments</Typography>
                        <Typography sx={{ color: 'grey.500', fontSize: 13, mt: 0.5 }}>Manage all corporate departments</Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddRounded />}
                        onClick={openAdd}
                        sx={{ textTransform: 'none', fontSize: 13, borderRadius: '8px', background: BRAND_RED, '&:hover': { background: '#a01828' } }}
                    >
                        Add Department
                    </Button>
                </Box>

                {/* Table */}
                <Box sx={{ background: '#fff', border: '1px solid', borderColor: 'grey.200', borderRadius: '12px', overflow: 'hidden' }}>
                    <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'grey.100', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SearchRounded sx={{ color: 'grey.400', fontSize: 18 }} />
                        <InputBase fullWidth placeholder="Search departments..." value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }} sx={{ fontSize: 13 }} />
                    </Box>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ background: '#F9FAFB' }}>
                                    {['DEPARTMENT', 'DESCRIPTION', 'MANAGER', 'STATUS', 'CREATED AT', 'ACTIONS'].map(h => (
                                        <TableCell key={h} sx={{ fontSize: 11, fontWeight: 700, color: 'grey.500', letterSpacing: '0.5px', py: 1.5 }}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                            <CircularProgress size={28} sx={{ color: BRAND_RED }} />
                                        </TableCell>
                                    </TableRow>
                                ) : paginated.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'grey.400', fontSize: 13 }}>
                                            No departments found
                                        </TableCell>
                                    </TableRow>
                                ) : paginated.map(dept => (
                                    <TableRow key={dept._id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                        <TableCell sx={{ py: 1.5 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <CorporateFareRounded sx={{ color: BRAND_RED, fontSize: 18 }} />
                                                </Box>
                                                <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: 'grey.900' }}>{dept.name}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontSize: 13, color: 'grey.600' }}>{dept.description || '—'}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontSize: 13, color: 'grey.700', fontWeight: 500 }}>{dept.managerName || '—'}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={dept.isActive ? 'Active' : 'Inactive'}
                                                size="small"
                                                sx={{
                                                    fontSize: 12, borderRadius: '6px',
                                                    bgcolor: dept.isActive ? '#DCFCE7' : '#F3F4F6',
                                                    color: dept.isActive ? '#15803D' : '#6B7280',
                                                    fontWeight: 600,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontSize: 13, color: 'grey.500' }}>
                                                {new Date(dept.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton size="small" sx={{ color: 'grey.500' }} onClick={() => openEdit(dept)}>
                                                <EditRounded fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 1.5, borderTop: '1px solid', borderColor: 'grey.100' }}>
                        <Typography sx={{ fontSize: 13, color: 'grey.500' }}>
                            {filtered.length > 0
                                ? `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length} departments`
                                : 'No departments found'}
                        </Typography>
                        <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} size="small"
                            sx={{ '& .MuiPaginationItem-root.Mui-selected': { bgcolor: BRAND_RED, color: '#fff', '&:hover': { bgcolor: '#a01828' } } }} />
                    </Box>
                </Box>
            </Box>

            {/* Add / Edit Department Modal */}
            <Modal open={modalOpen} onClose={closeModal}>
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '95vw', sm: '480px' },
                    bgcolor: '#fff', borderRadius: '16px', outline: 'none', p: 3,
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                        <Typography variant="h5" fontWeight={700} sx={{ color: 'grey.900' }}>
                            {editDept ? 'Edit Department' : 'Add New Department'}
                        </Typography>
                        <IconButton onClick={closeModal} size="small"><CloseRounded /></IconButton>
                    </Box>
                    <CreateDepartmentForm
                        editData={editDept}
                        onSuccess={() => { closeModal(); fetchDepartments(); }}
                    />
                </Box>
            </Modal>
        </Fragment>
    );
};

export default Departments;
