import { useState, useEffect, useRef, type KeyboardEvent } from 'react';
import {
  Box, Typography, Modal, IconButton, Button, InputBase,
  Select, MenuItem, FormControl, Chip, Paper, ClickAwayListener,
  ListItemButton, CircularProgress, Switch,
} from '@mui/material';
import {
  CloseRounded, SaveRounded, SearchRounded,
  LocationOnRounded, KeyboardArrowDownRounded, PersonSearchRounded,
} from '@mui/icons-material';
import { service } from '../../../service';
import { SnackNotification } from '../../../helper/snackMessage';
import type { IUser } from '../../../types/auth.types';
import { usersStyles as s } from './Users.styles';

interface Props {
  user: IUser;
  onClose: () => void;
  onSuccess: () => void;
}

const RED = '#8B1A2E';
const BORDER = '#E5E7EB';

const label = (text: string) => (
  <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'grey.500', textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5 }}>
    {text}
  </Typography>
);

const inputSx = {
  display: 'flex', alignItems: 'center', gap: 1,
  border: `1.5px solid ${BORDER}`, borderRadius: '10px',
  px: 1.5, py: '8px', background: '#FAFAFA', minHeight: 40,
  '&:focus-within': { borderColor: RED },
};

const readonlySx = { ...inputSx, bgcolor: '#F3F4F6' };

const selectSx = {
  borderRadius: '10px', fontSize: '13.5px', background: '#FAFAFA',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: BORDER },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: RED },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: RED },
};

