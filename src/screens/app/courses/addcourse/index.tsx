import { Fragment, useState } from 'react';
import {
    Box, Typography, Button, Select, MenuItem, FormControl,
    InputBase, Switch,
} from '@mui/material';
import {
    ChevronRightRounded, LinkRounded, AddRounded,
    CloudUploadRounded, CheckCircleOutlineRounded,
    AccessTimeRounded, DescriptionRounded,
    VerifiedRounded, DownloadRounded,
} from '@mui/icons-material';
import TabTitle from '../../../../components/tabtitle';
import {
    BRAND_RED, BRAND_DARK,
    breadcrumbRow, heroBanner, heroBannerOverlay, twoColLayout,
    formCard, sideCard, fieldRow, fieldLabelSx, inputBase, selectBase,
    textareaBase, certCard, switchSx, promoCard, bulkUploadCard, actionRow,
} from './styles';

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <Typography sx={fieldLabelSx}>{children}</Typography>
);

const GUIDELINES = [
    {
        icon: <LinkRounded sx={{ fontSize: 16, color: BRAND_RED }} />,
        title: 'Verify URLs',
        desc: 'Ensure all course links are accessible via the corporate VPN.',
    },
    {
        icon: <AccessTimeRounded sx={{ fontSize: 16, color: BRAND_RED }} />,
        title: 'Duration Accuracy',
        desc: 'Include time for practical assessments and final quizzes.',
    },
    {
        icon: <DescriptionRounded sx={{ fontSize: 16, color: BRAND_RED }} />,
        title: 'Clear Descriptions',
        desc: 'Descriptions help the auto-assignment algorithm map courses.',
    },
];

