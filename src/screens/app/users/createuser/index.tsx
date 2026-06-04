import { Fragment, useState, type KeyboardEvent } from 'react';
import {
    Box,
    Typography,
    Button,
    Select,
    MenuItem,
    InputBase,
    Chip,
    IconButton,
    InputAdornment,
    FormControl,
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
} from '@mui/icons-material';
import TabTitle from '../../../../components/tabtitle';
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

    const [form, setForm] = useState({
        employeeId: '',
        fullName: '',
        email: '',
        password: '••••••••••••••',
        role: '',
        department: '',
        reportingManager: '',
        officeLocation: 'Headquarters - London',
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
                            <Box sx={{ ...inputBase, justifyContent: 'space-between' }}>
                                <InputBase
                                    fullWidth
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                    sx={{ fontSize: '13.5px', color: 'grey.800' }}
                                />
                                <IconButton size="small" onClick={() => setShowPassword(p => !p)} sx={{ p: 0.3 }}>
                                    {showPassword
                                        ? <VisibilityOffRounded sx={{ fontSize: 18, color: 'grey.500' }} />
                                        : <VisibilityRounded sx={{ fontSize: 18, color: 'grey.500' }} />
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
                                    <MenuItem value="admin">Admin</MenuItem>
                                    <MenuItem value="manager">Manager</MenuItem>
                                    <MenuItem value="employee">Employee</MenuItem>
                                    <MenuItem value="trainer">Trainer</MenuItem>
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
                            <FormControl fullWidth size="small">
                                <Select
                                    value={form.officeLocation}
                                    onChange={e => setForm(f => ({ ...f, officeLocation: e.target.value }))}
                                    sx={selectBase}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <LocationOnRounded sx={{ color: 'grey.400', fontSize: 17 }} />
                                        </InputAdornment>
                                    }
                                >
                                    <MenuItem value="Headquarters - London">Headquarters - London</MenuItem>
                                    <MenuItem value="New York Office">New York Office</MenuItem>
                                    <MenuItem value="Singapore Office">Singapore Office</MenuItem>
                                    <MenuItem value="Remote">Remote</MenuItem>
                                </Select>
                            </FormControl>
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
                        Add User
                    </Button>
                </Box>
            </Box>
        </Fragment>
    );
};

export default CreateUser;
