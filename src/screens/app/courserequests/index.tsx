import React, { Fragment, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Box, Typography, Card, TableContainer, Table, TableHead, TableRow,
    TableCell, TableBody, TablePagination, Button, CircularProgress, Chip
} from '@mui/material';
import { PlayCircleOutlineRounded } from '@mui/icons-material';
import { service } from '../../../service';
import TabTitle from '../../../components/tabtitle';
import { useStyle } from '../lndcourses/style';
import type { RootState } from '../../../store';

const CourseRequests = () => {
    const styles = useStyle();
    
    // Get logged in user ID from Redux
    const userId = useSelector((state: RootState) => state.adminProfile._id);
    
    // State for Assigned Courses
    const [assignedCourses, setAssignedCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

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
                // Defensive extraction based on possible API structures
                let list = [];
                if (res.data.data && Array.isArray(res.data.data)) {
                    list = res.data.data;
                } else if (res.data.courses && Array.isArray(res.data.courses)) {
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

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Fragment>
            <TabTitle title="My Course Requests" />
            <Box sx={styles.container}>
                
                {/* Header */}
                <Box sx={styles.headerContainer}>
                    <Box sx={styles.headerTextContainer}>
                        <Typography variant="h4" sx={styles.headerTitle}>
                            My Assigned Courses
                        </Typography>
                        <Typography variant="body1" sx={styles.headerSubtitle}>
                            View and start courses that have been assigned to you.
                        </Typography>
                    </Box>
                </Box>

                {/* Course List Table */}
                <Card sx={styles.tableCard}>
                    <Box sx={styles.tableHeader}>
                        <Typography variant="h6" sx={styles.tableHeaderTitle}>
                            Pending Requests
                        </Typography>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead sx={styles.tableHead}>
                                <TableRow>
                                    <TableCell sx={styles.tableCellHeader}>COURSE TITLE</TableCell>
                                    <TableCell sx={styles.tableCellHeader}>PROVIDER</TableCell>
                                    <TableCell sx={styles.tableCellHeader}>ASSIGNED BY</TableCell>
                                    <TableCell sx={styles.tableCellHeader}>DUE DATE</TableCell>
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
                                                You have no pending course assignments.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    assignedCourses.map((item: any, index: number) => {
                                        // The API might return an assignment wrapper object or the course directly depending on backend schema
                                        const course = item.course_id || item.course || item;
                                        return (
                                            <TableRow key={item._id || index} sx={styles.tableRow}>
                                                <TableCell>
                                                    <Typography variant="body2" sx={styles.tableTextPrimary}>
                                                        {course.course_title || course.title || '-'}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Level: {course.level || 'General'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={styles.tableTextBase}>
                                                        {course.provider || '-'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={styles.tableTextBase}>
                                                        {item.assigned_by?.name || item.assignedBy?.name || item.assigned_by || 'Admin'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={item.dueDate || item.due_date ? new Date(item.dueDate || item.due_date).toLocaleDateString() : 'No Deadline'} 
                                                        size="small" 
                                                        variant="outlined"
                                                        sx={{ fontWeight: 600, fontSize: '0.75rem' }} 
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Button 
                                                        variant="contained" 
                                                        size="small"
                                                        startIcon={<PlayCircleOutlineRounded />}
                                                        sx={{ textTransform: 'none', borderRadius: '6px', fontWeight: 600, background: '#1976d2', boxShadow: 'none' }}
                                                    >
                                                        Start Course
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
        </Fragment>
    );
};

export default CourseRequests;
