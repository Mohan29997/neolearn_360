import { Fragment, useMemo } from 'react';
import {
  Box, Typography, Card, TableContainer, Table, TableHead, TableRow,
  TableCell, TableBody, TablePagination, Button, Dialog, DialogContent,
  IconButton, CircularProgress, Chip, Tooltip,
} from '@mui/material';
import {
  Add as AddIcon, Close as CloseIcon, DeleteOutlineRounded, OpenInNewRounded,
  MenuBookRounded, CheckCircleRounded, SchoolRounded,
} from '@mui/icons-material';
import { useStyle } from '../lndcourses/style';
import AddCourse from './addcourse';
import { useCourses } from '../../../features/courses/hooks/useCourses';
import type { ICourse } from '../../../types/course.types';
import { coursesStyles as cs } from './Courses.styles';

const CoursesPage = () => {
  const styles = useStyle();
  const {
    courses, loading, page, rowsPerPage, totalCount, modalOpen,
    handlePageChange, handleRowsPerPageChange, deleteCourse, openModal, closeModal,
  } = useCourses();

  const stats = useMemo(() => {
    const total = totalCount || courses.length;
    const active = courses.filter(c => c.isActive !== false).length;
    const withUrl = courses.filter(c => !!c.course_url).length;
    return { total, active, withUrl };
  }, [courses, totalCount]);

  const STATS = [
    { label: 'Total Courses', value: stats.total, icon: <MenuBookRounded sx={{ fontSize: 20 }} />, accent: '#2563EB' },
    { label: 'Active Courses', value: stats.active, icon: <CheckCircleRounded sx={{ fontSize: 20 }} />, accent: '#16A34A' },
    { label: 'With Course URL', value: stats.withUrl, icon: <SchoolRounded sx={{ fontSize: 20 }} />, accent: '#8B1A2E' },
  ];

  return (
    <Fragment>
      <Box sx={styles.container}>
        <Box sx={styles.headerContainer}>
          <Box sx={styles.headerTextContainer}>
            <Typography variant="h4" sx={styles.headerTitle}>Course Management</Typography>
            <Typography variant="body1" sx={styles.headerSubtitle}>
              View and manage all available courses in the enterprise library
            </Typography>
          </Box>
          <Button variant="contained" fullWidth={false} startIcon={<AddIcon />} sx={cs.addBtn} onClick={openModal}>
            Add Course
          </Button>
        </Box>

        <Box sx={cs.statsRow}>
          {STATS.map((s, i) => (
            <Box key={s.label} sx={{
              ...cs.statCard(s.accent),
              '@keyframes cardIn': { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
              animation: `cardIn 0.35s ease ${i * 0.06}s both`,
            }}>
              <Box sx={cs.statIconBox(s.accent)}>{s.icon}</Box>
              <Box>
                <Typography sx={cs.statValue}>{s.value}</Typography>
                <Typography sx={cs.statLabel}>{s.label}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Card sx={styles.tableCard}>
          <Box sx={styles.tableHeader}>
            <Typography variant="h6" sx={styles.tableHeaderTitle}>Course List</Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead sx={styles.tableHead}>
                <TableRow>
                  {['COURSE TITLE', 'PROVIDER', 'LEVEL', 'DURATION (HRS)', 'COURSE URL', 'DESCRIPTION', 'STATUS'].map(h => (
                    <TableCell key={h} sx={styles.tableCellHeader}>{h}</TableCell>
                  ))}
                  <TableCell sx={{ ...styles.tableCellHeader, textAlign: 'right' }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={8} align="center" sx={{ py: 5 }}><CircularProgress size={30} sx={{ color: '#8B1A2E' }} /></TableCell></TableRow>
                ) : courses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ border: 0, p: 0 }}>
                      <Box sx={cs.emptyState}>
                        <Box sx={{ width: 64, height: 64, borderRadius: '18px', bgcolor: '#fff', border: '1.5px solid #FECDD3', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, boxShadow: '0 4px 20px #FFF1F2' }}>
                          <MenuBookRounded sx={{ fontSize: 30, color: '#8B1A2E' }} />
                        </Box>
                        <Typography sx={{ fontWeight: 800, fontSize: 17, color: 'grey.800', mb: 0.6 }}>No courses found</Typography>
                        <Typography sx={{ color: 'grey.500', fontSize: 13.5 }}>Add a new course to build out your enterprise library.</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : courses.map((course: ICourse, index: number) => (
                  <TableRow key={course._id || index} sx={{ ...cs.tableRow, animation: `rowIn 0.3s ease ${index * 0.04}s both` }}>
                    <TableCell><Typography variant="body2" sx={styles.tableTextPrimary}>{course.course_title || '-'}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={styles.tableTextBase}>{course.provider || '-'}</Typography></TableCell>
                    <TableCell><Chip label={course.level || '-'} size="small" sx={cs.levelChip(course.level || '')} /></TableCell>
                    <TableCell><Typography variant="body2" sx={styles.tableTextBase}>{course.duration_hours || 0} hrs</Typography></TableCell>
                    <TableCell>
                      {course.course_url ? (
                        <Button size="small" variant="outlined" endIcon={<OpenInNewRounded sx={{ fontSize: 13 }} />}
                          component="a" href={course.course_url} target="_blank" rel="noopener noreferrer" sx={cs.urlBtn}>
                          Open
                        </Button>
                      ) : (
                        <Typography sx={cs.noUrlText}>—</Typography>
                      )}
                    </TableCell>
                    <TableCell sx={cs.descriptionCell}>
                      <Tooltip title={course.description || 'No description available'} placement="top" arrow slotProps={cs.tooltipProps}>
                        <Box sx={cs.descriptionCell}>
                          <Typography variant="body2" sx={{ ...styles.tableTextBase, ...cs.descriptionText }}>
                            {course.description || '-'}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Chip label={course.isActive !== false ? 'Active' : 'Inactive'} size="small"
                        sx={course.isActive !== false ? cs.activeChip : cs.inactiveChip} />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => deleteCourse(course._id)} sx={cs.deleteBtn}>
                        <DeleteOutlineRounded fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </Card>
      </Box>

      <Dialog open={modalOpen} onClose={closeModal} maxWidth="lg" fullWidth scroll="paper"
        PaperProps={{ sx: { borderRadius: '16px', overflow: 'hidden' } }}>
        <Box sx={{ position: 'relative' }}>
          <IconButton onClick={closeModal} sx={cs.dialogClose}>
            <CloseIcon sx={{ color: '#fff' }} />
          </IconButton>
          <DialogContent sx={{ p: 0 }}>
            <AddCourse onClose={closeModal} />
          </DialogContent>
        </Box>
      </Dialog>
    </Fragment>
  );
};

export default CoursesPage;
