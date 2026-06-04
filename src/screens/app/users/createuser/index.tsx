import { Fragment, useState, useEffect, useRef, type KeyboardEvent } from 'react';
import {
    Box,
    Typography,
    Button,
    Select,
    MenuItem,
    InputBase,
    Chip,
    IconButton,
    FormControl,
    Paper,
    ClickAwayListener,
    ListItemButton,
} from '@mui/material';
import {
    BadgeRounded,
    WorkRounded,
    PsychologyRounded,
    ChevronRightRounded,
    EmailRounded,
    LocationOnRounded,
    VisibilityRounded,
    VisibilityOffRounded,
    PersonSearchRounded,
    SearchRounded,
    KeyboardArrowDownRounded,
} from '@mui/icons-material';
import TabTitle from '../../../../components/tabtitle';
import { service } from '../../../../service';
import { SnackNotification } from '../../../../helper/snackMessage';
import {
    BRAND_RED,
    BRAND_DARK,
    pageWrapper,
    pageHeader,
    breadcrumbRow,
    sectionCard,
    sectionTitle,
    fieldRow,
    fieldLabel,
    inputBase,
    selectBase,
    tagChip,
    skillsBox,
    actionRow,
} from './styles';

const INITIAL_SKILLS = ['React.js', 'Project Management', 'UI/UX Design'];

interface CitySearchSelectProps {
    cities: string[];
    value: string;
    onChange: (city: string) => void;
}

const CitySearchSelect = ({ cities, value, onChange }: CitySearchSelectProps) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const anchorRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const filtered = search.trim()
        ? cities.filter(c => c.toLowerCase().includes(search.toLowerCase()))
        : cities;

    const handleOpen = () => {
        setOpen(true);
        setTimeout(() => searchRef.current?.focus(), 50);
    };

    const handleSelect = (city: string) => {
        onChange(city);
        setOpen(false);
        setSearch('');
    };

    return (
        <ClickAwayListener onClickAway={() => { setOpen(false); setSearch(''); }}>
            <Box sx={{ position: 'relative' }}>
                <Box
                    ref={anchorRef}
                    onClick={handleOpen}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 1.5,
                        py: '9px',
                        border: open ? `1.5px solid ${BRAND_RED}` : '1.5px solid #E5E7EB',
                        borderRadius: '10px',
                        background: '#FAFAFA',
                        cursor: 'pointer',
                        minHeight: 42,
                        transition: 'border-color 0.15s',
                        '&:hover': { borderColor: BRAND_RED },
                    }}
                >
                    <LocationOnRounded sx={{ color: 'grey.400', fontSize: 17, flexShrink: 0 }} />
                    <Typography sx={{ flex: 1, fontSize: '13.5px', color: value ? 'grey.800' : 'grey.400' }}>
                        {value || 'Select office location'}
                    </Typography>
                    <KeyboardArrowDownRounded
                        sx={{
                            color: 'grey.400',
                            fontSize: 18,
                            flexShrink: 0,
                            transition: 'transform 0.2s',
                            transform: open ? 'rotate(180deg)' : 'none',
                        }}
                    />
                </Box>

                {open && (
                    <Paper
                        elevation={4}
                        sx={{
                            position: 'absolute',
                            top: 'calc(100% + 4px)',
                            left: 0,
                            right: 0,
                            zIndex: 1400,
                            borderRadius: '10px',
                            overflow: 'hidden',
                            border: '1px solid #E5E7EB',
                        }}
                    >
                        {/* Search input */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 1.5,
                            py: 1,
                            borderBottom: '1px solid #F0F0F0',
                            background: '#fff',
                        }}>
                            <SearchRounded sx={{ color: 'grey.400', fontSize: 17 }} />
                            <InputBase
                                inputRef={searchRef}
                                fullWidth
                                placeholder="Search city..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                sx={{ fontSize: '13px', color: 'grey.800' }}
                            />
                        </Box>

                        {/* City list */}
                        <Box sx={{ maxHeight: 220, overflowY: 'auto' }}>
                            {filtered.length === 0 ? (
                                <Typography sx={{ px: 2, py: 1.5, fontSize: '13px', color: 'grey.400' }}>
                                    No cities found
                                </Typography>
                            ) : (
                                filtered.map(city => (
                                    <ListItemButton
                                        key={city}
                                        selected={city === value}
                                        onClick={() => handleSelect(city)}
                                        sx={{
                                            fontSize: '13.5px',
                                            py: 0.8,
                                            px: 2,
                                            '&.Mui-selected': {
                                                background: '#FFF1F2',
                                                color: BRAND_RED,
                                                fontWeight: 600,
                                            },
                                            '&:hover': { background: '#FFF8F8' },
                                        }}
                                    >
                                        {city}
                                    </ListItemButton>
                                ))
                            )}
                        </Box>
                    </Paper>
                )}
            </Box>
        </ClickAwayListener>
    );
};

