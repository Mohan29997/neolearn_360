import React, { Fragment, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  CircularProgress,
  Chip,
  Tooltip
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon, DeleteOutlineRounded } from '@mui/icons-material';
import { useStyle } from '../lndcourses/style';
import AddCourse from './addcourse';
import { service } from '../../../service';

const Courses = () => {
  const styles = useStyle();
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      // API page is 1-indexed, MUI TablePagination page is 0-indexed
      const res = await service.getCourses(page + 1, rowsPerPage);
      if (res && res.data) {
        if (res.data.courses && Array.isArray(res.data.courses)) {
          setCourses(res.data.courses);
        } else if (Array.isArray(res.data)) {
          setCourses(res.data);
        } else {
          setCourses([]);
        }

        if (res.data.pagination && res.data.pagination.total !== undefined) {
          setTotalCount(res.data.pagination.total);
        } else {
          setTotalCount(res.data.courses?.length || 0);
        }
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPage(0); // Optionally reset to first page to see new entry
    fetchCourses();
  };

  const handleDeleteCourse = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await service.deleteCourse(id);
      fetchCourses();
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  return (
    <Fragment>
      <Box sx={styles.container}>
        
        {/* Header Section */}
        <Box sx={styles.headerContainer}>
          <Box sx={styles.headerTextContainer}>
            <Typography variant="h4" sx={styles.headerTitle}>
              Course Management
            </Typography>
            <Typography variant="body1" sx={styles.headerSubtitle}>
              View and manage all available courses in the enterprise library
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={styles.submitButton}
            onClick={() => setIsModalOpen(true)}
          >
            Add Course
          </Button>
        </Box>

        {/* Course List Table */}
        <Card sx={styles.tableCard}>
          <Box sx={styles.tableHeader}>
            <Typography variant="h6" sx={styles.tableHeaderTitle}>
              Course List
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead sx={styles.tableHead}>
                <TableRow>
                  <TableCell sx={styles.tableCellHeader}>COURSE TITLE</TableCell>
                  <TableCell sx={styles.tableCellHeader}>PROVIDER</TableCell>
                  <TableCell sx={styles.tableCellHeader}>LEVEL</TableCell>
                  <TableCell sx={styles.tableCellHeader}>DURATION (HRS)</TableCell>
                  <TableCell sx={styles.tableCellHeader}>DESCRIPTION</TableCell>
                  <TableCell sx={styles.tableCellHeader} align="right">ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                      <CircularProgress size={30} />
                    </TableCell>
                  </TableRow>
                ) : (!courses || courses.length === 0) ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" sx={styles.tableTextBase}>
                        No courses found. Add a new course.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  (courses || []).map((course: any, index: number) => (
                    <TableRow key={course._id || index} sx={styles.tableRow}>
                      <TableCell>
                        <Typography variant="body2" sx={styles.tableTextPrimary}>
                          {course.course_title || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={styles.tableTextBase}>
                          {course.provider || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textTransform: 'capitalize' }}>
                        <Typography variant="body2" sx={styles.tableTextBase}>
                          {course.level || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={styles.tableTextBase}>
                          {course.duration_hours || 0} hrs
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Tooltip 
                          title={course.description || 'No description available'} 
                          placement="top" 
                          arrow
                          slotProps={{
                            tooltip: {
                              sx: {
                                bgcolor: 'grey.900',
                                color: '#fff',
                                fontSize: '13px',
                                p: 1
                              }
                            },
                            arrow: {
                              sx: {
                                color: 'grey.900'
                              }
                            }
                          }}
                        >
                          <Box sx={{ maxWidth: 200, display: 'inline-block' }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                ...styles.tableTextBase, 
                                whiteSpace: 'nowrap', 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis',
                                width: '100%'
                              }}
                            >
                              {course.description || '-'}
                            </Typography>
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteCourse(course._id || course.id)}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteOutlineRounded fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

      </Box>

      {/* Add Course Modal */}
      <Dialog 
        open={isModalOpen} 
        onClose={handleCloseModal}
        maxWidth="lg"
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: { borderRadius: '16px', overflow: 'hidden' }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              zIndex: 10,
              backgroundColor: 'rgba(255,255,255,0.2)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
            }}
          >
            <CloseIcon sx={{ color: '#fff' }} />
          </IconButton>
          <DialogContent sx={{ p: 0 }}>
            <AddCourse onClose={handleCloseModal} />
          </DialogContent>
        </Box>
      </Dialog>
    </Fragment>
  );
};

export default Courses;
