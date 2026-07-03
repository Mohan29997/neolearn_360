import { Fragment } from 'react';
import {
  Box, Typography, Button, Select, MenuItem, InputBase,
  Avatar, Chip, IconButton, Modal, FormControl,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Pagination, CircularProgress,
} from '@mui/material';
import {
  PersonAddRounded, FileDownloadRounded,
  EditRounded, DeleteRounded, SearchRounded, CloseRounded,
} from '@mui/icons-material';
import TabTitle from '../../../components/tabtitle';
import CreateUserForm from './createuser';
import EditUserModal from './EditUserModal';
import { useUsersPage } from './Users.hook';
import { usersStyles as s } from './Users.styles';
import { STATUS_OPTIONS, TABLE_HEADERS } from './Users.constants';

const UsersPage = () => {
  const {
    loading, search, deptFilter, roleFilter, statusFilter,
    page, filtered, pageUsers, totalPages, deptOptions, roleOptions,
    PAGE_SIZE, setPage, setDeptFilter, setRoleFilter, setStatusFilter, handleSearchChange,
    modalOpen, setModalOpen, editUser, setEditUser, editForm, setEditForm, editSubmitting,
    openEdit, handleEdit, clearFilters, handleExport, refetch, allUsers,
    deleteTarget, setDeleteTarget, deleteLoading, confirmDelete,
  } = useUsersPage();

  return (
    <Fragment>
      <TabTitle title="User Management" />
      <Box sx={s.pageContainer}>

        <Box sx={s.header}>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: 'grey.900' }}>User Management</Typography>
            <Typography sx={{ color: 'grey.500', fontSize: 13, mt: 0.5 }}>Manage and oversee all enterprise learners</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button variant="outlined" startIcon={<FileDownloadRounded />} onClick={handleExport} sx={s.exportBtn}>Export List</Button>
            <Button variant="contained" startIcon={<PersonAddRounded />} onClick={() => setModalOpen(true)} sx={s.addUserBtn}>Add User</Button>
          </Box>
        </Box>

        <Box sx={s.filterCard}>
          <Box sx={s.filterGrid}>
            <Box>
              <Typography sx={s.filterLabel}>DEPARTMENT</Typography>
              <FormControl fullWidth size="small">
                <Select displayEmpty value={deptFilter} onChange={e => setDeptFilter(e.target.value)} sx={s.filterSelect}>
                  <MenuItem value="">All Departments</MenuItem>
                  {deptOptions.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Typography sx={s.filterLabel}>ROLE</Typography>
              <FormControl fullWidth size="small">
                <Select displayEmpty value={roleFilter} onChange={e => setRoleFilter(e.target.value)} sx={s.filterSelect}>
                  <MenuItem value="">All Roles</MenuItem>
                  {roleOptions.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Typography sx={s.filterLabel}>STATUS</Typography>
              <FormControl fullWidth size="small">
                <Select displayEmpty value={statusFilter} onChange={e => setStatusFilter(e.target.value)} sx={s.filterSelect}>
                  <MenuItem value="">All Status</MenuItem>
                  {STATUS_OPTIONS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
            <Button onClick={clearFilters} sx={s.clearFiltersBtn}>Clear Filters</Button>
          </Box>
        </Box>

        <Box sx={s.tableCard}>
          <Box sx={s.searchRow}>
            <SearchRounded sx={{ color: 'grey.400', fontSize: 18 }} />
            <InputBase fullWidth placeholder="Search users, roles, or departments..."
              value={search} onChange={e => handleSearchChange(e.target.value)} sx={{ fontSize: 13 }} />
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={s.tableHeadRow}>
                  {TABLE_HEADERS.map(h => <TableCell key={h} sx={s.tableHeadCell}>{h}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={9} align="center" sx={{ py: 6 }}><CircularProgress size={28} sx={{ color: 'error.main' }} /></TableCell></TableRow>
                ) : pageUsers.length === 0 ? (
                  <TableRow><TableCell colSpan={9} align="center" sx={{ py: 6, color: 'grey.400', fontSize: 13 }}>No users found</TableCell></TableRow>
                ) : pageUsers.map((user, index) => {
                  const initials = (user.name ?? '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                  return (
                    <TableRow key={user._id} sx={{ ...s.tableRow, animation: `rowIn 0.3s ease ${index * 0.03}s both` }}>
                      <TableCell sx={s.userCell}>
                        <Box sx={s.userCellInner}>
                          <Avatar sx={s.avatar}>{initials}</Avatar>
                          <Box>
                            <Typography sx={s.userName}>{user.name}</Typography>
                            <Typography sx={s.userEmail}>{user.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell><Typography sx={s.roleText}>{user.employeeId || '—'}</Typography></TableCell>
                      <TableCell><Chip label={user.department || '—'} size="small" sx={s.deptChip} /></TableCell>
                      <TableCell><Typography sx={s.roleText}>{user.subDepartmentName || user.subDepartment || '—'}</Typography></TableCell>
                      <TableCell><Typography sx={s.roleText}>{user.role}</Typography></TableCell>
                      <TableCell>
                        {(() => {
                          const role = user.role?.toUpperCase();
                          if (role === 'TL') return (
                            <Box>
                              {user.vpName && <Typography sx={{ ...s.roleText, fontSize: 12 }}>VP: {user.vpName}</Typography>}
                              {user.managerName && <Typography sx={{ ...s.roleText, fontSize: 12, color: 'grey.500' }}>DM: {user.managerName}</Typography>}
                              {!user.vpName && !user.managerName && <Typography sx={s.roleText}>—</Typography>}
                            </Box>
                          );
                          if (role === 'DM') return (
                            <Typography sx={s.roleText}>{user.vpName || '—'}</Typography>
                          );
                          if (['USER', 'TEAM', 'EMPLOYEE'].includes(role ?? '')) return (
                            <Box>
                              {user.managerName && <Typography sx={{ ...s.roleText, fontSize: 12 }}>DM: {user.managerName}</Typography>}
                              {user.tlName && <Typography sx={{ ...s.roleText, fontSize: 12, color: 'grey.500' }}>TL: {user.tlName}</Typography>}
                              {!user.managerName && !user.tlName && <Typography sx={s.roleText}>—</Typography>}
                            </Box>
                          );
                          return <Typography sx={s.roleText}>{user.managerName || user.vpName || '—'}</Typography>;
                        })()}
                      </TableCell>
                      <TableCell><Typography sx={s.roleText}>{user.officeLocation || '—'}</Typography></TableCell>
                      <TableCell>
                        <Box sx={s.statusRow}>
                          <Box sx={s.statusDot(user.isActive)} />
                          <Typography sx={s.statusText(user.isActive)}>{user.isActive ? 'Active' : 'Inactive'}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell onClick={e => e.stopPropagation()}>
                        <Box sx={s.actionsBtns}>
                          <IconButton size="small" sx={{ ...s.actionIconBtn, color: 'grey.500' }} onClick={() => openEdit(user)}><EditRounded fontSize="small" /></IconButton>
                          <IconButton size="small" sx={{ ...s.actionIconBtn, color: '#C41E3A' }} onClick={() => setDeleteTarget(user)}><DeleteRounded fontSize="small" /></IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={s.paginationBar}>
            <Typography sx={s.paginationText}>
              {filtered.length > 0
                ? `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length.toLocaleString()} users`
                : 'No users found'}
            </Typography>
            <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} size="small" siblingCount={1} boundaryCount={1} sx={s.paginationSx} />
          </Box>
        </Box>
      </Box>

      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSuccess={() => { refetch(); }}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={s.addModal}>
          <Box sx={s.addModalHeader}>
            <Typography variant="h5" fontWeight={700} sx={{ color: 'grey.900' }}>Add New User</Typography>
            <IconButton onClick={() => setModalOpen(false)} size="small"><CloseRounded /></IconButton>
          </Box>
          <CreateUserForm onSuccess={() => { setModalOpen(false); refetch(); }} />
        </Box>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <Box sx={s.deleteModal}>
          <Box sx={s.deleteIconWrap}><DeleteRounded sx={{ color: '#C41E3A', fontSize: 32 }} /></Box>
          <Typography variant="h6" fontWeight={700} sx={{ color: 'grey.900', mt: 2 }}>Delete User</Typography>
          <Typography sx={{ fontSize: 14, color: 'grey.600', mt: 1, textAlign: 'center' }}>
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?<br />This action cannot be undone.
          </Typography>
          <Box sx={s.deleteActions}>
            <Button variant="outlined" onClick={() => setDeleteTarget(null)} sx={s.cancelBtn} disabled={deleteLoading}>Cancel</Button>
            <Button variant="contained" onClick={confirmDelete} sx={s.deleteBtn} disabled={deleteLoading}>
              {deleteLoading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : 'Delete'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Fragment>
  );
};

export default UsersPage;