const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <Box sx={sectionTitle}>
        <Box sx={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            background: '#FFF1F2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            {icon}
        </Box>
        <Typography variant="h5" sx={{ color: BRAND_RED, fontWeight: 600 }}>
            {title}
        </Typography>
    </Box>
);

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <Typography sx={fieldLabel}>{children}</Typography>
);

const CreateUser = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [skills, setSkills] = useState<string[]>(INITIAL_SKILLS);
    const [skillInput, setSkillInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [cities, setCities] = useState<string[]>([]);
    const [roles, setRoles] = useState<string[]>([]);

    useEffect(() => {
        service.getCities().then((res: any) => {
            const data = res?.data ?? res
            setCities(Array.isArray(data) ? data : [])
        }).catch(() => setCities([]))
        service.getRoles().then((res: any) => {
            const data = res?.data ?? res
            setRoles(Array.isArray(data) ? data : [])
        }).catch(() => setRoles([]))
    }, []);

    const [form, setForm] = useState({
        employeeId: '',
        fullName: '',
        email: '',
        password: '123456',
        role: '',
        department: '',
        reportingManager: '',
        officeLocation: '',
    });

    const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            if (!skills.includes(skillInput.trim())) {
                setSkills(prev => [...prev, skillInput.trim()]);
            }
            setSkillInput('');
        }
    };

    const removeSkill = (skill: string) => {
        setSkills(prev => prev.filter(s => s !== skill));
    };

    const handleSubmit = async () => {
        if (!form.employeeId || !form.fullName || !form.email || !form.role || !form.department || !form.officeLocation) {
            SnackNotification('Please fill all required fields', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            await service.onboardUser({
                employeeId: form.employeeId,
                fullName: form.fullName,
                corporateEmail: form.email,
                password: form.password,
                role: form.role,
                department: form.department,
                officeLocation: form.officeLocation,
            });
            SnackNotification('User onboarded successfully', 'success');
            setForm({
                employeeId: '',
                fullName: '',
                email: '',
                password: '123456',
                role: '',
                department: '',
                reportingManager: '',
                officeLocation: '',
            });
        } catch (error) {
            console.error('Onboard error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Fragment>
            <TabTitle title="Create User" />
            <Box sx={pageWrapper}>
                {/* Page header */}
                <Box sx={pageHeader}>
                    <Box>
                        <Box sx={breadcrumbRow}>
                            <Typography variant="subtitle2" sx={{ color: 'grey.500' }}>Directory</Typography>
                            <ChevronRightRounded sx={{ fontSize: 14, color: 'grey.400' }} />
                            <Typography variant="subtitle2" sx={{ color: BRAND_RED, fontWeight: 600 }}>
                                User Registration
                            </Typography>
                        </Box>
                        <Typography variant="h3" sx={{ color: 'grey.900', fontWeight: 700 }}>
                            Create New User
                        </Typography>
                    </Box>
                </Box>

                {/* Divider line */}
                <Box sx={{ height: '2px', background: `linear-gradient(90deg, ${BRAND_RED} 0%, transparent 60%)`, mb: 3 }} />

                {/* Section 1 — Employee Identity */}
                <Box sx={sectionCard}>
                    <SectionHeader
                        icon={<BadgeRounded sx={{ color: BRAND_RED, fontSize: 18 }} />}
                        title="Employee Identity"
                    />

                    <Box sx={fieldRow}>
                        <Box>
                            <FieldLabel>Employee ID</FieldLabel>
                            <Box sx={inputBase}>
                                <InputBase
                                    fullWidth
                                    placeholder="e.g. EMP-9940"
                                    value={form.employeeId}
                                    onChange={e => setForm(f => ({ ...f, employeeId: e.target.value }))}
                                    sx={{ fontSize: '13.5px', color: 'grey.800' }}
                                />
                            </Box>
                        </Box>
                        <Box>
                            <FieldLabel>Full Name</FieldLabel>
                            <Box sx={inputBase}>
                                <InputBase
                                    fullWidth
                                    placeholder="Enter first and last name"
                                    value={form.fullName}
                                    onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                                    sx={{ fontSize: '13.5px', color: 'grey.800' }}
                                />
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={fieldRow}>
                        <Box>
                            <FieldLabel>Corporate Email</FieldLabel>
                            <Box sx={inputBase}>
                                <EmailRounded sx={{ color: 'grey.400', fontSize: 17, flexShrink: 0 }} />
                                <InputBase
                                    fullWidth
                                    placeholder="name@neolearn360.com"
                                    value={form.email}
                                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                    sx={{ fontSize: '13.5px', color: 'grey.800' }}
                                />
                            </Box>
                        </Box>
                        <Box>
                            <FieldLabel>Temporary Password</FieldLabel>
                            <Box sx={{ ...inputBase, justifyContent: 'space-between', bgcolor: '#f5f5f5' }}>
                                <InputBase
                                    fullWidth
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    disabled
                                    sx={{ fontSize: '13.5px', color: 'grey.500' }}
                                />
                                <IconButton size="small" onClick={() => setShowPassword(p => !p)} sx={{ p: 0.3 }}>
                                    {showPassword
                                        ? <VisibilityOffRounded sx={{ fontSize: 18, color: 'grey.400' }} />
                                        : <VisibilityRounded sx={{ fontSize: 18, color: 'grey.400' }} />
                                    }
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Section 2 — Professional Placement */}
                <Box sx={sectionCard}>
                    <SectionHeader
                        icon={<WorkRounded sx={{ color: BRAND_RED, fontSize: 18 }} />}
                        title="Professional Placement"
                    />

                    <Box sx={fieldRow}>
                        <Box>
                            <FieldLabel>Role</FieldLabel>
                            <FormControl fullWidth size="small">
                                <Select
                                    displayEmpty
                                    value={form.role}
                                    onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                                    sx={selectBase}
                                    renderValue={v => v || <Typography sx={{ color: 'grey.400', fontSize: '13.5px' }}>Select user role</Typography>}
                                >
                                    {roles.map(r => (
                                        <MenuItem key={r} value={r}>{r}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            <FieldLabel>Department</FieldLabel>
                            <FormControl fullWidth size="small">
                                <Select
                                    displayEmpty
                                    value={form.department}
                                    onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                                    sx={selectBase}
                                    renderValue={v => v || <Typography sx={{ color: 'grey.400', fontSize: '13.5px' }}>Select department</Typography>}
                                >
                                    <MenuItem value="engineering">Engineering</MenuItem>
                                    <MenuItem value="product">Product</MenuItem>
                                    <MenuItem value="design">Design</MenuItem>
                                    <MenuItem value="hr">Human Resources</MenuItem>
                                    <MenuItem value="finance">Finance</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>

                    <Box sx={fieldRow}>
                        <Box>
                            <FieldLabel>Reporting Manager</FieldLabel>
                            <Box sx={inputBase}>
                                <PersonSearchRounded sx={{ color: 'grey.400', fontSize: 17, flexShrink: 0 }} />
                                <InputBase
                                    fullWidth
                                    placeholder="Search manager by name or ID"
                                    value={form.reportingManager}
                                    onChange={e => setForm(f => ({ ...f, reportingManager: e.target.value }))}
                                    sx={{ fontSize: '13.5px', color: 'grey.800' }}
                                />
                            </Box>
                        </Box>
                        <Box>
                            <FieldLabel>Office Location</FieldLabel>
                            <CitySearchSelect
                                cities={cities}
                                value={form.officeLocation}
                                onChange={city => setForm(f => ({ ...f, officeLocation: city }))}
                            />
                        </Box>
                    </Box>
                </Box>

                {/* Section 3 — Primary Skills */}
                <Box sx={sectionCard}>
                    <SectionHeader
                        icon={<PsychologyRounded sx={{ color: BRAND_RED, fontSize: 18 }} />}
                        title="Primary Skills"
                    />

                    <Typography variant="subtitle1" sx={{ color: 'grey.600', mb: 1.5, fontSize: '13px' }}>
                        Identify core competencies to personalize the learning journey.
                    </Typography>

                    <Box sx={skillsBox}>
                        {skills.map(skill => (
                            <Chip
                                key={skill}
                                label={skill}
                                onDelete={() => removeSkill(skill)}
                                size="small"
                                sx={tagChip}
                            />
                        ))}
                        <InputBase
                            value={skillInput}
                            onChange={e => setSkillInput(e.target.value)}
                            onKeyDown={handleSkillKeyDown}
                            placeholder="Type a skill and press enter..."
                            sx={{
                                flex: 1,
                                minWidth: 160,
                                fontSize: '13.5px',
                                color: 'grey.800',
                                '& input::placeholder': { color: 'grey.400' },
                            }}
                        />
                    </Box>
                </Box>

                {/* Action button */}
                <Box sx={actionRow}>
                    <Button
                        variant="contained"
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                        sx={{
                            background: BRAND_DARK,
                            fontWeight: 600,
                            fontSize: '13px',
                            borderRadius: '8px',
                            textTransform: 'none',
                            px: 4,
                            '&:hover': { background: BRAND_RED },
                        }}
                    >
                        {isSubmitting ? 'Adding...' : 'Add User'}
                    </Button>
                </Box>
            </Box>
        </Fragment>
    );
};

export default CreateUser;
