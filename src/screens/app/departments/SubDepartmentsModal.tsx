import { useState, useEffect, useCallback } from 'react';
import {
  Modal, Box, Typography, IconButton, Button, CircularProgress,
  Table, TableHead, TableRow, TableCell, TableBody, TableContainer,
  Chip, InputBase, Select, MenuItem, FormControl,
} from '@mui/material';
import { CloseRounded, AddRounded, EditRounded, DeleteRounded, SaveRounded, AccountTreeRounded } from '@mui/icons-material';
import { service } from '../../../service';
import { SnackNotification } from '../../../helper/snackMessage';
import { BRAND, SURFACE } from '../../../constants/brand.constants';
import { departmentsStyles as ds } from './Departments.styles';
import type { IDepartment, ISubDepartment } from '../../../types/department.types';

interface Manager { _id: string; fullName: string; employeeId?: string; }

interface SubFormState { name: string; managerId: string; }

const EMPTY_FORM: SubFormState = { name: '', managerId: '' };

interface Props {
  parent: IDepartment;
  onClose: () => void;
}

const SubDepartmentsModal = ({ parent, onClose }: Props) => {
  const [subDepts, setSubDepts] = useState<ISubDepartment[]>([]);
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState<Manager[]>([]);

  // add / edit form
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ISubDepartment | null>(null);
  const [form, setForm] = useState<SubFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // delete confirm
  const [deleteTarget, setDeleteTarget] = useState<ISubDepartment | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSubs = useCallback(() => {
    setLoading(true);
    service.getSubDepartments(parent._id)
      .then((res: any) => {
        const data = res?.data ?? res;
        setSubDepts(Array.isArray(data) ? data : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [parent._id]);

  useEffect(() => {
    fetchSubs();
    const ALLOWED = ['SUPER_ADMIN', 'VP', 'DM', 'MANAGER'];
    service.getManagerUsers().then((res: any) => {
      const all: any[] = res?.data?.users ?? res?.users ?? (Array.isArray(res?.data) ? res.data : []);
      setManagers(
        all
          .filter(u => ALLOWED.includes(String(u.role).toUpperCase()))
          .map(u => ({ _id: u._id, fullName: u.fullName || u.name || '', employeeId: u.employeeId || '' }))
      );
    }).catch(() => {});
  }, [fetchSubs]);

  const openAdd = () => { setEditTarget(null); setForm(EMPTY_FORM); setFormOpen(true); };
  const openEdit = (sub: ISubDepartment) => {
    setEditTarget(sub);
    const mgr = managers.find(m => m.fullName.toLowerCase() === (sub.managerName || '').toLowerCase());
    setForm({ name: sub.name, managerId: mgr?._id ?? '' });
    setFormOpen(true);
  };
  const closeForm = () => { setFormOpen(false); setEditTarget(null); setForm(EMPTY_FORM); };

  const handleSave = async () => {
    if (!form.name.trim()) return SnackNotification('Please enter a sub-department name.', 'error');
    setSaving(true);
    const mgr = managers.find(m => m._id === form.managerId);
    const payload = { name: form.name.trim(), managerName: mgr?.fullName ?? '' };
    try {
      if (editTarget) {
        await service.updateSubDepartment(editTarget._id, { ...payload, isActive: editTarget.isActive });
        SnackNotification('Sub-department updated', 'success');
      } else {
        await service.createSubDepartment(parent._id, payload);
        SnackNotification('Sub-department created', 'success');
      }
      closeForm();
      fetchSubs();
    } catch { /* handled by interceptor */ } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await service.deleteSubDepartment(deleteTarget._id);
      SnackNotification('Sub-department deleted', 'success');
      setDeleteTarget(null);
      fetchSubs();
    } catch { /* handled by interceptor */ } finally { setDeleting(false); }
  };

  return (
    <>
      <Modal open onClose={onClose}>
        <Box sx={sx.modal}>
          {/* Header */}
          <Box sx={ds.modalHeader}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={sx.headerIcon}><AccountTreeRounded sx={{ color: BRAND.red, fontSize: 18 }} /></Box>
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ color: 'grey.900', lineHeight: 1.2 }}>
                  {parent.name}
                </Typography>
                <Typography sx={{ fontSize: 12, color: 'grey.500' }}>Sub-departments</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button size="small" variant="contained" startIcon={<AddRounded />} onClick={openAdd} sx={sx.addBtn}>
                Add
              </Button>
              <IconButton onClick={onClose} size="small"><CloseRounded /></IconButton>
            </Box>
          </Box>

          {/* Table */}
          {loading ? (
            <Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}><CircularProgress size={28} /></Box>
          ) : (
            <TableContainer sx={{ maxHeight: 380 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow sx={{ background: SURFACE.rowHeader }}>
                    {['NAME', 'MANAGER', 'STATUS', 'CREATED AT', 'ACTIONS'].map(h => (
                      <TableCell key={h} sx={ds.tableHeadCell}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subDepts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 5, color: 'grey.400', fontSize: 13 }}>
                        No sub-departments yet
                      </TableCell>
                    </TableRow>
                  ) : subDepts.map(sub => (
                    <TableRow key={sub._id} hover sx={ds.tableRow}>
                      <TableCell><Typography sx={ds.deptName}>{sub.name}</Typography></TableCell>
                      <TableCell><Typography sx={ds.deptManager}>{sub.managerName || '—'}</Typography></TableCell>
                      <TableCell>
                        <Chip label={sub.isActive ? 'Active' : 'Inactive'} size="small"
                          sx={sub.isActive ? ds.activeChip : ds.inactiveChip} />
                      </TableCell>
                      <TableCell><Typography sx={ds.dateText}>{new Date(sub.createdAt).toLocaleDateString()}</Typography></TableCell>
                      <TableCell>
                        <IconButton size="small" sx={{ color: 'grey.500' }} onClick={() => openEdit(sub)}>
                          <EditRounded fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: '#C41E3A', ml: 0.5 }} onClick={() => setDeleteTarget(sub)}>
                          <DeleteRounded fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Modal>

      {/* Add / Edit form modal */}
      <Modal open={formOpen} onClose={closeForm}>
        <Box sx={sx.formModal}>
          <Box sx={ds.modalHeader}>
            <Typography variant="h6" fontWeight={700} sx={{ color: 'grey.900' }}>
              {editTarget ? 'Edit Sub-Department' : 'Add Sub-Department'}
            </Typography>
            <IconButton onClick={closeForm} size="small"><CloseRounded /></IconButton>
          </Box>

          <Box sx={{ mb: 2.5 }}>
            <Typography sx={sx.fieldLabel}>Sub-Department Name *</Typography>
            <Box sx={sx.inputBase}>
              <InputBase fullWidth placeholder="e.g. Frontend Team" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} sx={{ fontSize: '13.5px' }} />
            </Box>
          </Box>

          <Box sx={{ mb: 2.5 }}>
            <Typography sx={sx.fieldLabel}>DM Name</Typography>
            <FormControl fullWidth size="small">
              <Select displayEmpty value={form.managerId}
                onChange={e => setForm(f => ({ ...f, managerId: e.target.value }))}
                sx={sx.selectBase}
                renderValue={v => v ? (managers.find(m => m._id === v)?.fullName ?? '') : <Typography sx={{ color: 'grey.400', fontSize: '13.5px' }}>Select DM</Typography>}>
                {managers.map(m => <MenuItem key={m._id} value={m._id}>{m.fullName}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 2, borderTop: '1px solid', borderColor: 'grey.100' }}>
            <Button variant="text" onClick={closeForm} sx={{ color: 'grey.600', fontWeight: 600, fontSize: 13, textTransform: 'none' }}>Cancel</Button>
            <Button variant="contained" startIcon={<SaveRounded />} disabled={saving} onClick={handleSave}
              sx={{ bgcolor: BRAND.dark, fontWeight: 600, fontSize: 13, borderRadius: '8px', textTransform: 'none', px: 3, '&:hover': { bgcolor: BRAND.red } }}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Delete confirm modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <Box sx={ds.deleteModal}>
          <Box sx={ds.deleteIconWrap}><DeleteRounded sx={{ color: '#C41E3A', fontSize: 32 }} /></Box>
          <Typography variant="h6" fontWeight={700} sx={{ color: 'grey.900', mt: 2 }}>Delete Sub-Department</Typography>
          <Typography sx={{ fontSize: 14, color: 'grey.600', mt: 1, textAlign: 'center' }}>
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
          </Typography>
          <Box sx={ds.deleteActions}>
            <Button variant="outlined" onClick={() => setDeleteTarget(null)} sx={ds.cancelBtn} disabled={deleting}>Cancel</Button>
            <Button variant="contained" onClick={handleDelete} sx={ds.deleteBtn} disabled={deleting}>
              {deleting ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : 'Delete'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

const sx = {
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95vw', sm: '700px' },
    bgcolor: SURFACE.card,
    borderRadius: '16px',
    outline: 'none',
    p: 3,
  },
  formModal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95vw', sm: '460px' },
    bgcolor: SURFACE.card,
    borderRadius: '16px',
    outline: 'none',
    p: 3,
  },
  headerIcon: {
    width: 36, height: 36, borderRadius: '8px', bgcolor: BRAND.redBg,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  addBtn: {
    bgcolor: BRAND.red, fontWeight: 600, fontSize: 13, borderRadius: '8px',
    textTransform: 'none', '&:hover': { bgcolor: BRAND.redHover },
  },
  fieldLabel: { fontSize: '12px', fontWeight: 600, color: 'grey.700', mb: 0.7, letterSpacing: '0.2px' },
  inputBase: {
    width: '100%', background: '#F9FAFB', border: '1.5px solid', borderColor: 'grey.200',
    borderRadius: '8px', px: 1.5, py: 1, display: 'flex', alignItems: 'center',
    '&:focus-within': { borderColor: BRAND.red, background: '#fff' },
  },
  selectBase: {
    width: '100%', background: '#F9FAFB', borderRadius: '8px', fontSize: '13.5px',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.200', borderWidth: '1.5px' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: BRAND.red },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: BRAND.red },
  },
} as const;

export default SubDepartmentsModal;
