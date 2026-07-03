import { Fragment, useMemo } from 'react';
import {
  Box, Button, Card, Chip, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem,
  Select, Stack, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, Typography,
} from '@mui/material';
import {
  AssignmentTurnedInRounded, CloseRounded, HourglassBottomRounded,
  MenuBookRounded, PersonRounded, PlaylistAddCheckRounded,
} from '@mui/icons-material';
import TabTitle from '../../../components/tabtitle';
import { useAssignments } from '../../../features/assignments/hooks/useAssignments';
import { courseRequestsStyles as crs } from './CourseRequests.styles';

const CourseRequestsPage = () => {
  const {
    assignedCourses, loading, page, rowsPerPage, totalCount,
    assignModalOpen, isAssigning, users, coursesList,
    formUser, formUserLabel, formCourse, formCourseLabel, formCoordinator,
    setAssignModalOpen, setFormUser, setFormUserLabel,
    setFormCourse, setFormCourseLabel, setFormCoordinator,
    openAssignRow, handleAssignCourse, handlePageChange, handleRowsPerPageChange,
  } = useAssignments();

  const stats = useMemo(() => {
    const total = totalCount || assignedCourses.length;
    const started = assignedCourses.filter(c => c.course_assigned === true && c.coordinator_id).length;
    const inProgress = assignedCourses.filter(c => c.status === 'in_progress').length;
    const notStarted = assignedCourses.filter(c => c.status === 'not_started').length;
    return { total, started, inProgress, notStarted };
  }, [assignedCourses, totalCount]);

  const STATS = [
    { label: 'Total Assignments', value: stats.total, icon: <PlaylistAddCheckRounded sx={{ fontSize: 20 }} />, accent: '#2563EB' },
    { label: 'Course Started', value: stats.started, icon: <AssignmentTurnedInRounded sx={{ fontSize: 20 }} />, accent: '#16A34A' },
    { label: 'In Progress', value: stats.inProgress, icon: <HourglassBottomRounded sx={{ fontSize: 20 }} />, accent: '#D97706' },
    { label: 'Not Started', value: stats.notStarted, icon: <MenuBookRounded sx={{ fontSize: 20 }} />, accent: '#8B1A2E' },
  ];

  return (
    <Fragment>
      <TabTitle title="Course Assignments" />
      <Box sx={crs.page}>

        {/* ── Header ── */}
        <Box sx={crs.headerRow}>
          <Box sx={crs.headerLeft}>
            <Box sx={crs.headerIconBox}>
              <PlaylistAddCheckRounded sx={{ color: '#8B1A2E', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={crs.headerTitle}>Course Assignments</Typography>
              <Typography variant="body1" sx={crs.headerSubtitle}>Manage and view all employee course assignments.</Typography>
            </Box>
          </Box>
        </Box>

        {/* ── Stat cards ── */}
        <Box sx={crs.statsRow}>
          {STATS.map((s, i) => (
            <Box key={s.label} sx={{
              ...crs.statCard(s.accent),
              '@keyframes cardIn': { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
              animation: `cardIn 0.35s ease ${i * 0.06}s both`,
            }}>
              <Box sx={crs.statIconBox(s.accent)}>{s.icon}</Box>
              <Box>
                <Typography sx={crs.statValue}>{s.value}</Typography>
                <Typography sx={crs.statLabel}>{s.label}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Card sx={crs.tableCard}>
          <Box sx={crs.tableHeader}>
            <Typography variant="h6" sx={crs.tableHeaderTitle}>All Assignments</Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead sx={crs.tableHead}>
                <TableRow>
                  {['EMPLOYEE', 'COURSE TITLE', 'MENTOR', 'STATUS'].map(h => (
                    <TableCell key={h} sx={crs.tableCellHeader}>{h}</TableCell>
                  ))}
                  <TableCell sx={crs.tableCellHeader} align="right">ACTION</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} align="center" sx={{ py: 5 }}><CircularProgress size={30} sx={{ color: '#8B1A2E' }} /></TableCell></TableRow>
                ) : assignedCourses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ border: 0, p: 0 }}>
                      <Box sx={crs.emptyState}>
                        <Box sx={{ width: 64, height: 64, borderRadius: '18px', bgcolor: '#fff', border: '1.5px solid #FECDD3', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, boxShadow: '0 4px 20px #FFF1F2' }}>
                          <PlaylistAddCheckRounded sx={{ fontSize: 30, color: '#8B1A2E' }} />
                        </Box>
                        <Typography sx={{ fontWeight: 800, fontSize: 17, color: 'grey.800', mb: 0.6 }}>No course assignments found</Typography>
                        <Typography sx={{ color: 'grey.500', fontSize: 13.5 }}>Assignments will appear here once employees are assigned a course.</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : assignedCourses.map((item, index) => (
                  <TableRow key={item._id || index} sx={{ ...crs.tableRow, animation: `rowIn 0.3s ease ${index * 0.04}s both` }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <Box sx={crs.avatarChip}>
                          {item.user_name ? item.user_name.slice(0, 2).toUpperCase() : <PersonRounded sx={{ fontSize: 16 }} />}
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" sx={crs.tableTextPrimary} noWrap>{item.user_name || '-'}</Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>{item.user_email || ''}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={crs.tableTextBase}>{item.course_title || '-'}</Typography>
                      <Box sx={crs.progressTrack}>
                        <Box sx={crs.progressFill(item.progress_percent || 0)} />
                      </Box>
                      <Typography variant="caption" color="text.secondary">{item.progress_percent || 0}% complete</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={crs.tableTextBase}>{item.mentor_name || 'Admin'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={item.status === 'not_started' ? 'Not Started' : item.status}
                        size="small" variant="outlined" sx={crs.statusChip} />
                    </TableCell>
                    <TableCell align="right">
                      {(item.course_assigned === true && item.coordinator_id) ? (
                        <Chip label="Course Started" size="small" sx={crs.courseStartedChip} />
                      ) : (
                        <Button variant="outlined" size="small" onClick={() => openAssignRow(item)} sx={crs.startCourseBtn}>
                          Start Course
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={totalCount || assignedCourses.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </Card>
      </Box>

      <Dialog open={assignModalOpen} onClose={() => setAssignModalOpen(false)} PaperProps={{ sx: crs.dialogPaper }}>
        <DialogTitle sx={crs.dialogTitle}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: '#fff', border: '1px solid #FECDD3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MenuBookRounded sx={{ color: '#8B1A2E', fontSize: 18 }} />
            </Box>
            <Typography variant="h6" fontWeight={700}>Assign Course to Employee</Typography>
          </Box>
          <IconButton onClick={() => setAssignModalOpen(false)} size="small"
            sx={{ transition: 'all 0.18s', '&:hover': { bgcolor: '#FFF1F2', color: '#8B1A2E', transform: 'rotate(90deg)' } }}>
            <CloseRounded fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: '20px !important', px: 3 }}>
          <Typography variant="caption" sx={crs.captionLabel}>Employee</Typography>
          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 3, minHeight: 32 }}>
            {formUser ? (
              <Chip label={formUserLabel || formUser} onDelete={() => { setFormUser(''); setFormUserLabel(''); }}
                size="small" sx={crs.assignEmployeeChip} />
            ) : (
              <Typography variant="body2" color="text.disabled" sx={{ lineHeight: '28px' }}>No employee selected</Typography>
            )}
          </Stack>

          <Typography variant="caption" sx={crs.captionLabel}>Course</Typography>
          {formCourse && (
            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 1 }}>
              <Chip label={formCourseLabel || formCourse} onDelete={() => { setFormCourse(''); setFormCourseLabel(''); }}
                size="small" sx={crs.selectedCourseChip} />
            </Stack>
          )}
          <FormControl fullWidth size="small" sx={{ mb: 3 }}>
            <InputLabel id="course-select" shrink={!!formCourse}>Select Course</InputLabel>
            <Select labelId="course-select" value={formCourse} label="Select Course" notched={!!formCourse}
              onChange={e => {
                const selected = coursesList.find(c => c._id === e.target.value);
                setFormCourse(e.target.value);
                setFormCourseLabel(selected?.course_title || '');
              }}>
              {coursesList.map(c => <MenuItem key={c._id} value={c._id}>{c.course_title}</MenuItem>)}
            </Select>
          </FormControl>

          <Typography variant="caption" sx={crs.captionLabel}>Coordinator (Mentor)</Typography>
          {formCoordinator && (
            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 1 }}>
              <Chip label={users.find(u => u._id === formCoordinator)?.name || formCoordinator}
                onDelete={() => setFormCoordinator('')} size="small" sx={crs.coordinatorChip} />
            </Stack>
          )}
          <FormControl fullWidth size="small" sx={{ mb: 1 }}>
            <InputLabel id="mentor-select" shrink={!!formCoordinator}>Select Coordinator</InputLabel>
            <Select labelId="mentor-select" value={formCoordinator} label="Select Coordinator" notched={!!formCoordinator}
              onChange={e => setFormCoordinator(e.target.value)}>
              {users.map(u => (
                <MenuItem key={u._id} value={u._id}>{u.name} {u.employeeId ? `(${u.employeeId})` : ''}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button variant="outlined" onClick={() => setAssignModalOpen(false)}
            sx={{ textTransform: 'none', borderRadius: '10px', fontWeight: 600, flex: 1 }}>
            Cancel
          </Button>
          <Button variant="contained" disabled={isAssigning || !formUser || !formCourse || !formCoordinator}
            onClick={handleAssignCourse} sx={{ ...crs.submitBtn, flex: 1, py: 1, fontSize: '15px' }}>
            {isAssigning ? 'Assigning...' : 'Assign'}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default CourseRequestsPage;
