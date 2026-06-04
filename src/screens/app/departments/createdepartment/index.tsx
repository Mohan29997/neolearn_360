import { Fragment, useState } from 'react';
import {
    Box, Typography, Button, Select, MenuItem, FormControl,
    InputBase, Avatar, Switch, LinearProgress,
    Divider,
} from '@mui/material';
import {
    CorporateFareRounded, ChevronRightRounded,
    EditRounded, SaveRounded, PersonRounded,
} from '@mui/icons-material';
import TabTitle from '../../../../components/tabtitle';
import {
    BRAND_RED, BRAND_DARK,
    breadcrumbRow, twoColLayout, formCard, previewCard,
    fieldRow, fieldLabelSx, inputBase, selectBase, switchSx, actionRow,
    coverImageSx, changeCoverBtnSx, deptIconBoxSx, previewSectionLabelSx,
} from './styles';

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <Typography sx={fieldLabelSx}>{children}</Typography>
);

const CreateDepartment = () => {
    const [departmentName, setDepartmentName] = useState('');
    const [headOfDepartment, setHeadOfDepartment] = useState('');
    const [globalVisibility, setGlobalVisibility] = useState(true);
    const filledCount = [
        departmentName !== '',
        headOfDepartment !== '',
        globalVisibility,
    ].filter(Boolean).length;
    const progress = Math.round((filledCount / 3) * 100);

    const headLabel = headOfDepartment
        ? headOfDepartment.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
        : 'Unassigned';

    return (
        <Fragment>
            <TabTitle title="Create Department" />
            <Box sx={{ width: '100%' }}>

                {/* Breadcrumb */}
                <Box sx={breadcrumbRow}>
                    <Typography variant="subtitle2" sx={{ color: 'grey.500' }}>Departments</Typography>
                    <ChevronRightRounded sx={{ fontSize: 14, color: 'grey.400' }} />
                    <Typography variant="subtitle2" sx={{ color: BRAND_RED, fontWeight: 700 }}>
                        Create New Department
                    </Typography>
                </Box>

                {/* Two-column layout */}
                <Box sx={twoColLayout}>

                    {/* ── Left column — form ── */}
                    <Box sx={{ flex: 7 }}>
                        <Box sx={formCard}>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                                Department Information
                            </Typography>
                            <Typography variant="subtitle1" sx={{ color: 'grey.500', mb: 3 }}>
                                Define the foundational structure for the new corporate department.
                            </Typography>

                            {/* Department Name */}
                            <Box sx={{ mb: 2.5 }}>
                                <FieldLabel>Department Name</FieldLabel>
                                <Box sx={inputBase}>
                                    <InputBase
                                        fullWidth
                                        placeholder="e.g. Strategic Growth & Innovation"
                                        value={departmentName}
                                        onChange={e => setDepartmentName(e.target.value)}
                                        sx={{ fontSize: '13.5px', color: 'grey.800' }}
                                    />
                                </Box>
                            </Box>

                            {/* Head of Department + Global Visibility */}
                            <Box sx={fieldRow}>
                                <Box>
                                    <FieldLabel>Head of Department</FieldLabel>
                                    <FormControl fullWidth size="small">
                                        <Select
                                            displayEmpty
                                            value={headOfDepartment}
                                            onChange={e => setHeadOfDepartment(e.target.value)}
                                            sx={selectBase}
                                            renderValue={v => v
                                                ? v.split('-').map((w: string) => w[0].toUpperCase() + w.slice(1)).join(' ')
                                                : <Typography sx={{ color: 'grey.400', fontSize: '13.5px' }}>Select Leader</Typography>
                                            }
                                        >
                                            <MenuItem value="elena-vance">Elena Vance</MenuItem>
                                            <MenuItem value="mark-scout">Mark Scout</MenuItem>
                                            <MenuItem value="alex-rivera">Alex Rivera</MenuItem>
                                            <MenuItem value="jordan-hayes">Jordan Hayes</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box>
                                    <FieldLabel>Global Visibility</FieldLabel>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: 40, mt: 0.5 }}>
                                        <Switch
                                            checked={globalVisibility}
                                            onChange={e => setGlobalVisibility(e.target.checked)}
                                            sx={switchSx}
                                            size="small"
                                        />
                                        <Typography sx={{ fontSize: '13.5px', color: 'grey.700' }}>
                                            Visible to all users
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>


                            {/* Actions */}
                            <Box sx={actionRow}>
                                <Button
                                    variant="text"
                                    sx={{
                                        color: 'grey.600',
                                        fontWeight: 600,
                                        fontSize: '13px',
                                        textTransform: 'none',
                                        px: 2,
                                    }}
                                >
                                    Discard Changes
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<SaveRounded />}
                                    sx={{
                                        background: BRAND_DARK,
                                        fontWeight: 600,
                                        fontSize: '13px',
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        px: 3,
                                        boxShadow: '0 4px 14px rgba(138,3,3,0.25)',
                                        '&:hover': { background: BRAND_RED },
                                    }}
                                >
                                    Save Department
                                </Button>
                            </Box>
                        </Box>
                    </Box>

                    {/* ── Right column — Identity Preview ── */}
                    <Box sx={{ flex: 3, position: 'sticky', top: 72 }}>
                        <Box sx={previewCard}>
                            {/* Cover image */}
                            <Box sx={coverImageSx}>
                                <Button size="small" startIcon={<EditRounded sx={{ fontSize: '12px !important' }} />} sx={changeCoverBtnSx}>
                                    Change Cover
                                </Button>
                            </Box>

                            {/* Icon + name (overlaps cover) */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: -3.5, pb: 2.5, px: 2 }}>
                                <Box sx={deptIconBoxSx}>
                                    <CorporateFareRounded sx={{ color: BRAND_RED, fontSize: 28 }} />
                                </Box>
                                <Typography variant="h5" sx={{ mt: 1.5, fontWeight: 700, textAlign: 'center' }}>
                                    {departmentName || 'New Department'}
                                </Typography>
                                <Box sx={{ mt: 0.5, px: 1.2, py: 0.3, borderRadius: '4px', background: '#F9FAFB' }}>
                                    <Typography sx={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.8px', color: 'grey.400' }}>
                                        STATUS: DRAFTING
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ borderColor: 'grey.100', mx: 2 }} />

                            {/* Department Lead */}
                            <Box sx={{ px: 2, py: 1.5 }}>
                                <Typography sx={previewSectionLabelSx}>Department Lead</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                    <Avatar sx={{ width: 30, height: 30, bgcolor: 'grey.200' }}>
                                        <PersonRounded sx={{ fontSize: 16, color: 'grey.500' }} />
                                    </Avatar>
                                    <Typography sx={{ fontSize: '13px', color: headOfDepartment ? 'grey.800' : 'grey.400' }}>
                                        {headLabel}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ borderColor: 'grey.100', mx: 2 }} />

                            {/* Setup Progress */}
                            <Box sx={{ px: 2, py: 1.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography sx={previewSectionLabelSx}>Setup Progress</Typography>
                                    <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'grey.700' }}>
                                        {progress}%
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={progress}
                                    sx={{
                                        height: 6,
                                        borderRadius: 3,
                                        bgcolor: 'grey.100',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: BRAND_RED,
                                            borderRadius: 3,
                                        },
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>

                </Box>
            </Box>
        </Fragment>
    );
};

export default CreateDepartment;
