import { CloseRounded } from '@mui/icons-material';
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
    Select,
    Stack,
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
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [isAssigning, setIsAssigning] = useState(false);

    // Form data
    const [users, setUsers] = useState<any[]>([]);
    const [coursesList, setCoursesList] = useState<any[]>([]);

    const [formUser, setFormUser] = useState('');
    const [formUserLabel, setFormUserLabel] = useState('');
    const [formCourse, setFormCourse] = useState('');
    const [formCourseLabel, setFormCourseLabel] = useState('');
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
                service.getUsers({ page: 1, limit: 90 }),
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
        setFormUser(item.user_id || '');
        setFormUserLabel(item.user_name || item.user_email || '');
        setFormCourse(item.course_id || '');
        setFormCourseLabel(item.course_title || '');
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
            setFormUserLabel('');
            setFormCourse('');
            setFormCourseLabel('');
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
                                                    {(item.course_assigned === true && item.coordinator_id) ? (
                                                        <Chip
                                                            label="Course Started"
                                                            size="small"
                                                            sx={{ fontWeight: 600, fontSize: '0.75rem', bgcolor: '#EFF6FF', color: '#1D4ED8', border: 'none' }}
                                                        />
                                                    ) : (
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={() => handleOpenAssignRow(item)}
                                                            sx={{ textTransform: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.75rem', borderColor: 'grey.400', color: 'grey.700' }}
                                                        >
                                                            Start Course
                                                        </Button>
                                                    )}
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
                    {/* Employee (pre-filled from row, shown as chip) */}
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>
                        Employee
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 3, minHeight: 32 }}>
                        {formUser ? (
                            <Chip
                                label={formUserLabel || formUser}
                                onDelete={() => { setFormUser(''); setFormUserLabel(''); }}
                                size="small"
                                sx={{ fontWeight: 600, bgcolor: 'grey.100' }}
                            />
                        ) : (
                            <Typography variant="body2" color="text.disabled" sx={{ lineHeight: '28px' }}>
                                No employee selected
                            </Typography>
                        )}
                    </Stack>

                    {/* Course */}
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>
                        Course
                    </Typography>
                    {formCourse && (
                        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 1 }}>
                            <Chip
                                label={formCourseLabel || formCourse}
                                onDelete={() => { setFormCourse(''); setFormCourseLabel(''); }}
                                size="small"
                                sx={{ fontWeight: 600, bgcolor: 'grey.100' }}
                            />
                        </Stack>
                    )}
                    <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                        <InputLabel id="course-select" shrink={!!formCourse}>Select Course</InputLabel>
                        <Select labelId="course-select" value={formCourse} label="Select Course" notched={!!formCourse}
                            onChange={(e) => {
                                const selected = coursesList.find(c => c._id === e.target.value);
                                setFormCourse(e.target.value);
                                setFormCourseLabel(selected?.title || selected?.course_title || '');
                            }}
                        >
                            {coursesList.map(c => (
                                <MenuItem key={c._id} value={c._id}>{c.title || c.course_title}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Coordinator */}
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>
                        Coordinator (Mentor)
                    </Typography>
                    {formCoordinator && (
                        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 1 }}>
                            <Chip
                                label={users.find(u => u._id === formCoordinator)?.name || formCoordinator}
                                onDelete={() => setFormCoordinator('')}
                                size="small"
                                sx={{ fontWeight: 600, bgcolor: 'grey.100' }}
                            />
                        </Stack>
                    )}
                    <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                        <InputLabel id="mentor-select" shrink={!!formCoordinator}>Select Coordinator</InputLabel>
                        <Select labelId="mentor-select" value={formCoordinator} label="Select Coordinator" notched={!!formCoordinator}
                            onChange={(e) => setFormCoordinator(e.target.value)}
                        >
                            {users.map(u => (
                                <MenuItem key={u._id} value={u._id}>{u.name} {u.employeeId ? `(${u.employeeId})` : ''}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setAssignModalOpen(false)}
                        sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 500, flex: 1 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        disabled={isAssigning || !formUser || !formCourse || !formCoordinator}
                        onClick={handleAssignCourse}
                        sx={{ ...styles.submitButton, flex: 1, py: 1, fontSize: '15px' }}
                    >
                        {isAssigning ? 'Assigning...' : 'Assign'}
                    </Button>
                </DialogActions>
            </Dialog>


        </Fragment>
    );
};

export default CourseRequests;