const AddCourse = () => {
    const [form, setForm] = useState({
        title: '',
        provider: '',
        technology: 'Cloud Computing',
        courseUrl: '',
        duration: '',
        level: 'Beginner',
        description: '',
    });
    const [certRequired, setCertRequired] = useState(false);

    const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(f => ({ ...f, [key]: e.target.value }));

    return (
        <Fragment>
            <TabTitle title="Add New Course" />
            <Box sx={{ width: '100%' }}>

                {/* Breadcrumb */}
                <Box sx={breadcrumbRow}>
                    <Typography variant="subtitle2" sx={{ color: 'grey.500' }}>Courses</Typography>
                    <ChevronRightRounded sx={{ fontSize: 14, color: 'grey.400' }} />
                    <Typography variant="subtitle2" sx={{ color: BRAND_RED, fontWeight: 700 }}>
                        Add New Course
                    </Typography>
                </Box>

                {/* Hero Banner */}
                <Box sx={heroBanner}>
                    <Box sx={heroBannerOverlay} />
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, lineHeight: 1.2, mb: 0.5 }}>
                            Add New Course
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.5px' }}>
                            LMS CORE ENTRY: Expand your enterprise library with curated professional development content.
                        </Typography>
                    </Box>
                </Box>

                {/* Two-column layout */}
                <Box sx={twoColLayout}>

                    {/* ── Left: Form ── */}
                    <Box sx={{ flex: 7 }}>
                        <Box sx={formCard}>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Course Information</Typography>
                            <Typography variant="subtitle2" sx={{ color: 'grey.500', mb: 3 }}>
                                Fill in the details below to add a new course to the enterprise library.
                            </Typography>

                            {/* Row 1: Title + Provider */}
                            <Box sx={fieldRow}>
                                <Box>
                                    <FieldLabel>Course Title</FieldLabel>
                                    <Box sx={inputBase}>
                                        <InputBase fullWidth placeholder="e.g. Advanced System Architecture"
                                            value={form.title} onChange={set('title')}
                                            sx={{ fontSize: '13.5px', color: 'grey.800' }} />
                                    </Box>
                                </Box>
                                <Box>
                                    <FieldLabel>Provider</FieldLabel>
                                    <Box sx={inputBase}>
                                        <InputBase fullWidth placeholder="e.g. Coursera, Internal, LinkedIn Learning"
                                            value={form.provider} onChange={set('provider')}
                                            sx={{ fontSize: '13.5px', color: 'grey.800' }} />
                                    </Box>
                                </Box>
                            </Box>

                            {/* Row 2: Technology + URL */}
                            <Box sx={fieldRow}>
                                <Box>
                                    <FieldLabel>Technology</FieldLabel>
                                    <FormControl fullWidth size="small">
                                        <Select value={form.technology}
                                            onChange={e => setForm(f => ({ ...f, technology: e.target.value }))}
                                            sx={selectBase}>
                                            <MenuItem value="Cloud Computing">Cloud Computing</MenuItem>
                                            <MenuItem value="Data Science">Data Science</MenuItem>
                                            <MenuItem value="Cybersecurity">Cybersecurity</MenuItem>
                                            <MenuItem value="DevOps">DevOps</MenuItem>
                                            <MenuItem value="Leadership">Leadership</MenuItem>
                                            <MenuItem value="Project Management">Project Management</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box>
                                    <FieldLabel>Course URL</FieldLabel>
                                    <Box sx={inputBase}>
                                        <LinkRounded sx={{ color: 'grey.400', fontSize: 17, flexShrink: 0 }} />
                                        <InputBase fullWidth placeholder="https://..."
                                            value={form.courseUrl} onChange={set('courseUrl')}
                                            sx={{ fontSize: '13.5px', color: 'grey.800' }} />
                                    </Box>
                                </Box>
                            </Box>

                            {/* Row 3: Duration + Level */}
                            <Box sx={fieldRow}>
                                <Box>
                                    <FieldLabel>Duration (Hours)</FieldLabel>
                                    <Box sx={inputBase}>
                                        <AccessTimeRounded sx={{ color: 'grey.400', fontSize: 17, flexShrink: 0 }} />
                                        <InputBase fullWidth placeholder="0.0" type="number"
                                            value={form.duration} onChange={set('duration')}
                                            sx={{ fontSize: '13.5px', color: 'grey.800' }} />
                                    </Box>
                                </Box>
                                <Box>
                                    <FieldLabel>Level</FieldLabel>
                                    <FormControl fullWidth size="small">
                                        <Select value={form.level}
                                            onChange={e => setForm(f => ({ ...f, level: e.target.value }))}
                                            sx={selectBase}>
                                            <MenuItem value="Beginner">Beginner</MenuItem>
                                            <MenuItem value="Intermediate">Intermediate</MenuItem>
                                            <MenuItem value="Advanced">Advanced</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Box>

                            {/* Description */}
                            <Box sx={{ mb: 2.5 }}>
                                <FieldLabel>Description</FieldLabel>
                                <Box sx={textareaBase}>
                                    <InputBase fullWidth multiline rows={4}
                                        placeholder="Provide a detailed overview of learning objectives and target audience..."
                                        value={form.description} onChange={set('description')}
                                        sx={{ fontSize: '13.5px', color: 'grey.800' }} />
                                </Box>
                            </Box>

                            {/* Certification Required toggle */}
                            <Box sx={certCard}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Box sx={{
                                        width: 34, height: 34, borderRadius: '8px',
                                        background: '#FFF1F2', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <VerifiedRounded sx={{ color: BRAND_RED, fontSize: 18 }} />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: 'grey.800' }}>
                                            Certification Required
                                        </Typography>
                                        <Typography sx={{ fontSize: '11.5px', color: 'grey.500' }}>
                                            Flag this course as a prerequisite for internal compliance.
                                        </Typography>
                                    </Box>
                                </Box>
                                <Switch checked={certRequired} onChange={e => setCertRequired(e.target.checked)}
                                    sx={switchSx} size="small" />
                            </Box>

                            {/* Action row */}
                            <Box sx={actionRow}>
                                <Button variant="text" sx={{
                                    color: 'grey.600', fontWeight: 600, fontSize: '13px',
                                    textTransform: 'none', px: 2,
                                }}>
                                    Discard
                                </Button>
                                <Button variant="contained" startIcon={<AddRounded />} sx={{
                                    background: BRAND_DARK, fontWeight: 600, fontSize: '13px',
                                    borderRadius: '10px', textTransform: 'none', px: 3,
                                    boxShadow: '0 4px 14px rgba(176,0,42,0.3)',
                                    '&:hover': { background: BRAND_RED },
                                }}>
                                    Add Course
                                </Button>
                            </Box>
                        </Box>
                    </Box>

                    {/* ── Right: Sidebar ── */}
                    <Box sx={{ flex: 3, position: 'sticky', top: 72 }}>

                        {/* Content Guidelines */}
                        <Box sx={sideCard}>
                            <Typography sx={{ fontWeight: 700, fontSize: '14px', color: 'grey.800', mb: 2 }}>
                                Content Guidelines
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {GUIDELINES.map(({ icon, title, desc }) => (
                                    <Box key={title} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                        <Box sx={{
                                            width: 30, height: 30, borderRadius: '8px', flexShrink: 0,
                                            background: '#FFF1F2', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            {icon}
                                        </Box>
                                        <Box>
                                            <Typography sx={{ fontSize: '12.5px', fontWeight: 600, color: 'grey.800' }}>
                                                {title}
                                            </Typography>
                                            <Typography sx={{ fontSize: '11.5px', color: 'grey.500', lineHeight: 1.5 }}>
                                                {desc}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        {/* Promo Card */}
                        <Box sx={promoCard}>
                            <Box sx={{
                                position: 'absolute', right: -20, top: -20,
                                width: 120, height: 120, borderRadius: '50%',
                                background: 'rgba(255,255,255,0.06)',
                            }} />
                            <Box sx={{
                                position: 'absolute', right: 10, bottom: -30,
                                width: 90, height: 90, borderRadius: '50%',
                                background: 'rgba(255,255,255,0.05)',
                            }} />
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <CheckCircleOutlineRounded sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 18 }} />
                                    <Typography sx={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: '0.5px' }}>
                                        NEW INITIATIVE
                                    </Typography>
                                </Box>
                                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '15px', mb: 0.8 }}>
                                    New Learning Initiative?
                                </Typography>
                                <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px', lineHeight: 1.5, mb: 2 }}>
                                    Courses added here are instantly available to all department heads for curriculum building.
                                </Typography>
                                <Button size="small" sx={{
                                    background: '#fff', color: BRAND_DARK, fontWeight: 700,
                                    fontSize: '12px', borderRadius: '8px', textTransform: 'none',
                                    px: 2, py: 0.6,
                                    '&:hover': { background: 'rgba(255,255,255,0.9)' },
                                }}>
                                    Learn More
                                </Button>
                            </Box>
                        </Box>

                        {/* Bulk Upload */}
                        <Box sx={bulkUploadCard}>
                            <CloudUploadRounded sx={{ fontSize: 36, color: 'grey.300', mb: 0.5 }} />
                            <Typography sx={{ fontWeight: 700, fontSize: '13.5px', color: 'grey.700' }}>
                                Bulk Upload
                            </Typography>
                            <Typography sx={{ fontSize: '12px', color: 'grey.500' }}>
                                Import courses via CSV or JSON
                            </Typography>
                            <Button size="small" startIcon={<DownloadRounded sx={{ fontSize: 14 }} />} sx={{
                                mt: 1, color: BRAND_RED, fontWeight: 600, fontSize: '12px',
                                textTransform: 'none', p: 0,
                                '&:hover': { background: 'transparent', textDecoration: 'underline' },
                            }}>
                                Download Template
                            </Button>
                        </Box>

                    </Box>
                </Box>
            </Box>
        </Fragment>
    );
};

export default AddCourse;