const CitySelect = ({ cities, value, onChange }: { cities: string[]; value: string; onChange: (v: string) => void }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  const filtered = search.trim() ? cities.filter(c => c.toLowerCase().includes(search.toLowerCase())) : cities;
  return (
    <ClickAwayListener onClickAway={() => { setOpen(false); setSearch(''); }}>
      <Box sx={{ position: 'relative' }}>
        <Box onClick={() => { setOpen(true); setTimeout(() => ref.current?.focus(), 50); }} sx={{
          ...inputSx, cursor: 'pointer',
          borderColor: open ? RED : BORDER,
        }}>
          <LocationOnRounded sx={{ color: 'grey.400', fontSize: 17, flexShrink: 0 }} />
          <Typography sx={{ flex: 1, fontSize: '13.5px', color: value ? 'grey.800' : 'grey.400' }}>
            {value || 'Select office location'}
          </Typography>
          <KeyboardArrowDownRounded sx={{ color: 'grey.400', fontSize: 18, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </Box>
        {open && (
          <Paper elevation={4} sx={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 1600, borderRadius: '10px', overflow: 'hidden', border: `1px solid ${BORDER}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1, borderBottom: `1px solid #F0F0F0` }}>
              <SearchRounded sx={{ color: 'grey.400', fontSize: 17 }} />
              <InputBase inputRef={ref} fullWidth placeholder="Search city..." value={search} onChange={e => setSearch(e.target.value)} sx={{ fontSize: '13px' }} />
            </Box>
            <Box sx={{ maxHeight: 180, overflowY: 'auto' }}>
              {filtered.length === 0
                ? <Typography sx={{ px: 2, py: 1.5, fontSize: '13px', color: 'grey.400' }}>No cities found</Typography>
                : filtered.map(city => (
                  <ListItemButton key={city} selected={city === value} onClick={() => { onChange(city); setOpen(false); setSearch(''); }}
                    sx={{ fontSize: '13.5px', py: 0.7, px: 2, '&.Mui-selected': { background: '#FFF1F2', color: RED }, '&:hover': { background: '#FFF8F8' } }}>
                    {city}
                  </ListItemButton>
                ))}
            </Box>
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
};

const Row = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>{children}</Box>
);

const EditUserModal = ({ user, onClose, onSuccess }: Props) => {
  const isUser = ['USER', 'TEAM', 'EMPLOYEE'].includes(user.role?.toUpperCase() ?? '');

  const [form, setForm] = useState({
    employeeId: user.employeeId ?? '',
    name: user.name ?? '',
    email: user.email ?? '',
    password: '',
    role: user.role ?? '',
    department: user.department ?? '',
    departmentId: '',
    vpName: user.vpName ?? '',
    subDepartment: user.subDepartment ?? user.subDepartmentName ?? '',
    subDepartmentId: user.subDepartmentId ?? '',
    managerName: user.managerName ?? '',
    tlName: (user as unknown as Record<string, unknown>).tlName as string ?? '',
    officeLocation: user.officeLocation ?? '',
    isActive: user.isActive,
  });
  const [skills, setSkills] = useState<string[]>((user as unknown as Record<string, unknown>).technologies as string[] ?? []);
  const [skillInput, setSkillInput] = useState('');

  const [cities, setCities] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [departments, setDepartments] = useState<{ _id: string; name: string; managerName?: string; manager_name?: string }[]>([]);
  const [subDepartments, setSubDepartments] = useState<{ _id: string; name: string; managerName?: string }[]>([]);
  const [tlUsers, setTlUsers] = useState<{ _id: string; name: string; subDepartmentName?: string; subDepartment?: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    service.getCities().then((res: unknown) => { const r = res as Record<string, unknown>; setCities(Array.isArray(r?.data ?? r) ? (r?.data ?? r) as string[] : []); }).catch(() => {});
    service.getRoles().then((res: unknown) => { const r = res as Record<string, unknown>; setRoles(Array.isArray(r?.data ?? r) ? (r?.data ?? r) as string[] : []); }).catch(() => {});
    service.getDepartments().then((res: unknown) => {
      const r = res as Record<string, unknown>;
      const raw = r?.data as Record<string, unknown> ?? r;
      const arr = Array.isArray(raw) ? raw : Array.isArray((raw as Record<string, unknown>)?.departments) ? (raw as Record<string, unknown>).departments : [];
      setDepartments(arr as { _id: string; name: string; managerName?: string; manager_name?: string }[]);
    }).catch(() => {});
  }, []);

  // load sub-departments for the pre-selected department
  useEffect(() => {
    if (!form.department || !departments.length) return;
    const dept = departments.find(d => d.name === form.department);
    if (dept?._id) {
      service.getSubDepartments(dept._id).then((res: unknown) => {
        const r = res as Record<string, unknown>;
        const data = r?.data ?? r;
        setSubDepartments(Array.isArray(data) ? data as { _id: string; name: string; managerName?: string }[] : []);
      }).catch(() => {});
      setForm(f => ({ ...f, departmentId: dept._id }));
    }
  }, [departments, form.department]);

  // load TLs for the pre-selected sub-department
  useEffect(() => {
    if (!form.subDepartment || !form.department) return;
    service.getUsers({ role: 'TL', department: form.department }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      const d = r?.data as Record<string, unknown> ?? r;
      const users = (Array.isArray((d as Record<string, unknown>)?.users) ? (d as Record<string, unknown>).users : Array.isArray(d) ? d : []) as { _id: string; name: string; subDepartmentName?: string; subDepartment?: string }[];
      setTlUsers(users.filter(u => (u.subDepartmentName || u.subDepartment || '').toLowerCase() === form.subDepartment.toLowerCase()));
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.subDepartment]);

  const onDeptChange = (selectedName: string) => {
    const dept = departments.find(d => d.name === selectedName);
    const vpName = dept?.managerName ?? dept?.manager_name ?? '';
    setSubDepartments([]);
    setTlUsers([]);
    setForm(f => ({ ...f, department: selectedName, departmentId: dept?._id ?? '', vpName, subDepartment: '', subDepartmentId: '', managerName: '', tlName: '' }));
    if (dept?._id) {
      service.getSubDepartments(dept._id).then((res: unknown) => {
        const r = res as Record<string, unknown>;
        const data = r?.data ?? r;
        setSubDepartments(Array.isArray(data) ? data as { _id: string; name: string; managerName?: string }[] : []);
      }).catch(() => {});
    }
  };

  const onSubDeptChange = (selectedName: string) => {
    const sub = subDepartments.find(s => s.name === selectedName);
    setTlUsers([]);
    setForm(f => ({ ...f, subDepartment: selectedName, subDepartmentId: sub?._id ?? '', managerName: sub?.managerName ?? '', tlName: '' }));
    service.getUsers({ role: 'TL', department: form.department }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      const d = r?.data as Record<string, unknown> ?? r;
      const users = (Array.isArray((d as Record<string, unknown>)?.users) ? (d as Record<string, unknown>).users : Array.isArray(d) ? d : []) as { _id: string; name: string; subDepartmentName?: string; subDepartment?: string }[];
      setTlUsers(users.filter(u => (u.subDepartmentName || u.subDepartment || '').toLowerCase() === selectedName.toLowerCase()));
    }).catch(() => {});
  };

  const handleSkillKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) setSkills(p => [...p, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.email) { SnackNotification('Name and email are required', 'error'); return; }
    setSaving(true);
    const role = form.role.toUpperCase();
    const payload: Record<string, unknown> = {
      employeeId: form.employeeId,
      name: form.name,
      email: form.email,
      isActive: form.isActive,
      role: form.role,
      department: form.department || undefined,
      officeLocation: form.officeLocation || undefined,
      technologies: skills,
    };
    if (form.password) payload.password = form.password;
    if (form.vpName) payload.vp_name = form.vpName;
    if (form.subDepartment) payload.sub_department_name = form.subDepartment;
    if (form.subDepartmentId) payload.sub_department_id = form.subDepartmentId;
    if (form.managerName) payload.manager_name = form.managerName;
    if ((role === 'USER' || role === 'TEAM' || role === 'DM') && form.tlName) payload.tl_name = form.tlName;
    try {
      await service.updateAdminUser(user._id, payload);
      SnackNotification('User updated successfully', 'success');
      onSuccess();
      onClose();
    } catch { /* handled by interceptor */ } finally {
      setSaving(false);
    }
  };

  const currentRoleUpper = form.role.toUpperCase();
  const showSubDeptFields = ['DM', 'TL', 'USER', 'TEAM', 'EMPLOYEE'].includes(currentRoleUpper);
  const showDMField = ['TL', 'USER', 'TEAM', 'EMPLOYEE'].includes(currentRoleUpper);
  const showTLField = ['USER', 'TEAM', 'EMPLOYEE'].includes(currentRoleUpper);

  return (
    <Modal open onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        bgcolor: '#fff', borderRadius: '20px', width: '90vw', maxWidth: 760,
        maxHeight: '92vh', display: 'flex', flexDirection: 'column', outline: 'none',
        boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
      }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2.5, borderBottom: `1px solid ${BORDER}` }}>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 17, color: 'grey.900' }}>Edit User</Typography>
            <Typography sx={{ fontSize: 12, color: 'grey.400', mt: 0.2 }}>{user.email}</Typography>
          </Box>
          <IconButton size="small" onClick={onClose}><CloseRounded /></IconButton>
        </Box>

        {/* Body */}
        <Box sx={{ overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* Identity */}
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 12, color: RED, textTransform: 'uppercase', letterSpacing: 1, mb: 1.5 }}>Identity</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Row>
                <Box>
                  {label('Employee ID')}
                  <Box sx={inputSx}><InputBase fullWidth value={form.employeeId} onChange={e => setForm(f => ({ ...f, employeeId: e.target.value }))} placeholder="e.g. EMP-001" sx={{ fontSize: '13.5px' }} /></Box>
                </Box>
                <Box>
                  {label('Full Name')}
                  <Box sx={inputSx}><InputBase fullWidth value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Enter full name" sx={{ fontSize: '13.5px' }} /></Box>
                </Box>
              </Row>
              <Row>
                <Box>
                  {label('Corporate Email')}
                  <Box sx={inputSx}><InputBase fullWidth value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="name@company.com" sx={{ fontSize: '13.5px' }} /></Box>
                </Box>
                <Box>
                  {label('New Password')}
                  <Box sx={inputSx}><InputBase fullWidth type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Leave blank to keep unchanged" sx={{ fontSize: '13.5px' }} /></Box>
                </Box>
              </Row>
            </Box>
          </Box>

          {/* Placement */}
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 12, color: RED, textTransform: 'uppercase', letterSpacing: 1, mb: 1.5 }}>Placement</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Row>
                <Box>
                  {label('Role')}
                  <FormControl fullWidth size="small">
                    <Select value={form.role} displayEmpty onChange={e => {
                      setSubDepartments([]); setTlUsers([]);
                      setForm(f => ({ ...f, role: e.target.value, vpName: '', subDepartment: '', subDepartmentId: '', managerName: '', tlName: '' }));
                    }} sx={selectSx} renderValue={v => v || <Typography sx={{ color: 'grey.400', fontSize: '13.5px' }}>Select role</Typography>}>
                      {roles.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Box>
                <Box>
                  {label('Department')}
                  <FormControl fullWidth size="small">
                    <Select value={form.department} displayEmpty onChange={e => onDeptChange(e.target.value)} sx={selectSx}
                      renderValue={v => v || <Typography sx={{ color: 'grey.400', fontSize: '13.5px' }}>Select department</Typography>}>
                      {departments.map(d => <MenuItem key={d._id} value={d.name}>{d.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Box>
              </Row>

              {showSubDeptFields && (
                <Row>
                  <Box>
                    {label('VP Name')}
                    <Box sx={readonlySx}>
                      <PersonSearchRounded sx={{ color: 'grey.400', fontSize: 17 }} />
                      <InputBase fullWidth value={form.vpName} readOnly placeholder="Auto-filled from department" sx={{ fontSize: '13.5px', color: 'grey.600' }} />
                    </Box>
                  </Box>
                  <Box>
                    {label('Sub-Department')}
                    <FormControl fullWidth size="small">
                      <Select value={form.subDepartment} displayEmpty disabled={!form.department} onChange={e => onSubDeptChange(e.target.value)} sx={selectSx}
                        renderValue={v => v || <Typography sx={{ color: 'grey.400', fontSize: '13.5px' }}>{form.department ? 'Select sub-department' : 'Select department first'}</Typography>}>
                        {subDepartments.length === 0
                          ? <MenuItem disabled><Typography sx={{ fontSize: 13, color: 'grey.400' }}>No sub-departments</Typography></MenuItem>
                          : subDepartments.map(s => <MenuItem key={s._id} value={s.name}>{s.name}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Box>
                </Row>
              )}

              {showDMField && (
                <Row>
                  <Box>
                    {label('DM Name')}
                    <Box sx={readonlySx}>
                      <PersonSearchRounded sx={{ color: 'grey.400', fontSize: 17 }} />
                      <InputBase fullWidth value={form.managerName} readOnly placeholder="Auto-filled from sub-department" sx={{ fontSize: '13.5px', color: 'grey.600' }} />
                    </Box>
                  </Box>
                  {showTLField && (
                    <Box>
                      {label('TL')}
                      <FormControl fullWidth size="small">
                        <Select value={form.tlName} displayEmpty disabled={!form.subDepartment} onChange={e => setForm(f => ({ ...f, tlName: e.target.value }))} sx={selectSx}
                          renderValue={v => v || <Typography sx={{ color: 'grey.400', fontSize: '13.5px' }}>{form.subDepartment ? 'Select TL' : 'Select sub-department first'}</Typography>}>
                          {tlUsers.length === 0
                            ? <MenuItem disabled><Typography sx={{ fontSize: 13, color: 'grey.400' }}>No TLs found</Typography></MenuItem>
                            : tlUsers.map(t => <MenuItem key={t._id} value={t.name}>{t.name}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Box>
                  )}
                  {!showTLField && (
                    <Box>
                      {label('Office Location')}
                      <CitySelect cities={cities} value={form.officeLocation} onChange={v => setForm(f => ({ ...f, officeLocation: v }))} />
                    </Box>
                  )}
                </Row>
              )}

              {(showTLField || (!showDMField && !showSubDeptFields)) && (
                <Row>
                  <Box>
                    {label('Office Location')}
                    <CitySelect cities={cities} value={form.officeLocation} onChange={v => setForm(f => ({ ...f, officeLocation: v }))} />
                  </Box>
                  <Box />
                </Row>
              )}

              {!showSubDeptFields && !showTLField && showDMField && (
                <Row>
                  <Box>
                    {label('Office Location')}
                    <CitySelect cities={cities} value={form.officeLocation} onChange={v => setForm(f => ({ ...f, officeLocation: v }))} />
                  </Box>
                  <Box />
                </Row>
              )}
            </Box>
          </Box>

          {/* Skills */}
          {!isUser && (
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 12, color: RED, textTransform: 'uppercase', letterSpacing: 1, mb: 1.5 }}>Skills</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, border: `1.5px solid ${BORDER}`, borderRadius: '10px', p: 1.5, minHeight: 46, alignItems: 'center', '&:focus-within': { borderColor: RED } }}>
                {skills.map(sk => <Chip key={sk} label={sk} size="small" onDelete={() => setSkills(p => p.filter(s => s !== sk))} sx={{ fontSize: 12, bgcolor: '#FFF1F2', color: RED, '& .MuiChip-deleteIcon': { color: RED } }} />)}
                <InputBase value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={handleSkillKey} placeholder="Type and press Enter…" sx={{ flex: 1, minWidth: 140, fontSize: '13.5px' }} />
              </Box>
            </Box>
          )}

          {/* Status */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1px solid ${BORDER}`, borderRadius: '12px', px: 2.5, py: 1.5 }}>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: 13, color: 'grey.800' }}>Account Status</Typography>
              <Typography sx={{ fontSize: 12, color: 'grey.400' }}>{form.isActive ? 'User is active and can log in' : 'User is inactive'}</Typography>
            </Box>
            <Switch checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
              sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: RED }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: RED } }} />
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, px: 3, py: 2, borderTop: `1px solid ${BORDER}` }}>
          <Button onClick={onClose} sx={{ textTransform: 'none', fontWeight: 600, color: 'grey.600', fontSize: 13 }}>Cancel</Button>
          <Button variant="contained" startIcon={saving ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : <SaveRounded />}
            disabled={saving} onClick={handleSave}
            sx={{ textTransform: 'none', fontWeight: 600, fontSize: 13, borderRadius: '8px', bgcolor: RED, '&:hover': { bgcolor: '#6e1424' }, px: 3 }}>
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditUserModal;
