import { Fragment } from 'react';
import {
  Box, Typography, Button, InputBase, IconButton, Modal,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Pagination, CircularProgress, Chip,
} from '@mui/material';
import { AddRounded, SearchRounded, CloseRounded, CorporateFareRounded, EditRounded, DeleteRounded } from '@mui/icons-material';
import TabTitle from '../../../components/tabtitle';
import CreateDepartmentForm from './createdepartment';
import SubDepartmentsModal from './SubDepartmentsModal';
import { useDepartments } from '../../../features/departments/hooks/useDepartments';
import { useStyle } from '../lndcourses/style';
import { departmentsStyles as ds } from './Departments.styles';
import { BRAND } from '../../../constants/brand.constants';

const DepartmentsPage = () => {
  const styles = useStyle();
  const {
    loading, paginated, filtered, totalPages, search, page, modalOpen, editDept, PAGE_SIZE,
    setPage, onSearchChange, openAdd, openEdit, closeModal, refetch,
    deleteTarget, deleteLoading, openDelete, closeDelete, confirmDelete,
    subDeptParent, openSubDepts, closeSubDepts,
  } = useDepartments();

  return (
    <Fragment>
      <TabTitle title="Departments" />
      <Box sx={styles.container}>
        <Box sx={styles.headerContainer}>
          <Box sx={styles.headerTextContainer}>
            <Typography variant="h4" sx={styles.headerTitle}>Departments</Typography>
            <Typography sx={styles.headerSubtitle}>Manage all corporate departments</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddRounded />} onClick={openAdd} sx={styles.submitButton}>
            Add Department
          </Button>
        </Box>

        <Box sx={ds.tableCard}>
          <Box sx={ds.searchRow}>
            <SearchRounded sx={{ color: 'grey.400', fontSize: 18 }} />
            <InputBase fullWidth placeholder="Search departments..." value={search}
              onChange={e => onSearchChange(e.target.value)} sx={{ fontSize: 13 }} />
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={ds.tableHeadRow}>
                  {['DEPARTMENT', 'DESCRIPTION', 'MANAGER', 'STATUS', 'CREATED AT', 'ACTIONS'].map(h => (
                    <TableCell key={h} sx={ds.tableHeadCell}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><CircularProgress size={28} /></TableCell></TableRow>
                ) : paginated.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6, color: 'grey.400', fontSize: 13 }}>No departments found</TableCell></TableRow>
                ) : paginated.map((dept, index) => (
                  <TableRow key={dept._id} sx={{ ...ds.tableRow, animation: `rowIn 0.3s ease ${index * 0.03}s both` }}>
                    <TableCell sx={{ py: 1.5 }}>
                      <Box sx={{ ...ds.deptNameCell, cursor: 'pointer' }} onClick={() => openSubDepts(dept)}>
                        <Box sx={ds.deptIconBox}><CorporateFareRounded sx={ds.deptIcon} /></Box>
                        <Typography sx={{ ...ds.deptName, '&:hover': { color: BRAND.red, textDecoration: 'underline' } }}>{dept.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell><Typography sx={ds.deptDesc}>{dept.description || '—'}</Typography></TableCell>
                    <TableCell><Typography sx={ds.deptManager}>{dept.managerName || '—'}</Typography></TableCell>
                    <TableCell>
                      <Chip label={dept.isActive ? 'Active' : 'Inactive'} size="small"
                        sx={dept.isActive ? ds.activeChip : ds.inactiveChip} />
                    </TableCell>
                    <TableCell>
                      <Typography sx={ds.dateText}>{new Date(dept.createdAt).toLocaleDateString()}</Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" sx={{ ...ds.actionIconBtn, color: 'grey.500' }} onClick={() => openEdit(dept)}>
                        <EditRounded fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ ...ds.actionIconBtn, color: '#C41E3A', ml: 0.5 }} onClick={() => openDelete(dept)}>
                        <DeleteRounded fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={ds.paginationBar}>
            <Typography sx={ds.paginationText}>
              {filtered.length > 0
                ? `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length} departments`
                : 'No departments found'}
            </Typography>
            <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} size="small" sx={ds.paginationSx} />
          </Box>
        </Box>
      </Box>

      <Modal open={modalOpen} onClose={closeModal}>
        <Box sx={ds.modal}>
          <Box sx={ds.modalHeader}>
            <Typography variant="h5" fontWeight={700} sx={{ color: 'grey.900' }}>
              {editDept ? 'Edit Department' : 'Add New Department'}
            </Typography>
            <IconButton onClick={closeModal} size="small"><CloseRounded /></IconButton>
          </Box>
          <CreateDepartmentForm editData={editDept} onSuccess={() => { closeModal(); refetch(); }} />
        </Box>
      </Modal>

      <Modal open={!!deleteTarget} onClose={closeDelete}>
        <Box sx={ds.deleteModal}>
          <Box sx={ds.deleteIconWrap}>
            <DeleteRounded sx={{ color: '#C41E3A', fontSize: 32 }} />
          </Box>
          <Typography variant="h6" fontWeight={700} sx={{ color: 'grey.900', mt: 2 }}>Delete Department</Typography>
          <Typography sx={{ fontSize: 14, color: 'grey.600', mt: 1, textAlign: 'center' }}>
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?<br />
            This will also delete all sub-departments.
          </Typography>
          <Box sx={ds.deleteActions}>
            <Button variant="outlined" onClick={closeDelete} sx={ds.cancelBtn} disabled={deleteLoading}>Cancel</Button>
            <Button variant="contained" onClick={confirmDelete} sx={ds.deleteBtn} disabled={deleteLoading}>
              {deleteLoading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : 'Delete'}
            </Button>
          </Box>
        </Box>
      </Modal>
      {subDeptParent && <SubDepartmentsModal parent={subDeptParent} onClose={closeSubDepts} />}
    </Fragment>
  );
};

export default DepartmentsPage;
