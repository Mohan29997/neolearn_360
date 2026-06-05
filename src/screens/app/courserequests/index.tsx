import { AddRounded, CloseRounded } from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import TabTitle from '../../../components/tabtitle';
import { SnackNotification } from '../../../helper/snackMessage';
import { service } from '../../../service';
import { useStyle } from '../lndcourses/style';

const CourseRequests = () => {
    const styles = useStyle();

    // State for Assigned Courses
    const [assignedCourses, setAssignedCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    // Modals
    const [startModalOpen, setStartModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);

    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [isAssigning, setIsAssigning] = useState(false);

    // Form data
    const [users, setUsers] = useState<any[]>([]);
    const [coursesList, setCoursesList] = useState<any[]>([]);

    const [formUser, setFormUser] = useState('');
    const [formCourse, setFormCourse] = useState('');
    const [formCoordinator, setFormCoordinator] = useState('');

    useEffect(() => {
        fetchAssignedCourses();
    }, [page, rowsPerPage]);

    const fetchAssignedCourses = async () => {
        try {
            setIsLoading(true);
            const res = await service.getAssignedCourses({
                page: page + 1,
                limit: rowsPerPage
            });
            if (res && res.data) {
                let list = [];
                if (res.data?.assignments && Array.isArray(res.data.assignments)) {
                    list = res.data.assignments;
                } else if (res.data?.data?.assignments && Array.isArray(res.data.data.assignments)) {
                    list = res.data.data.assignments;
                } else if (res.data?.data && Array.isArray(res.data.data)) {
                    list = res.data.data;
                } else if (res.data?.courses && Array.isArray(res.data.courses)) {
                    list = res.data.courses;
                } else if (Array.isArray(res.data)) {
                    list = res.data;
                }
                setAssignedCourses(list);

                if (res.data.pagination?.total) {
                    setTotalCount(res.data.pagination.total);
                } else {
                    setTotalCount(res.data.total || list.length);
                }
            }
        } catch (error) {
            console.error("Failed to fetch assigned courses:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchFormData = async () => {
        try {
            const [uRes, cRes] = await Promise.all([
                service.getUsers({ page: 1, limit: 100 }),
                service.getCourses(1, 100)
            ]);
            console.log('===>', uRes)
            if (uRes?.data) setUsers(uRes.data.users);
            else if (Array.isArray(uRes?.data?.users)) setUsers(uRes.data.users);

            if (cRes?.data?.courses) setCoursesList(cRes.data.courses);
            else if (Array.isArray(cRes?.data)) setCoursesList(cRes.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleOpenAssignRow = (item: any) => {
        // user_id in the payload expects the USER_OBJECT_ID
        setFormUser(item.user_id || '');
        setFormCourse(item.course_id || '');
        setFormCoordinator('');
        setAssignModalOpen(true);
        fetchFormData();
    };

    const handleAssignCourse = async () => {
        if (!formUser || !formCourse || !formCoordinator) {
            return SnackNotification("Please select course and coordinator", "error");
        }
        setIsAssigning(true)
        try {
            await service.updateAssignedCourse({
                user_id: formUser,
                coordinator_id: formCoordinator,
                course_id: formCourse
            });
            SnackNotification("Course assigned successfully", "success");
            setAssignModalOpen(false);
            setFormUser('');
            setFormCourse('');
            setFormCoordinator('');
            fetchAssignedCourses();
        } catch (e: any) {
            SnackNotification(e?.response?.data?.message || "Failed to assign course", "error");
        } finally {
            setIsAssigning(false);
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Fragment>
            <TabTitle title="Course Assignments" />
            <Box sx={styles.container}>

                {/* Header */}
                <Box sx={styles.headerContainer}>
                    <Box sx={styles.headerTextContainer}>
                        <Typography variant="h4" sx={styles.headerTitle}>
                            Course Assignments
                        </Typography>
                        <Typography variant="body1" sx={styles.headerSubtitle}>
                            Manage and view all employee course assignments.
                        </Typography>
                    </Box>
                </Box>

                {/* Course List Table */}
                <Card sx={styles.tableCard}>
                    <Box sx={styles.tableHeader}>
                        <Typography variant="h6" sx={styles.tableHeaderTitle}>
                            All Assignments
                        </Typography>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead sx={styles.tableHead}>
                                <TableRow>
                                    <TableCell sx={styles.tableCellHeader}>EMPLOYEE</TableCell>
                                    <TableCell sx={styles.tableCellHeader}>COURSE TITLE</TableCell>
                                    <TableCell sx={styles.tableCellHeader}>MENTOR</TableCell>
                                    <TableCell sx={styles.tableCellHeader}>STATUS</TableCell>
                                    <TableCell sx={styles.tableCellHeader} align="right">ACTION</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                            <CircularProgress size={30} />
                                        </TableCell>
                                    </TableRow>
                                ) : (!assignedCourses || assignedCourses.length === 0) ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                            <Typography variant="body1" sx={styles.tableTextBase}>
                                                No course assignments found.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    assignedCourses.map((item: any, index: number) => {
                                        return (
                                            <TableRow key={item._id || index} sx={styles.tableRow}>
                                                <TableCell>
                                                    <Typography variant="body2" sx={styles.tableTextPrimary}>
                                                        {item.user_name || '-'}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {item.user_email || ''}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={styles.tableTextBase}>
                                                        {item.course_title || '-'}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Progress: {item.progress_percent || 0}%
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={styles.tableTextBase}>
                                                        {item.mentor_name || 'Admin'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={item.status === 'not_started' ? 'Not Started' : item.status}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'capitalize' }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        startIcon={<AddRounded />}
                                                        onClick={() => handleOpenAssignRow(item)}
                                                        sx={{ textTransform: 'none', borderRadius: '6px', fontWeight: 600, background: '#1976d2', boxShadow: 'none', mr: 1 }}
                                                    >
                                                        Assign Course
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 20]}
                        component="div"
                        count={totalCount || assignedCourses.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Box>

            {/* Assign Course Modal */}
            <Dialog
                open={assignModalOpen}
                onClose={() => setAssignModalOpen(false)}
                PaperProps={{ sx: { borderRadius: '16px', width: 450, p: 1 } }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                    <Typography variant="h6" fontWeight={700}>Assign Course to Employee</Typography>
                    <IconButton onClick={() => setAssignModalOpen(false)} size="small" sx={{ ml: 2 }}>
                        <CloseRounded />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ pt: '16px !important' }}>
                    <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                        <InputLabel id="course-select">Select Course</InputLabel>
                        <Select labelId="course-select" value={formCourse} label="Select Course" onChange={(e) => setFormCourse(e.target.value)}>
                            {coursesList.map(c => (
                                <MenuItem key={c._id} value={c._id}>{c.title || c.course_title}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                        <InputLabel id="mentor-select">Select Coordinator (Mentor)</InputLabel>
                        <Select labelId="mentor-select" value={formCoordinator} label="Select Coordinator (Mentor)" onChange={(e) => setFormCoordinator(e.target.value)}>
                            {users.map(u => (
                                <MenuItem key={u._id} value={u._id}>{u.name} {u.employeeId ? `(${u.employeeId})` : ''}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3, flexDirection: 'column', gap: 1 }}>
                    <Typography
                        variant="body1"
                        onClick={() => setAssignModalOpen(false)}
                        sx={{ cursor: 'pointer', mb: 1, fontWeight: 500, alignSelf: 'center' }}
                    >
                        Cancel
                    </Typography>
                    <Button
                        fullWidth
                        variant="contained"
                        disabled={isAssigning || !formUser || !formCourse || !formCoordinator}
                        onClick={handleAssignCourse}
                        sx={{
                            background: '#ff7b7b',
                            '&:hover': { background: '#ff5c5c' },
                            color: 'white',
                            py: 1.2,
                            borderRadius: '8px',
                            fontSize: '16px',
                            textTransform: 'none',
                            ml: '0 !important'
                        }}
                    >
                        {isAssigning ? 'Assigning...' : 'Assign'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Start Course / Details Modal */}
            <Modal open={startModalOpen} onClose={() => setStartModalOpen(false)}>
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: 400, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4
                }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" fontWeight={700}>Course Details</Typography>
                        <IconButton onClick={() => setStartModalOpen(false)} size="small">
                            <CloseRounded />
                        </IconButton>
                    </Box>
                    <Typography variant="body1" mb={3}>
                        <strong>{selectedCourse?.user_name}</strong> is assigned to <strong>{selectedCourse?.course_title || 'this course'}</strong>.
                        <br /><br />
                        Progress: {selectedCourse?.progress_percent || 0}%
                    </Typography>
                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button onClick={() => setStartModalOpen(false)} color="inherit">Close</Button>
                    </Box>
                </Box>
            </Modal>
        </Fragment>
    );
};

export default CourseRequests;
