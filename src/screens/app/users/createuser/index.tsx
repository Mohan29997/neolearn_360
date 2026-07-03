import { useState, useEffect, useRef, type KeyboardEvent } from 'react';
import {
    Box, Typography, Button, Select, MenuItem, InputBase,
    Chip, IconButton, FormControl, Paper, ClickAwayListener, ListItemButton,
} from '@mui/material';
import {
    BadgeRounded, WorkRounded, PsychologyRounded,
    EmailRounded, LocationOnRounded, VisibilityRounded, VisibilityOffRounded,
    PersonSearchRounded, SearchRounded, KeyboardArrowDownRounded,
} from '@mui/icons-material';
import { service } from '../../../../service';
import { SnackNotification } from '../../../../helper/snackMessage';
import {
    BRAND_RED, BRAND_DARK, sectionCard, sectionTitle,
    fieldRow, fieldLabel, inputBase, selectBase, tagChip, skillsBox, actionRow,
} from './styles';

const INITIAL_SKILLS = ['React.js', 'Project Management', 'UI/UX Design'];

const CitySearchSelect = ({ cities, value, onChange }: { cities: string[]; value: string; onChange: (c: string) => void }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const searchRef = useRef<HTMLInputElement>(null);
    const filtered = search.trim() ? cities.filter(c => c.toLowerCase().includes(search.toLowerCase())) : cities;

    return (
        <ClickAwayListener onClickAway={() => { setOpen(false); setSearch(''); }}>
            <Box sx={{ position: 'relative' }}>
                <Box onClick={() => { setOpen(true); setTimeout(() => searchRef.current?.focus(), 50); }} sx={{
                    display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: '9px',
                    border: open ? `1.5px solid ${BRAND_RED}` : '1.5px solid #E5E7EB',
                    borderRadius: '10px', background: '#FAFAFA', cursor: 'pointer', minHeight: 42,
                    '&:hover': { borderColor: BRAND_RED },
                }}>
                    <LocationOnRounded sx={{ color: 'grey.400', fontSize: 17, flexShrink: 0 }} />
                    <Typography sx={{ flex: 1, fontSize: '13.5px', color: value ? 'grey.800' : 'grey.400' }}>
                        {value || 'Select office location'}
                    </Typography>
                    <KeyboardArrowDownRounded sx={{ color: 'grey.400', fontSize: 18, flexShrink: 0, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }} />
                </Box>
                {open && (
                    <Paper elevation={4} sx={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 1500, borderRadius: '10px', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1, borderBottom: '1px solid #F0F0F0' }}>
                            <SearchRounded sx={{ color: 'grey.400', fontSize: 17 }} />
                            <InputBase inputRef={searchRef} fullWidth placeholder="Search city..." value={search} onChange={e => setSearch(e.target.value)} sx={{ fontSize: '13px' }} />
                        </Box>
                        <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                            {filtered.length === 0
                                ? <Typography sx={{ px: 2, py: 1.5, fontSize: '13px', color: 'grey.400' }}>No cities found</Typography>
                                : filtered.map(city => (
                                    <ListItemButton key={city} selected={city === value} onClick={() => { onChange(city); setOpen(false); setSearch(''); }}
                                        sx={{ fontSize: '13.5px', py: 0.8, px: 2, '&.Mui-selected': { background: '#FFF1F2', color: BRAND_RED }, '&:hover': { background: '#FFF8F8' } }}>
                                        {city}
                                    </ListItemButton>
                                ))
                            }
                        </Box>
                    </Paper>
                )}
            </Box>
        </ClickAwayListener>
    );
};

const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <Box sx={sectionTitle}>
        <Box sx={{ width: 32, height: 32, borderRadius: '8px', background: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</Box>
        <Typography variant="h6" sx={{ color: BRAND_RED, fontWeight: 600 }}>{title}</Typography>
    </Box>
);

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <Typography sx={fieldLabel}>{children}</Typography>
);

interface CreateUserFormProps {
    onSuccess?: () => void;
}

const CreateUserForm = ({ onSuccess }: CreateUserFormProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [skills, setSkills] = useState<string[]>(INITIAL_SKILLS);
    const [skillInput, setSkillInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [cities, setCities] = useState<string[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [departments, setDepartments] = useState<{ _id: string; name: string; manager_name?: string; managerName?: string }[]>([]);
    const [subDepartments, setSubDepartments] = useState<{ _id: string; name: string; managerName?: string }[]>([]);
    const [tlUsers, setTlUsers] = useState<{ _id: string; name: string; vpName?: string; managerName?: string; subDepartmentName?: string; subDepartmentId?: string }[]>([]);
    const [lndManagers, setLndManagers] = useState<{ _id: string; name: string }[]>([]);
    const [form, setForm] = useState({ employeeId: '', fullName: '', email: '', password: '123456', role: '', department: '', departmentId: '', vpName: '', subDepartment: '', subDepartmentId: '', managerName: '', tlName: '', lndManagerId: '', reportingManager: '', officeLocation: '' });
    const isSuperAdmin = form.role.toUpperCase() === 'SUPER_ADMIN';
    const isDM = form.role.toUpperCase() === 'DM';
    const isTL = form.role.toUpperCase() === 'TL';
    const isUser = ['USER', 'EMPLOYEE', 'TEAM'].includes(form.role.toUpperCase());
    const isLndCoordinator = form.role.toUpperCase() === 'L&D_CODINATOR' || form.role.toUpperCase() === 'L&D_CODINATOR';

    useEffect(() => {
        service.getCities().then((res: any) => setCities(Array.isArray(res?.data ?? res) ? (res?.data ?? res) : [])).catch(() => { });
        service.getRoles().then((res: any) => setRoles(Array.isArray(res?.data ?? res) ? (res?.data ?? res) : [])).catch(() => { });
        service.getDepartments().then((res: any) => {
            const raw = res?.data ?? [];
            const arr = Array.isArray(raw) ? raw : (Array.isArray(raw?.departments) ? raw.departments : []);
            setDepartments(arr);
        }).catch(() => { });
    }, []);

    const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            if (!skills.includes(skillInput.trim())) setSkills(prev => [...prev, skillInput.trim()]);
            setSkillInput('');
        }
    };

    const handleSubmit = async () => {
        if (!form.employeeId || !form.fullName || !form.email || !form.role || !form.officeLocation) {
            SnackNotification('Please fill all required fields', 'error');
            return;
        }
        setIsSubmitting(true);
        try {
            const role = form.role.toUpperCase();
            const payload: Record<string, unknown> = {
                employeeId: form.employeeId,
                fullName: form.fullName,
                corporateEmail: form.email,
                password: form.password,
                role: form.role,
                department: form.department || undefined,
                officeLocation: form.officeLocation,
                technologies: skills,
            };

            if (role === 'DM') {
                if (form.vpName?.trim()) payload.vp_name = form.vpName.trim();
                if (form.subDepartment?.trim()) payload.sub_department_name = form.subDepartment.trim();
                if (form.subDepartmentId?.trim()) payload.sub_department_id = form.subDepartmentId.trim();
                if (form.managerName?.trim()) payload.manager_name = form.managerName.trim();
                if (form.tlName?.trim()) payload.tl_name = form.tlName.trim();
            } else if (role === 'TL') {
                if (form.vpName?.trim()) payload.vp_name = form.vpName.trim();
                if (form.subDepartment?.trim()) payload.sub_department_name = form.subDepartment.trim();
                if (form.subDepartmentId?.trim()) payload.sub_department_id = form.subDepartmentId.trim();
                if (form.managerName?.trim()) payload.manager_name = form.managerName.trim();
            } else if (role === 'USER' || role === 'EMPLOYEE' || role === 'TEAM') {
                if (form.vpName?.trim()) payload.vp_name = form.vpName.trim();
                if (form.subDepartment?.trim()) payload.sub_department_name = form.subDepartment.trim();
                if (form.subDepartmentId?.trim()) payload.sub_department_id = form.subDepartmentId.trim();
                if (form.managerName?.trim()) payload.manager_name = form.managerName.trim();
                if (form.tlName?.trim()) payload.tl_name = form.tlName.trim();
            } else if (role === 'EMPLOYEE' || role === 'MANAGER') {
                if (form.reportingManager?.trim()) payload.manager_name = form.reportingManager.trim();
            } else if (role === 'L&D_CODINATOR' || role === 'LND_COORDINATOR') {
                if (form.managerName?.trim()) payload.manager_name = form.managerName.trim();
                if (form.lndManagerId?.trim()) payload.lnd_manager_id = form.lndManagerId.trim();
            }

            await service.onboardUser(payload as any);
            SnackNotification('User onboarded successfully', 'success');
            setForm({ employeeId: '', fullName: '', email: '', password: '123456', role: '', department: '', departmentId: '', vpName: '', subDepartment: '', subDepartmentId: '', managerName: '', tlName: '', reportingManager: '', officeLocation: '' });
            setSubDepartments([]);
            setSkills([]);
            onSuccess?.();
        } catch {
            // error handled by interceptor
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box>
            {/* Employee Identity */}
            {!isSuperAdmin && <Box sx={sectionCard}>
                <SectionHeader icon={<BadgeRounded sx={{ color: BRAND_RED, fontSize: 18 }} />} title="Employee Identity" />
                <Box sx={fieldRow}>
                    <Box>
                        <FieldLabel>Employee ID</FieldLabel>
                        <Box sx={inputBase}><InputBase fullWidth placeholder="e.g. EMP-9940" value={form.employeeId} onChange={e => setForm(f => ({ ...f, employeeId: e.target.value }))} sx={{ fontSize: '13.5px' }} /></Box>
                    </Box>
                    <Box>
                        <FieldLabel>Full Name</FieldLabel>
                        <Box sx={inputBase}><InputBase fullWidth placeholder="Enter first and last name" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} sx={{ fontSize: '13.5px' }} /></Box>
                    </Box>
                </Box>
                <Box sx={fieldRow}>
                    <Box>
                        <FieldLabel>Corporate Email</FieldLabel>
                        <Box sx={inputBase}>
                            <EmailRounded sx={{ color: 'grey.400', fontSize: 17, flexShrink: 0 }} />
                            <InputBase fullWidth placeholder="name@neolearn360.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} sx={{ fontSize: '13.5px' }} />
                        </Box>
                    </Box>
                    <Box>
                        <FieldLabel>Temporary Password</FieldLabel>
                        <Box sx={{ ...inputBase, justifyContent: 'space-between', bgcolor: '#f5f5f5' }}>
                            <InputBase fullWidth type={showPassword ? 'text' : 'password'} value={form.password} disabled sx={{ fontSize: '13.5px', color: 'grey.500' }} />
                            <IconButton size="small" onClick={() => setShowPassword(p => !p)} sx={{ p: 0.3 }}>
                                {showPassword ? <VisibilityOffRounded sx={{ fontSize: 18, color: 'grey.400' }} /> : <VisibilityRounded sx={{ fontSize: 18, color: 'grey.400' }} />}
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </Box>}

            {/* Professional Placement */}
            <Box sx={sectionCard}>
                <SectionHeader icon={<WorkRounded sx={{ color: BRAND_RED, fontSize: 18 }} />} title="Professional Placement" />
                <Box sx={fieldRow}>
                    <Box>
                        <FieldLabel>Role</FieldLabel>
                        <FormControl fullWidth size="small">
                            <Select displayEmpty value={form.role} onChange={e => {
                                setSubDepartments([]);
                                setTlUsers([]);
                                setLndManagers([]);
                                const newRole = e.target.value.toUpperCase();
                                setForm(f => ({ ...f, role: e.target.value, department: '', departmentId: '', vpName: '', subDepartment: '', subDepartmentId: '', managerName: '', tlName: '', lndManagerId: '', reportingManager: '' }));
                            }} sx={selectBase}
                                renderValue={v => v || <Typography sx={{ color: 'grey.400', fontSize: '13.5px' }}>Select user role</Typography>}>
                                {roles.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box>
                        <FieldLabel>Department</FieldLabel>
                        {departments.length === 0 ? (
                            <Box sx={inputBase}>
                                <InputBase fullWidth placeholder="Enter department" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} sx={{ fontSize: '13.5px' }} />
                            </Box>
                        ) : (
                            <FormControl fullWidth size="small">
                                <Select displayEmpty value={form.department} onChange={e => {
                                    const selectedName = e.target.value;
                                    const dept = departments.find(d => d.name === selectedName);
                                    const vpName = dept?.managerName || dept?.manager_name || '';
                                    const currentRole = form.role.toUpperCase();
                                    const isEmployee = currentRole === 'EMPLOYEE';
                                    const isLnd = currentRole === 'L&D_CODINATOR' || currentRole === 'L&D_CODINATOR';
                                    const manager = isEmployee ? vpName : form.reportingManager;
                                    setSubDepartments([]);
                                    setTlUsers([]);
                                    setForm(f => ({ ...f, department: selectedName, departmentId: dept?._id ?? '', vpName, subDepartment: '', subDepartmentId: '', managerName: '', lndManagerId: '', tlName: '', reportingManager: manager }));
                                    if (isLnd) {
                                        service.getUsers({ role: 'L&D_MANAGER', limit: 90, page: 1 })
                                            .then((res: any) => {
                                                const all: any[] = res?.data?.users ?? (Array.isArray(res?.data) ? res.data : []);
                                                const forDept = all.filter(u =>
                                                    (u.department || '').toLowerCase() === selectedName.toLowerCase()
                                                );
                                                const mapped = forDept.map(u => ({ _id: u._id, name: u.name || u.fullName || '' }));
                                                setLndManagers(mapped);
                                                // auto-select if only one manager for this dept
                                                if (mapped.length === 1) {
                                                    setForm(f => ({ ...f, lndManagerId: mapped[0]._id, managerName: mapped[0].name }));
                                                } else if (mapped.length > 1) {
                                                    // pre-select first match
                                                    setForm(f => ({ ...f, lndManagerId: mapped[0]._id, managerName: mapped[0].name }));
                                                }
                                            })
                                            .catch(() => {});
                                    }
                                    if ((currentRole === 'DM' || currentRole === 'TL' || isUser) && dept?._id) {
                                        service.getSubDepartments(dept._id)
                                            .then((res: any) => {
                                                const data = res?.data ?? res;
                                                setSubDepartments(Array.isArray(data) ? data : []);
                                            })
                                            .catch(() => {});
                                    }
                                }} sx={selectBase}
                                    renderValue={v => v || <Typography sx={{ color: 'grey.400', fontSize: '13.5px' }}>Select department</Typography>}>
                                    {departments.map(d => <MenuItem key={d.name} value={d.name}>{d.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        )}
                    </Box>
                </Box>
                {isSuperAdmin ? (
                    <Box sx={fieldRow}>
                        <Box>
                            <FieldLabel>Office Location</FieldLabel>
                            <CitySearchSelect cities={cities} value={form.officeLocation} onChange={city => setForm(f => ({ ...f, officeLocation: city }))} />
                        </Box>
                    </Box>
                ) : isDM ? (
                    <>
                        <Box sx={fieldRow}>
                            <Box>
                                <FieldLabel>VP Name</FieldLabel>
                                <Box sx={{ ...inputBase, bgcolor: '#f5f5f5' }}>
                                    <PersonSearchRounded sx={{ color: 'grey.400', fontSize: 17, flexShrink: 0 }} />
                                    <InputBase fullWidth placeholder="Auto-filled from department" value={form.vpName} readOnly sx={{ fontSize: '13.5px', color: 'grey.600' }} />
                                </Box>
                            </Box>
                            <Box>
                                <FieldLabel>Sub-Department</FieldLabel>
                                <FormControl fullWidth size="small">
                                    <Select displayEmpty value={form.subDepartment}
                                        onChange={e => {
                                            const selectedSubName = e.target.value;
                                            const sub = subDepartments.find(s => s.name === selectedSubName);
                                            setForm(f => ({ ...f, subDepartment: selectedSubName, subDepartmentId: sub?._id ?? '' }));
                                        }}
                                        sx={selectBase}
                                        disabled={!form.department}
                                        renderValue={v => v || <Typography sx={{ color: 'grey.400', fontSize: '13.5px' }}>{form.department ? 'Select sub-department' : 'Select department first'}</Typography>}>
                                        {subDepartments.length === 0
                                            ? <MenuItem disabled><Typography sx={{ fontSize: 13, color: 'grey.400' }}>No sub-departments found</Typography></MenuItem>
                                            : subDepartments.map((s: any) => <MenuItem key={s._id} value={s.name}>{s.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                        <Box sx={fieldRow}>
                            <Box>
                                <FieldLabel>Office Location</FieldLabel>
                                <CitySearchSelect cities={cities} value={form.officeLocation} onChange={city => setForm(f => ({ ...f, officeLocation: city }))} />
                            </Box>
                        </Box>
                    </>
                ) : isTL ? (
                    <>
                        <Box sx={fieldRow}>
                            <Box>
                                <FieldLabel>VP Name</FieldLabel>
                                <Box sx={{ ...inputBase, bgcolor: '#f5f5f5' }}>
                                    <PersonSearchRounded sx={{ color: 'grey.400', fontSize: 17, flexShrink: 0 }} />
                                    <InputBase fullWidth placeholder="Auto-filled from department" value={form.vpName} readOnly sx={{ fontSize: '13.5px', color: 'grey.600' }} />
                                </Box>
                            </Box>
                            <Box>
                                <FieldLabel>Sub-Department</FieldLabel>
                                <FormControl fullWidth size="small">
                                    <Select displayEmpty value={form.subDepartment}
                                        onChange={e => {
                                            const selectedSubName = e.target.value;
                                            const sub = subDepartments.find((s: any) => s.name === selectedSubName);
                                            setForm(f => ({ ...f, subDepartment: selectedSubName, subDepartmentId: sub?._id ?? '', managerName: (sub as any)?.managerName || '' }));
                                        }}
                                        sx={selectBase}
                                        disabled={!form.department}
                                        renderValue={v => v || <Typography sx={{ color: 'grey.400', fontSize: '13.5px' }}>{form.department ? 'Select sub-department' : 'Select department first'}</Typography>}>
                                        {subDepartments.length === 0
                                            ? <MenuItem disabled><Typography sx={{ fontSize: 13, color: 'grey.400' }}>No sub-departments found</Typography></MenuItem>
                                            : subDepartments.map((s: any) => <MenuItem key={s._id} value={s.name}>{s.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                        <Box sx={fieldRow}>
                            <Box>
                                <FieldLabel>DM Name</FieldLabel>
                                <Box sx={{ ...inputBase, bgcolor: '#f5f5f5' }}>
                                    <PersonSearchRounded sx={{ color: 'grey.400', fontSize: 17, flexShrink: 0 }} />
                                    <InputBase fullWidth placeholder="Auto-filled from sub-department" value={form.managerName} readOnly sx={{ fontSize: '13.5px', color: 'grey.600' }} />
                                </Box>
                            </Box>
                            <Box>
                                <FieldLabel>Office Location</FieldLabel>
                                <CitySearchSelect cities={cities} value={form.officeLocation} onChange={city => setForm(f => ({ ...f, officeLocation: city }))} />
                            </Box>
                        </Box>
                    </>
                ) : isUser ? (
                    <>
                        <Box sx={fieldRow}>
                            <Box>
                                <FieldLabel>VP Name</FieldLabel>
                                <Box sx={{ ...inputBase, bgcolor: '#f5f5f5' }}>
                                    <PersonSearchRounded sx={{ color: 'grey.400', fontSize: 17, flexShrink: 0 }} />
                                    <InputBase fullWidth placeholder="Auto-filled from department" value={form.vpName} readOnly sx={{ fontSize: '13.5px', color: 'grey.600' }} />
                                </Box>
                            </Box>
                            <Box>
                                <FieldLabel>Sub-Department</FieldLabel>
                                <FormControl fullWidth size="small">
                                    <Select displayEmpty value={form.subDepartment}
                                        onChange={e => {
                                            const selectedSubName = e.target.value;
                                            const sub = subDepartments.find(s => s.name === selectedSubName);
                                            setTlUsers([]);
                                            setForm(f => ({ ...f, subDepartment: selectedSubName, subDepartmentId: sub?._id ?? '', managerName: sub?.managerName || '', tlName: '' }));
                                            if (sub?._id || selectedSubName) {
                                                service.getUsers({ role: 'TL', department: form.department })
                                                    .then((res: unknown) => {
                                                        const r = res as Record<string, unknown>;
                                                        const d = r?.data as Record<string, unknown> ?? r;
                                                        const users = (Array.isArray((d as Record<string, unknown>)?.users) ? (d as Record<string, unknown>).users : Array.isArray(d) ? d : []) as { _id: string; name: string; subDepartmentName?: string; subDepartment?: string; vpName?: string; managerName?: string; subDepartmentId?: string }[];
                                                        const filtered = users.filter(u =>
                                                            (u.subDepartmentName || u.subDepartment || '').toLowerCase() === selectedSubName.toLowerCase()
                                                        );
                                                        setTlUsers(filtered);
                                                    })
                                                    .catch(() => {});
                                            }
                                        }}
                                        sx={selectBase}
                                        disabled={!form.department}
                                        renderValue={v => v || <Typography sx={{ color: 'grey.400', fontSize: '13.5px' }}>{form.department ? 'Select sub-department' : 'Select department first'}</Typography>}>
                                        {subDepartments.length === 0
                                            ? <MenuItem disabled><Typography sx={{ fontSize: 13, color: 'grey.400' }}>No sub-departments found</Typography></MenuItem>
                                            : subDepartments.map(s => <MenuItem key={s._id} value={s.name}>{s.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                        <Box sx={fieldRow}>
                            <Box>
                                <FieldLabel>DM Name</FieldLabel>
                                <Box sx={{ ...inputBase, bgcolor: '#f5f5f5' }}>
                                    <PersonSearchRounded sx={{ color: 'grey.400', fontSize: 17, flexShrink: 0 }} />
                                    <InputBase fullWidth placeholder="Auto-filled from sub-department" value={form.managerName} readOnly sx={{ fontSize: '13.5px', color: 'grey.600' }} />
                                </Box>
                            </Box>
                            <Box>
                                <FieldLabel>TL</FieldLabel>
                                <FormControl fullWidth size="small">
                                    <Select displayEmpty value={form.tlName}
                                        onChange={e => setForm(f => ({ ...f, tlName: e.target.value }))}
                                        sx={selectBase}
                                        disabled={!form.subDepartment}
                                        renderValue={v => v || <Typography sx={{ color: 'grey.400', fontSize: '13.5px' }}>{form.subDepartment ? 'Select TL' : 'Select sub-department first'}</Typography>}>
                                        {tlUsers.length === 0
                                            ? <MenuItem disabled><Typography sx={{ fontSize: 13, color: 'grey.400' }}>No TLs found</Typography></MenuItem>
                                            : tlUsers.map(t => <MenuItem key={t._id} value={t.name}>{t.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                        <Box sx={fieldRow}>
                            <Box>
                                <FieldLabel>Office Location</FieldLabel>
                                <CitySearchSelect cities={cities} value={form.officeLocation} onChange={city => setForm(f => ({ ...f, officeLocation: city }))} />
                            </Box>
                        </Box>
                    </>
                ) : isLndCoordinator ? (
                    <>
                        <Box sx={fieldRow}>
                            <Box>
                                <FieldLabel>L&D Manager</FieldLabel>
                                <FormControl fullWidth size="small">
                                    <Select displayEmpty value={form.lndManagerId}
                                        onChange={e => {
                                            const mgr = lndManagers.find(m => m._id === e.target.value);
                                            setForm(f => ({ ...f, lndManagerId: e.target.value, managerName: mgr?.name ?? '' }));
                                        }}
                                        sx={selectBase}
                                        disabled={!form.department}
                                        renderValue={v => v ? (lndManagers.find(m => m._id === v)?.name ?? '') : <Typography sx={{ color: 'grey.400', fontSize: '13.5px' }}>{form.department ? 'Select L&D Manager' : 'Select department first'}</Typography>}>
                                        {lndManagers.length === 0
                                            ? <MenuItem disabled><Typography sx={{ fontSize: 13, color: 'grey.400' }}>No L&D Managers found for this department</Typography></MenuItem>
                                            : lndManagers.map(m => <MenuItem key={m._id} value={m._id}>{m.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box>
                                <FieldLabel>Office Location</FieldLabel>
                                <CitySearchSelect cities={cities} value={form.officeLocation} onChange={city => setForm(f => ({ ...f, officeLocation: city }))} />
                            </Box>
                        </Box>
                    </>
                ) : (
                    <Box sx={fieldRow}>
                        <Box>
                            <FieldLabel>Office Location</FieldLabel>
                            <CitySearchSelect cities={cities} value={form.officeLocation} onChange={city => setForm(f => ({ ...f, officeLocation: city }))} />
                        </Box>
                    </Box>
                )}
            </Box>

            {/* Primary Skills */}
            {!isSuperAdmin && <Box sx={sectionCard}>
                <SectionHeader icon={<PsychologyRounded sx={{ color: BRAND_RED, fontSize: 18 }} />} title="Primary Skills" />
                <Typography sx={{ color: 'grey.600', mb: 1.5, fontSize: '13px' }}>Identify core competencies to personalize the learning journey.</Typography>
                <Box sx={skillsBox}>
                    {skills.map(skill => <Chip key={skill} label={skill} onDelete={() => setSkills(prev => prev.filter(s => s !== skill))} size="small" sx={tagChip} />)}
                    <InputBase value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={handleSkillKeyDown} placeholder="Type a skill and press enter..."
                        sx={{ flex: 1, minWidth: 160, fontSize: '13.5px', '& input::placeholder': { color: 'grey.400' } }} />
                </Box>
            </Box>}

            {/* Actions */}
            <Box sx={actionRow}>
                <Button variant="contained" disabled={isSubmitting} onClick={handleSubmit}
                    sx={{ background: BRAND_DARK, fontWeight: 600, fontSize: '13px', borderRadius: '8px', textTransform: 'none', px: 4, '&:hover': { background: BRAND_RED } }}>
                    {isSubmitting ? 'Adding...' : 'Add User'}
                </Button>
            </Box>
        </Box>
    );
};

export default CreateUserForm;
